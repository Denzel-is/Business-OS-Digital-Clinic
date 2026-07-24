package com.denzelis.businessos.configuration.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.denzelis.businessos.auth.application.AuthenticationMonitoringService;
import com.denzelis.businessos.security.application.ClientFingerprint;
import com.denzelis.businessos.security.application.RateLimitDecision;
import com.denzelis.businessos.security.application.SecurityCounterService;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import java.time.Duration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class ApiRateLimitFilterTests {

    @Mock private AuthenticationMonitoringService monitoringService;
    @Mock private ClientFingerprint clientFingerprint;
    @Mock private SecurityCounterService counterService;

    private AutoCloseable mocks;
    private ApiRateLimitFilter filter;

    @BeforeEach
    void setUp() {
        mocks = MockitoAnnotations.openMocks(this);
        when(clientFingerprint.from(any())).thenReturn("hashed-client");
        filter =
                new ApiRateLimitFilter(
                        clientFingerprint,
                        monitoringService,
                        new SimpleMeterRegistry(),
                        new RateLimitProperties(true, "test-only-salt"),
                        counterService);
    }

    @org.junit.jupiter.api.AfterEach
    void tearDown() throws Exception {
        mocks.close();
    }

    @Test
    void returns429AndRetryAfterWithoutCallingDownstream() throws Exception {
        when(counterService.consume(anyString(), anyString(), anyLong(), any()))
                .thenReturn(RateLimitDecision.denied(21, Duration.ofMinutes(1)));
        MockHttpServletRequest request = post("/api/v1/auth/login");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(429);
        assertThat(response.getHeader("Retry-After")).isEqualTo("60");
        assertThat(response.getContentAsString()).contains("Too Many Requests");
        assertThat(chain.getRequest()).isNull();
        verify(monitoringService).rateLimitExceeded("hashed-client", "login-ip");
    }

    @Test
    void failsClosedWhenRedisCannotMakeADecision() throws Exception {
        when(counterService.consume(anyString(), anyString(), anyLong(), any()))
                .thenThrow(new DataAccessResourceFailureException("redis unavailable"));
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(post("/api/v1/contact-requests"), response, chain);

        assertThat(response.getStatus()).isEqualTo(503);
        assertThat(response.getContentAsString()).doesNotContain("redis");
        assertThat(chain.getRequest()).isNull();
        verify(monitoringService, never()).rateLimitExceeded(anyString(), anyString());
    }

    @Test
    void doesNotMisclassifyADownstreamFailureAsRedisUnavailability() {
        when(counterService.consume(anyString(), anyString(), anyLong(), any()))
                .thenReturn(RateLimitDecision.allowed(1));
        MockHttpServletRequest request = post("/api/v1/diagnostics/evaluate");
        MockHttpServletResponse response = new MockHttpServletResponse();

        assertThatThrownBy(
                        () ->
                                filter.doFilter(
                                        request,
                                        response,
                                        (servletRequest, servletResponse) -> {
                                            throw new IllegalStateException(
                                                    "downstream application failure");
                                        }))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("downstream application failure");
        assertThat(response.getStatus()).isEqualTo(200);
    }

    private static MockHttpServletRequest post(String path) {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", path);
        request.setRemoteAddr("127.0.0.1");
        return request;
    }
}
