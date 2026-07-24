package com.denzelis.businessos.configuration.security;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "business-os.security.rate-limit")
public record RateLimitProperties(boolean enabled, @NotBlank String keySalt) {

    public RateLimitProperties {
        keySalt = keySalt == null ? "" : keySalt;
    }
}
