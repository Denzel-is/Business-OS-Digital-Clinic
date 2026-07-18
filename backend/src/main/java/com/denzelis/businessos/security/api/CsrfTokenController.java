package com.denzelis.businessos.security.api;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/security/csrf")
public class CsrfTokenController {

    @GetMapping
    ResponseEntity<CsrfTokenResponse> csrfToken(CsrfToken csrfToken) {
        CsrfTokenResponse response =
                new CsrfTokenResponse(
                        csrfToken.getHeaderName(),
                        csrfToken.getParameterName(),
                        csrfToken.getToken());
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(response);
    }
}
