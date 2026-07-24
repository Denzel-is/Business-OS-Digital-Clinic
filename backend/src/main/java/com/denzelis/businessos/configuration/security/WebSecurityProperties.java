package com.denzelis.businessos.configuration.security;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "business-os.security")
public record WebSecurityProperties(
        @NotEmpty List<@Valid @NotBlank String> allowedOrigins,
        boolean cookieSecure,
        @NotBlank String cookieSameSite) {

    public WebSecurityProperties {
        allowedOrigins = allowedOrigins == null ? List.of() : List.copyOf(allowedOrigins);
        cookieSameSite = cookieSameSite == null ? "Lax" : cookieSameSite;
    }
}
