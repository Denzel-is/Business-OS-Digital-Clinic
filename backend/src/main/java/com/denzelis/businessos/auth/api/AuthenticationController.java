package com.denzelis.businessos.auth.api;

import com.denzelis.businessos.auth.application.AuthenticationMonitoringService;
import com.denzelis.businessos.security.application.ClientFingerprint;
import com.denzelis.businessos.security.application.RateLimitDecision;
import com.denzelis.businessos.security.application.SecurityCounterService;
import com.denzelis.businessos.user.infrastructure.persistence.UserAccountEntity;
import com.denzelis.businessos.user.infrastructure.persistence.UserAccountRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.time.Duration;
import java.util.List;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private static final String INVALID_CREDENTIALS =
            """
            {"type":"about:blank","title":"Unauthorized","status":401,"detail":"Email or password is invalid."}
            """;
    private static final String TOO_MANY_ATTEMPTS =
            """
            {"type":"about:blank","title":"Too Many Requests","status":429,"detail":"Too many requests. Try again later."}
            """;
    private static final long ACCOUNT_FAILURE_LIMIT = 8;
    private static final Duration ACCOUNT_LOCK_WINDOW = Duration.ofMinutes(15);

    private final AuthenticationManager authenticationManager;
    private final AuthenticationMonitoringService authenticationMonitoringService;
    private final ClientFingerprint clientFingerprint;
    private final CsrfTokenRepository csrfTokenRepository;
    private final SecurityContextRepository securityContextRepository;
    private final SecurityCounterService securityCounterService;
    private final UserAccountRepository userAccountRepository;

    public AuthenticationController(
            AuthenticationManager authenticationManager,
            AuthenticationMonitoringService authenticationMonitoringService,
            ClientFingerprint clientFingerprint,
            CsrfTokenRepository csrfTokenRepository,
            SecurityContextRepository securityContextRepository,
            SecurityCounterService securityCounterService,
            UserAccountRepository userAccountRepository) {
        this.authenticationManager = authenticationManager;
        this.authenticationMonitoringService = authenticationMonitoringService;
        this.clientFingerprint = clientFingerprint;
        this.csrfTokenRepository = csrfTokenRepository;
        this.securityContextRepository = securityContextRepository;
        this.securityCounterService = securityCounterService;
        this.userAccountRepository = userAccountRepository;
    }

    @PostMapping("/login")
    ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest,
            HttpServletResponse servletResponse) {
        String normalizedEmail = UserAccountEntity.normalizeEmail(request.email());
        String accountKey = clientFingerprint.hash(normalizedEmail);
        String sourceHash = clientFingerprint.from(servletRequest);
        if (securityCounterService.isBlocked("login-account", accountKey, ACCOUNT_FAILURE_LIMIT)) {
            return tooManyAttempts();
        }
        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            UsernamePasswordAuthenticationToken.unauthenticated(
                                    normalizedEmail, request.password()));

            HttpSession existingSession = servletRequest.getSession(false);
            if (existingSession != null) {
                servletRequest.changeSessionId();
            }

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, servletRequest, servletResponse);
            securityCounterService.clear("login-account", accountKey);
            UserAccountEntity account =
                    userAccountRepository
                            .findByEmailNormalized(authentication.getName())
                            .orElseThrow(
                                    () ->
                                            new IllegalStateException(
                                                    "Authenticated account missing"));
            monitor(() -> authenticationMonitoringService.loginSucceeded(account));
            return ResponseEntity.ok()
                    .cacheControl(CacheControl.noStore())
                    .body(sessionResponse(authentication));
        } catch (AuthenticationException exception) {
            SecurityContextHolder.clearContext();
            RateLimitDecision decision =
                    securityCounterService.consume(
                            "login-account",
                            accountKey,
                            ACCOUNT_FAILURE_LIMIT,
                            ACCOUNT_LOCK_WINDOW);
            monitor(() -> authenticationMonitoringService.loginFailed(sourceHash));
            if (!decision.allowed()) {
                return tooManyAttempts();
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                    .cacheControl(CacheControl.noStore())
                    .body(INVALID_CREDENTIALS);
        }
    }

    @GetMapping("/session")
    ResponseEntity<AuthSessionResponse> session(Authentication authentication) {
        AuthSessionResponse response =
                authentication == null
                                || !authentication.isAuthenticated()
                                || authentication instanceof AnonymousAuthenticationToken
                        ? AuthSessionResponse.anonymous()
                        : sessionResponse(authentication);
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(response);
    }

    @PostMapping("/logout")
    ResponseEntity<Void> logout(
            Authentication authentication,
            HttpServletRequest request,
            HttpServletResponse response) {
        if (authentication != null) {
            userAccountRepository
                    .findByEmailNormalized(authentication.getName())
                    .ifPresent(
                            account ->
                                    monitor(
                                            () ->
                                                    authenticationMonitoringService.logoutSucceeded(
                                                            account)));
        }
        new SecurityContextLogoutHandler().logout(request, response, authentication);
        csrfTokenRepository.saveToken(null, request, response);
        return ResponseEntity.noContent().cacheControl(CacheControl.noStore()).build();
    }

    private AuthSessionResponse sessionResponse(Authentication authentication) {
        UserAccountEntity account =
                userAccountRepository
                        .findByEmailNormalized(authentication.getName())
                        .orElseThrow(
                                () -> new IllegalStateException("Authenticated account missing"));
        List<String> roles =
                authentication.getAuthorities().stream()
                        .map(authority -> authority.getAuthority().replaceFirst("^ROLE_", ""))
                        .sorted()
                        .toList();
        return new AuthSessionResponse(
                true, account.getDisplayName(), roles, account.isMfaRequired(), true);
    }

    private static ResponseEntity<String> tooManyAttempts() {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .header(HttpHeaders.RETRY_AFTER, Long.toString(ACCOUNT_LOCK_WINDOW.toSeconds()))
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .cacheControl(CacheControl.noStore())
                .body(TOO_MANY_ATTEMPTS);
    }

    private static void monitor(Runnable monitoringAction) {
        try {
            monitoringAction.run();
        } catch (RuntimeException ignored) {
            // Do not expose audit-store availability through authentication behavior.
        }
    }
}
