package com.denzelis.businessos.diagnostic.api;

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
class DiagnosticApiTests {

    private static final String VALID_REQUEST =
            """
            {
              "businessType": "SERVICES",
              "teamSize": "ELEVEN_TO_FIFTY",
              "primaryProblem": "LOST_LEADS",
              "manualOperations": "REGULAR",
              "existingSystems": "FRAGMENTED",
              "digitalProduct": "OUTDATED",
              "leadHandling": "MANUAL",
              "analytics": "MANUAL",
              "aiUsage": "EXPERIMENTING",
              "personalData": "REGULAR",
              "expectedResult": "GROW_REVENUE"
            }
            """;

    private final WebApplicationContext applicationContext;
    private MockMvc mockMvc;

    @Autowired
    DiagnosticApiTests(WebApplicationContext applicationContext) {
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
    void evaluatesAnonymousRequestWithoutCreatingSessionOrRequiringCsrf() throws Exception {
        mockMvc.perform(
                        post("/api/v1/diagnostics/evaluate")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(VALID_REQUEST))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(header().string(HttpHeaders.CACHE_CONTROL, "no-store"))
                .andExpect(jsonPath("$.score").isNumber())
                .andExpect(jsonPath("$.findings").isArray())
                .andExpect(jsonPath("$.priorities").isArray())
                .andExpect(jsonPath("$.recommendations").isArray())
                .andExpect(jsonPath("$.services").isArray())
                .andExpect(jsonPath("$.cases").isArray())
                .andExpect(jsonPath("$.implementationSequence").isArray())
                .andExpect(
                        jsonPath("$.disclaimer")
                                .value(org.hamcrest.Matchers.containsString("не заменяет")))
                .andExpect(jsonPath("$.contact").doesNotExist())
                .andExpect(jsonPath("$.email").doesNotExist());
    }

    @Test
    void rejectsIncompleteAnswersWithProblemDetails() throws Exception {
        mockMvc.perform(
                        post("/api/v1/diagnostics/evaluate")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"businessType\":\"SERVICES\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.type").value("urn:business-os:problem:validation-error"))
                .andExpect(jsonPath("$.errors").isArray());
    }

    @Test
    void rejectsUnknownAnswerValuesWithoutReturningInternalDetails() throws Exception {
        String malformed = VALID_REQUEST.replace("\"SERVICES\"", "\"UNKNOWN_TYPE\"");

        mockMvc.perform(
                        post("/api/v1/diagnostics/evaluate")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(malformed))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.type").value("urn:business-os:problem:malformed-input"))
                .andExpect(jsonPath("$.detail").value("The request body could not be read."));
    }
}
