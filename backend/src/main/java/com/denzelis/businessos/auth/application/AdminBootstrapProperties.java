package com.denzelis.businessos.auth.application;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "business-os.bootstrap-admin")
public record AdminBootstrapProperties(
        boolean enabled, String email, String password, String displayName) {

    public AdminBootstrapProperties {
        email = email == null ? "" : email;
        password = password == null ? "" : password;
        displayName = displayName == null ? "" : displayName;
    }
}
