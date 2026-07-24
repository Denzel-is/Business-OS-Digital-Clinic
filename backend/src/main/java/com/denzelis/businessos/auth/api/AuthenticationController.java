package com.denzelis.businessos.auth.api;

import com.denzelis.businessos.user.infrastructure.persistence.UserAccountEntity;
import com.denzelis.businessos.user.infrastructure.persistence.UserAccountRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.CacheControl;
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

    private final AuthenticationManager authenticationManager;
    private final CsrfTokenRepository csrfTokenRepository;
    private final SecurityContextRepository securityContextRepository;
    private final UserAccountRepository userAccountRepository;

    public AuthenticationController(
            AuthenticationManager authenticationManager,
            CsrfTokenRepository csrfTokenRepository,
            SecurityContextRepository securityContextRepository,
            UserAccountRepository userAccountRepository) {
        this.authenticationManager = authenticationManager;
        this.csrfTokenRepository = csrfTokenRepository;
        this.securityContextRepository = securityContextRepository;
        this.userAccountRepository = userAccountRepository;
    }

    @PostMapping("/login")
    ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest,
            HttpServletResponse servletResponse) {
        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            UsernamePasswordAuthenticationToken.unauthenticated(
                                    UserAccountEntity.normalizeEmail(request.email()),
                                    request.password()));

            HttpSession existingSession = servletRequest.getSession(false);
            if (existingSession != null) {
                servletRequest.changeSessionId();
            }

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, servletRequest, servletResponse);
            return ResponseEntity.ok()
                    .cacheControl(CacheControl.noStore())
                    .body(sessionResponse(authentication));
        } catch (AuthenticationException exception) {
            SecurityContextHolder.clearContext();
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
}
