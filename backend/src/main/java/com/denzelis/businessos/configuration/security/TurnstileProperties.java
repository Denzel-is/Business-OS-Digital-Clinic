package com.denzelis.businessos.configuration.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "business-os.security.turnstile")
public record TurnstileProperties(
        boolean enabled, String secretKey, String expectedHostname, String expectedAction) {

    public TurnstileProperties {
        secretKey = secretKey == null ? "" : secretKey;
        expectedHostname = expectedHostname == null ? "" : expectedHostname;
        expectedAction =
                expectedAction == null || expectedAction.isBlank() ? "contact" : expectedAction;
    }
}
