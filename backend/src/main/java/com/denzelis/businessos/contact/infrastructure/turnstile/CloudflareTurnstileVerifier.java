package com.denzelis.businessos.contact.infrastructure.turnstile;

import com.denzelis.businessos.configuration.security.TurnstileProperties;
import com.denzelis.businessos.contact.application.TurnstileVerifier;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
@ConditionalOnProperty(
        prefix = "business-os.security.turnstile",
        name = "enabled",
        havingValue = "true")
public class CloudflareTurnstileVerifier implements TurnstileVerifier {

    private static final String SITEVERIFY_URL =
            "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    private final TurnstileProperties properties;
    private final RestClient restClient;

    public CloudflareTurnstileVerifier(TurnstileProperties properties) {
        if (properties.secretKey().isBlank()) {
            throw new IllegalStateException(
                    "TURNSTILE_SECRET_KEY is required when Turnstile is enabled");
        }
        this.properties = properties;
        HttpClient httpClient =
                HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(5));
        this.restClient = RestClient.builder().requestFactory(requestFactory).build();
    }

    @Override
    public boolean verify(String token) {
        if (token == null || token.isBlank() || token.length() > 2048) {
            return false;
        }

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("secret", properties.secretKey());
        body.add("response", token);
        try {
            SiteverifyResponse response =
                    restClient
                            .post()
                            .uri(SITEVERIFY_URL)
                            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                            .body(body)
                            .retrieve()
                            .body(SiteverifyResponse.class);
            return response != null
                    && response.success()
                    && expected(response.hostname(), properties.expectedHostname())
                    && expected(response.action(), properties.expectedAction());
        } catch (RestClientException exception) {
            return false;
        }
    }

    private static boolean expected(String actual, String configured) {
        return configured.isBlank() || configured.equalsIgnoreCase(actual);
    }

    private record SiteverifyResponse(
            boolean success,
            String hostname,
            String action,
            @JsonProperty("error-codes") List<String> errorCodes) {}
}
