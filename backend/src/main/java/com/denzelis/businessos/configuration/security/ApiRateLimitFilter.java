package com.denzelis.businessos.configuration.security;

import com.denzelis.businessos.auth.application.AuthenticationMonitoringService;
import com.denzelis.businessos.security.application.ClientFingerprint;
import com.denzelis.businessos.security.application.RateLimitDecision;
import com.denzelis.businessos.security.application.SecurityCounterService;
import io.micrometer.core.instrument.MeterRegistry;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class ApiRateLimitFilter extends OncePerRequestFilter {

    private final ClientFingerprint clientFingerprint;
    private final AuthenticationMonitoringService monitoringService;
    private final MeterRegistry meterRegistry;
    private final RateLimitProperties properties;
    private final SecurityCounterService counterService;

    public ApiRateLimitFilter(
            ClientFingerprint clientFingerprint,
            AuthenticationMonitoringService monitoringService,
            MeterRegistry meterRegistry,
            RateLimitProperties properties,
            SecurityCounterService counterService) {
        this.clientFingerprint = clientFingerprint;
        this.monitoringService = monitoringService;
        this.meterRegistry = meterRegistry;
        this.properties = properties;
        this.counterService = counterService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Policy policy = policy(request);
        if (!properties.enabled() || policy == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String sourceHash = clientFingerprint.from(request);
        RateLimitDecision decision;
        try {
            decision =
                    counterService.consume(
                            policy.namespace(), sourceHash, policy.capacity(), policy.window());
        } catch (DataAccessException | IllegalStateException exception) {
            meterRegistry
                    .counter(
                            "business_os.security.rate_limit.unavailable",
                            "policy",
                            policy.namespace())
                    .increment();
            SecurityProblemWriter.writeServiceUnavailable(response);
            return;
        }

        if (!decision.allowed()) {
            meterRegistry
                    .counter("business_os.security.rate_limit.denied", "policy", policy.namespace())
                    .increment();
            if (decision.observedCount() == policy.capacity() + 1) {
                try {
                    monitoringService.rateLimitExceeded(sourceHash, policy.namespace());
                } catch (RuntimeException exception) {
                    meterRegistry.counter("business_os.security.audit.unavailable").increment();
                }
            }
            SecurityProblemWriter.writeTooManyRequests(response, decision.retryAfter());
            return;
        }
        filterChain.doFilter(request, response);
    }

    private static Policy policy(HttpServletRequest request) {
        if (!HttpMethod.POST.matches(request.getMethod())) {
            return null;
        }
        return switch (request.getRequestURI()) {
            case "/api/v1/auth/login" -> new Policy("login-ip", 20, Duration.ofMinutes(1));
            case "/api/v1/diagnostics/evaluate" ->
                    new Policy("diagnostic", 30, Duration.ofMinutes(1));
            case "/api/v1/security/input-validation-demo" ->
                    new Policy("validation-demo", 20, Duration.ofMinutes(1));
            case "/api/v1/contact-requests" -> new Policy("contact", 5, Duration.ofMinutes(10));
            default -> null;
        };
    }

    private record Policy(String namespace, long capacity, Duration window) {}
}
