package com.denzelis.businessos.security;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.denzelis.businessos.BusinessOsBackendApplication;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@ActiveProfiles("postgres-integration")
@SpringBootTest(
        classes = BusinessOsBackendApplication.class,
        properties = "business-os.media-storage.directory=target/test-uploads-hardening")
@Testcontainers
class SecurityHardeningIntegrationTests {

    @Container @ServiceConnection
    static final PostgreSQLContainer postgres =
            new PostgreSQLContainer("postgres:17-alpine")
                    .withDatabaseName("business_os_hardening_test")
                    .withUsername("business_os_test")
                    .withPassword("test-only-password");

    private final WebApplicationContext applicationContext;
    private final JdbcTemplate jdbcTemplate;

    private MockMvc mockMvc;

    @Autowired
    SecurityHardeningIntegrationTests(
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
    void savesAConsentedContactAndCreatesAMinimalLead() throws Exception {
        long contactsBefore = count("contact_request");
        long leadsBefore = count("lead");

        mockMvc.perform(
                        post("/api/v1/contact-requests")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        """
                                        {
                                          "name": "Test contact",
                                          "email": "CONTACT@example.test",
                                          "message": "Please review the current request processing flow.",
                                          "consent": true,
                                          "website": "",
                                          "turnstileToken": ""
                                        }
                                        """))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.accepted").value(true));

        org.assertj.core.api.Assertions.assertThat(count("contact_request"))
                .isEqualTo(contactsBefore + 1);
        org.assertj.core.api.Assertions.assertThat(count("lead")).isEqualTo(leadsBefore + 1);
        org.assertj.core.api.Assertions.assertThat(
                        jdbcTemplate.queryForObject(
                                "SELECT summary FROM lead ORDER BY created_at DESC LIMIT 1",
                                String.class))
                .isEqualTo("New consented contact request");
    }

    @Test
    void honeypotDoesNotPersistSubmittedPersonalFields() throws Exception {
        long contactsBefore = count("contact_request");
        long eventsBefore = count("security_event");

        mockMvc.perform(
                        post("/api/v1/contact-requests")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        """
                                        {
                                          "name": "Bot supplied name",
                                          "email": "bot@example.test",
                                          "message": "This body must never be persisted by the honeypot path.",
                                          "consent": true,
                                          "website": "https://spam.example",
                                          "turnstileToken": ""
                                        }
                                        """))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.accepted").value(true));

        org.assertj.core.api.Assertions.assertThat(count("contact_request"))
                .isEqualTo(contactsBefore);
        org.assertj.core.api.Assertions.assertThat(count("security_event"))
                .isEqualTo(eventsBefore + 1);
    }

    @Test
    void rejectsContactWithoutExplicitConsent() throws Exception {
        mockMvc.perform(
                        post("/api/v1/contact-requests")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        """
                                        {
                                          "name": "No consent",
                                          "email": "no-consent@example.test",
                                          "message": "This request does not grant consent and must be rejected.",
                                          "consent": false,
                                          "website": "",
                                          "turnstileToken": ""
                                        }
                                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors[0].field").value("consent"));
    }

    @Test
    @WithMockUser(roles = "EDITOR")
    void acceptsSignatureAllowlistedMediaAndRejectsUnknownBytes() throws Exception {
        MockMultipartFile image =
                new MockMultipartFile(
                        "file",
                        "../../payload.html",
                        "text/html",
                        new byte[] {(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00});

        mockMvc.perform(
                        multipart("/api/v1/admin/content/media")
                                .file(image)
                                .param("projectId", "50000000-0000-4000-8000-000000000001")
                                .param("altText", "Safe demo image")
                                .param("sortOrder", "90")
                                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$.storageKey")
                                .value(org.hamcrest.Matchers.matchesPattern("[0-9a-f-]+\\.png")))
                .andExpect(jsonPath("$.mediaType").value("IMAGE"))
                .andExpect(jsonPath("$.status").value("DRAFT"));

        MockMultipartFile unknown =
                new MockMultipartFile("file", "payload.svg", "image/svg+xml", "<svg/>".getBytes());
        mockMvc.perform(
                        multipart("/api/v1/admin/content/media")
                                .file(unknown)
                                .param("projectId", "50000000-0000-4000-8000-000000000001")
                                .param("altText", "Rejected SVG")
                                .param("sortOrder", "91")
                                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Upload rejected"));
    }

    @Test
    void rejectsAnonymousMediaUpload() throws Exception {
        MockMultipartFile file =
                new MockMultipartFile("file", "image.png", "image/png", new byte[] {1, 2, 3, 4});
        mockMvc.perform(
                        multipart("/api/v1/admin/content/media")
                                .file(file)
                                .param("projectId", "50000000-0000-4000-8000-000000000001")
                                .param("altText", "Anonymous")
                                .with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    private long count(String table) {
        String query =
                switch (table) {
                    case "contact_request" -> "SELECT COUNT(*) FROM contact_request";
                    case "lead" -> "SELECT COUNT(*) FROM lead";
                    case "security_event" -> "SELECT COUNT(*) FROM security_event";
                    default -> throw new IllegalArgumentException("Unknown test table");
                };
        Long value = jdbcTemplate.queryForObject(query, Long.class);
        return value == null ? 0 : value;
    }
}
