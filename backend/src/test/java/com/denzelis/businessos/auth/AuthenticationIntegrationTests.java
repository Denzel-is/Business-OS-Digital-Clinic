package com.denzelis.businessos.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.denzelis.businessos.BusinessOsBackendApplication;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@ActiveProfiles("postgres-integration")
@SpringBootTest(
        classes = BusinessOsBackendApplication.class,
        properties = {
            "business-os.bootstrap-admin.enabled=true",
            "business-os.bootstrap-admin.email=admin@example.test",
            "business-os.bootstrap-admin.password=correct-horse-battery-staple",
            "business-os.bootstrap-admin.display-name=Test administrator"
        })
@Testcontainers
class AuthenticationIntegrationTests {

    @Container @ServiceConnection
    static final PostgreSQLContainer postgres =
            new PostgreSQLContainer("postgres:17-alpine")
                    .withDatabaseName("business_os_auth_test")
                    .withUsername("business_os_test")
                    .withPassword("test-only-password");

    private final WebApplicationContext applicationContext;
    private final JdbcTemplate jdbcTemplate;

    private MockMvc mockMvc;

    @Autowired
    AuthenticationIntegrationTests(
            WebApplicationContext applicationContext, JdbcTemplate jdbcTemplate) {
        this.applicationContext = applicationContext;
        this.jdbcTemplate = jdbcTemplate;
    }

    @BeforeEach
    void setUp() {
        mockMvc =
                MockMvcBuilders.webAppContextSetup(applicationContext)
                        .apply(springSecurity())
                        .build();
    }

    @Test
    void authenticatesWithBcryptAndPersistsAProtectedSession() throws Exception {
        long auditEventsBefore = count("audit_log");
        MvcResult login =
                mockMvc.perform(
                                post("/api/v1/auth/login")
                                        .with(csrf())
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(
                                                """
                                                {
                                                  "email": "ADMIN@example.test",
                                                  "password": "correct-horse-battery-staple"
                                                }
                                                """))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.authenticated").value(true))
                        .andExpect(jsonPath("$.displayName").value("Test administrator"))
                        .andExpect(jsonPath("$.roles[0]").value("ADMIN"))
                        .andReturn();

        HttpSession session = login.getRequest().getSession(false);
        assertThat(session).isNotNull();

        mockMvc.perform(
                        get("/api/v1/admin/overview")
                                .session((org.springframework.mock.web.MockHttpSession) session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.modules[?(@.slug == 'projects')].itemCount").value(6))
                .andExpect(jsonPath("$.modules[?(@.slug == 'users')].itemCount").value(1));

        String passwordHash =
                jdbcTemplate.queryForObject(
                        "SELECT password_hash FROM app_user WHERE email_normalized = ?",
                        String.class,
                        "admin@example.test");
        assertThat(passwordHash)
                .startsWith("$2")
                .contains("$12$")
                .doesNotContain("correct-horse-battery-staple");
        assertThat(count("audit_log")).isEqualTo(auditEventsBefore + 1);
        assertThat(
                        jdbcTemplate.queryForObject(
                                "SELECT action FROM audit_log ORDER BY created_at DESC LIMIT 1",
                                String.class))
                .isEqualTo("LOGIN");
    }

    @Test
    void returnsTheSameGenericFailureForUnknownAccountAndWrongPassword() throws Exception {
        long securityEventsBefore = count("security_event");
        String wrongPassword = loginFailure("admin@example.test", "this-password-is-not-correct");
        String unknownAccount =
                loginFailure("unknown@example.test", "this-password-is-not-correct");

        assertThat(wrongPassword).isEqualTo(unknownAccount);
        assertThat(wrongPassword).contains("Email or password is invalid.");
        assertThat(count("security_event")).isEqualTo(securityEventsBefore + 2);
    }

    @Test
    void rejectsLoginAndLogoutWithoutCsrf() throws Exception {
        mockMvc.perform(
                        post("/api/v1/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        """
                                        {
                                          "email": "admin@example.test",
                                          "password": "correct-horse-battery-staple"
                                        }
                                        """))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/v1/auth/logout")).andExpect(status().isForbidden());
    }

    @Test
    void rejectsAnonymousAdminAccess() throws Exception {
        mockMvc.perform(get("/api/v1/admin/overview"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON));
    }

    @Test
    @WithMockUser(roles = "EDITOR")
    void editorCanReadContentButCannotReadSystemResources() throws Exception {
        mockMvc.perform(get("/api/v1/admin/content/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalItems").value(6));
        mockMvc.perform(get("/api/v1/admin/system/users")).andExpect(status().isForbidden());
    }

    private String loginFailure(String email, String password) throws Exception {
        return mockMvc.perform(
                        post("/api/v1/auth/login")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        """
                                        {"email":"%s","password":"%s"}
                                        """
                                                .formatted(email, password)))
                .andExpect(status().isUnauthorized())
                .andReturn()
                .getResponse()
                .getContentAsString();
    }

    private long count(String table) {
        String query =
                switch (table) {
                    case "audit_log" -> "SELECT COUNT(*) FROM audit_log";
                    case "security_event" -> "SELECT COUNT(*) FROM security_event";
                    default -> throw new IllegalArgumentException("Unknown test table");
                };
        Long value = jdbcTemplate.queryForObject(query, Long.class);
        return value == null ? 0 : value;
    }
}
