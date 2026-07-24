package com.denzelis.businessos.configuration.security;

import java.time.Duration;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration(proxyBeanMethods = false)
@EnableMethodSecurity
public class SecurityConfiguration {

    private static final String CONTENT_SECURITY_POLICY =
            "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'";
    private static final String PERMISSIONS_POLICY =
            "camera=(), microphone=(), geolocation=(), payment=(), usb=()";

    @Bean
    SecurityFilterChain apiSecurityFilterChain(
            HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        CookieCsrfTokenRepository csrfTokenRepository =
                CookieCsrfTokenRepository.withHttpOnlyFalse();
        csrfTokenRepository.setCookiePath("/");

        http.cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(
                        csrf ->
                                csrf.csrfTokenRepository(csrfTokenRepository)
                                        .ignoringRequestMatchers(
                                                "/api/v1/diagnostics/evaluate",
                                                "/api/v1/security/input-validation-demo"))
                .sessionManagement(
                        session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .requestCache(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(
                        authorization ->
                                authorization
                                        .requestMatchers(
                                                HttpMethod.GET,
                                                "/api/v1/system/status",
                                                "/api/v1/security/csrf",
                                                "/actuator/health",
                                                "/actuator/health/liveness",
                                                "/actuator/health/readiness")
                                        .permitAll()
                                        .requestMatchers(
                                                HttpMethod.POST,
                                                "/api/v1/diagnostics/evaluate",
                                                "/api/v1/security/input-validation-demo")
                                        .permitAll()
                                        .anyRequest()
                                        .authenticated())
                .exceptionHandling(
                        exceptions ->
                                exceptions
                                        .authenticationEntryPoint(
                                                (request, response, exception) ->
                                                        SecurityProblemWriter.writeUnauthorized(
                                                                response))
                                        .accessDeniedHandler(
                                                (request, response, exception) ->
                                                        SecurityProblemWriter.writeForbidden(
                                                                response)))
                .headers(
                        headers ->
                                headers.contentSecurityPolicy(
                                                policy ->
                                                        policy.policyDirectives(
                                                                CONTENT_SECURITY_POLICY))
                                        .frameOptions(frameOptions -> frameOptions.deny())
                                        .referrerPolicy(
                                                referrer ->
                                                        referrer.policy(
                                                                ReferrerPolicyHeaderWriter
                                                                        .ReferrerPolicy
                                                                        .NO_REFERRER))
                                        .httpStrictTransportSecurity(
                                                hsts ->
                                                        hsts.includeSubDomains(true)
                                                                .preload(true)
                                                                .maxAgeInSeconds(
                                                                        Duration.ofDays(365)
                                                                                .toSeconds()))
                                        .addHeaderWriter(
                                                new StaticHeadersWriter(
                                                        "Permissions-Policy", PERMISSIONS_POLICY)));

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(WebSecurityProperties properties) {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(properties.allowedOrigins());
        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(
                List.of(
                        HttpHeaders.ACCEPT,
                        HttpHeaders.CONTENT_TYPE,
                        "X-CSRF-TOKEN",
                        "X-XSRF-TOKEN"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(Duration.ofHours(1));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
