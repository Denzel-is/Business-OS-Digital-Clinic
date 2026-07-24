package com.denzelis.businessos.auth.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.denzelis.businessos.auth.application.AuthenticationMonitoringService;
import com.denzelis.businessos.security.application.ClientFingerprint;
import com.denzelis.businessos.security.application.SecurityCounterService;
import com.denzelis.businessos.user.infrastructure.persistence.UserAccountRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfTokenRepository;

class AuthenticationControllerRateLimitTests {

    @Mock private AuthenticationManager authenticationManager;
    @Mock private AuthenticationMonitoringService monitoringService;
    @Mock private ClientFingerprint clientFingerprint;
    @Mock private CsrfTokenRepository csrfTokenRepository;
    @Mock private SecurityContextRepository securityContextRepository;
    @Mock private SecurityCounterService counterService;
    @Mock private UserAccountRepository userAccountRepository;

    private AutoCloseable mocks;
    private AuthenticationController controller;

    @BeforeEach
    void setUp() {
        mocks = MockitoAnnotations.openMocks(this);
        controller =
                new AuthenticationController(
                        authenticationManager,
                        monitoringService,
                        clientFingerprint,
                        csrfTokenRepository,
                        securityContextRepository,
                        counterService,
                        userAccountRepository);
    }

    @AfterEach
    void tearDown() throws Exception {
        mocks.close();
    }

    @Test
    void blocksCredentialVerificationForAThrottledAccountFingerprint() {
        when(clientFingerprint.hash("admin@example.test")).thenReturn("account-fingerprint");
        when(clientFingerprint.from(org.mockito.ArgumentMatchers.any()))
                .thenReturn("client-fingerprint");
        when(counterService.isBlocked("login-account", "account-fingerprint", 8)).thenReturn(true);

        var response =
                controller.login(
                        new LoginRequest("ADMIN@example.test", "test-password"),
                        new MockHttpServletRequest(),
                        new MockHttpServletResponse());

        assertThat(response.getStatusCode().value()).isEqualTo(429);
        assertThat(response.getHeaders().getFirst("Retry-After")).isEqualTo("900");
        assertThat(String.valueOf(response.getBody()))
                .contains("Too Many Requests")
                .doesNotContain("admin@example.test");
        verify(authenticationManager, never()).authenticate(org.mockito.ArgumentMatchers.any());
    }
}
