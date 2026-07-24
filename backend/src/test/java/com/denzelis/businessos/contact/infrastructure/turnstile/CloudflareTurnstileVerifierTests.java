package com.denzelis.businessos.contact.infrastructure.turnstile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.denzelis.businessos.configuration.security.TurnstileProperties;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class CloudflareTurnstileVerifierTests {

    private static final String SITEVERIFY =
            "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    @Test
    void acceptsOnlyExpectedHostnameAndAction() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        CloudflareTurnstileVerifier verifier =
                new CloudflareTurnstileVerifier(
                        new TurnstileProperties(true, "test-secret", "clinic.example", "contact"),
                        builder.build());
        server.expect(requestTo(SITEVERIFY))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("test-secret")))
                .andRespond(
                        withSuccess(
                                """
                                {
                                  "success": true,
                                  "hostname": "clinic.example",
                                  "action": "contact",
                                  "error-codes": []
                                }
                                """,
                                MediaType.APPLICATION_JSON));

        assertThat(verifier.verify("valid-token")).isTrue();
        server.verify();
    }

    @Test
    void failsClosedForWrongActionAndUpstreamFailure() {
        RestClient.Builder wrongActionBuilder = RestClient.builder();
        MockRestServiceServer wrongActionServer =
                MockRestServiceServer.bindTo(wrongActionBuilder).build();
        CloudflareTurnstileVerifier wrongActionVerifier =
                new CloudflareTurnstileVerifier(properties(), wrongActionBuilder.build());
        wrongActionServer
                .expect(requestTo(SITEVERIFY))
                .andRespond(
                        withSuccess(
                                """
                                {
                                  "success": true,
                                  "hostname": "clinic.example",
                                  "action": "login",
                                  "error-codes": []
                                }
                                """,
                                MediaType.APPLICATION_JSON));
        assertThat(wrongActionVerifier.verify("wrong-action")).isFalse();

        RestClient.Builder failingBuilder = RestClient.builder();
        MockRestServiceServer failingServer = MockRestServiceServer.bindTo(failingBuilder).build();
        CloudflareTurnstileVerifier failingVerifier =
                new CloudflareTurnstileVerifier(properties(), failingBuilder.build());
        failingServer.expect(requestTo(SITEVERIFY)).andRespond(withServerError());
        assertThat(failingVerifier.verify("upstream-error")).isFalse();
    }

    @Test
    void rejectsMissingConfigurationAndOversizedTokensWithoutNetworkCall() {
        assertThatThrownBy(
                        () ->
                                new CloudflareTurnstileVerifier(
                                        new TurnstileProperties(
                                                true, "", "clinic.example", "contact"),
                                        RestClient.create()))
                .isInstanceOf(IllegalStateException.class);

        CloudflareTurnstileVerifier verifier =
                new CloudflareTurnstileVerifier(properties(), RestClient.create());
        assertThat(verifier.verify("")).isFalse();
        assertThat(verifier.verify("x".repeat(2049))).isFalse();
    }

    private static TurnstileProperties properties() {
        return new TurnstileProperties(true, "test-secret", "clinic.example", "contact");
    }
}
