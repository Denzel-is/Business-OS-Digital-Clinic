package com.denzelis.businessos.security.application;

import static org.assertj.core.api.Assertions.assertThat;

import com.denzelis.businessos.configuration.security.RateLimitProperties;
import org.junit.jupiter.api.Test;

class ClientFingerprintTests {

    @Test
    void isDeterministicWithoutRetainingTheRawIdentifier() {
        ClientFingerprint fingerprint =
                new ClientFingerprint(new RateLimitProperties(true, "test-only-salt"));

        String first = fingerprint.hash("person@example.test");
        String second = fingerprint.hash("person@example.test");

        assertThat(first)
                .isEqualTo(second)
                .hasSize(64)
                .doesNotContain("person")
                .doesNotContain("@");
    }

    @Test
    void deploymentSaltChangesTheFingerprint() {
        String first =
                new ClientFingerprint(new RateLimitProperties(true, "first-salt"))
                        .hash("127.0.0.1");
        String second =
                new ClientFingerprint(new RateLimitProperties(true, "second-salt"))
                        .hash("127.0.0.1");

        assertThat(first).isNotEqualTo(second);
    }
}
