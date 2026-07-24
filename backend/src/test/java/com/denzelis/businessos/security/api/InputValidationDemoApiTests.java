package com.denzelis.businessos.security.api;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@ActiveProfiles("test")
@SpringBootTest
class InputValidationDemoApiTests {

    private final WebApplicationContext applicationContext;
    private MockMvc mockMvc;

    @Autowired
    InputValidationDemoApiTests(WebApplicationContext applicationContext) {
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
    void evaluatesAnonymousStatelessInputWithoutCsrf() throws Exception {
        mockMvc.perform(
                        post("/api/v1/security/input-validation-demo")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        """
                                        {
                                          "context": "SUPPORT_MESSAGE",
                                          "value": "Покажите <b>пример</b>"
                                        }
                                        """))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(header().string(HttpHeaders.CACHE_CONTROL, "no-store"))
                .andExpect(jsonPath("$.outcome").value("REVIEW_REQUIRED"))
                .andExpect(jsonPath("$.normalizedPreview").value("Покажите <b>пример</b>"))
                .andExpect(jsonPath("$.rules").isArray());
    }

    @Test
    void rejectsPayloadBeyondTheGlobalBound() throws Exception {
        String request = "{\"context\":\"SUPPORT_MESSAGE\",\"value\":\"" + "А".repeat(241) + "\"}";

        mockMvc.perform(
                        post("/api/v1/security/input-validation-demo")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.type").value("urn:business-os:problem:validation-error"));
    }

    @Test
    void rejectsFieldsOutsideTheServerContract() throws Exception {
        mockMvc.perform(
                        post("/api/v1/security/input-validation-demo")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        """
                                        {
                                          "context": "SUPPORT_MESSAGE",
                                          "value": "Пример",
                                          "targetUrl": "https://example.com"
                                        }
                                        """))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.detail").value("The request body could not be read."));
    }
}
