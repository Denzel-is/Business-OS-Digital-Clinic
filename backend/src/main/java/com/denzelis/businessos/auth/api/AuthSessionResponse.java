package com.denzelis.businessos.auth.api;

import java.util.List;

public record AuthSessionResponse(
        boolean authenticated,
        String displayName,
        List<String> roles,
        boolean mfaRequired,
        boolean mfaReady) {

    static AuthSessionResponse anonymous() {
        return new AuthSessionResponse(false, "", List.of(), false, true);
    }
}
