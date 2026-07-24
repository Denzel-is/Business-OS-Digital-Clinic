package com.denzelis.businessos.security;

import static org.hamcrest.Matchers.matchesPattern;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.denzelis.businessos.BusinessOsBackendApplication;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@ActiveProfiles("test")
@SpringBootTest(classes = BusinessOsBackendApplication.class)
class SecurityApiTests {

    private final WebApplicationContext applicationContext;

    private MockMvc mockMvc;

    @Autowired
    SecurityApiTests(WebApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @BeforeEach
    void setUp() {
        mockMvc =
                MockMvcBuilders.webAppContextSetup(applicationContext)
                        .apply(springSecurity())
                        .build();
    }

    @Test
    void exposesPublicSystemStatusWithSecurityHeaders() throws Exception {
        mockMvc.perform(get("/api/v1/system/status"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(
                        header().string(HttpHeaders.CACHE_CONTROL, matchesPattern(".*no-store.*")))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(header().string("X-Frame-Options", "DENY"))
                .andExpect(
                        header().string(
                                        "Content-Security-Policy",
                                        "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"))
                .andExpect(jsonPath("$.service").value("business-os-backend"))
                .andExpect(jsonPath("$.status").value("available"));
    }

    @Test
    void issuesCsrfTokenWithoutCachingIt() throws Exception {
        mockMvc.perform(get("/api/v1/security/csrf"))
                .andExpect(status().isOk())
                .andExpect(
                        header().string(HttpHeaders.CACHE_CONTROL, matchesPattern(".*no-store.*")))
                .andExpect(cookie().exists("XSRF-TOKEN"))
                .andExpect(jsonPath("$.headerName").value("X-XSRF-TOKEN"))
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void protectsNonPublicActuatorEndpoints() throws Exception {
        mockMvc.perform(get("/actuator/info"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void rejectsStateChangingRequestWithoutCsrfToken() throws Exception {
        mockMvc.perform(post("/api/v1/system/status"))
                .andExpect(status().isForbidden())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    void allowsConfiguredCorsOriginAndRejectsUnknownOrigin() throws Exception {
        mockMvc.perform(
                        options("/api/v1/contact-requests")
                                .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                                .header(
                                        HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD,
                                        HttpMethod.POST.name()))
                .andExpect(status().isOk())
                .andExpect(
                        header().string(
                                        HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN,
                                        "http://localhost:3000"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"));

        mockMvc.perform(
                        options("/api/v1/contact-requests")
                                .header(HttpHeaders.ORIGIN, "https://attacker.example")
                                .header(
                                        HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD,
                                        HttpMethod.POST.name()))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
    }
}
