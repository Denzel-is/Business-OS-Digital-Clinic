package com.denzelis.businessos.configuration.security;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

final class SecurityProblemWriter {

    private static final String UNAUTHORIZED =
            """
            {"type":"about:blank","title":"Unauthorized","status":401,"detail":"Authentication is required."}
            """;

    private static final String FORBIDDEN =
            """
            {"type":"about:blank","title":"Forbidden","status":403,"detail":"The request is not permitted."}
            """;

    private static final String TOO_MANY_REQUESTS =
            """
            {"type":"about:blank","title":"Too Many Requests","status":429,"detail":"Too many requests. Try again later."}
            """;

    private static final String SERVICE_UNAVAILABLE =
            """
            {"type":"about:blank","title":"Service Unavailable","status":503,"detail":"The request cannot be accepted right now."}
            """;

    private SecurityProblemWriter() {}

    static void writeUnauthorized(HttpServletResponse response) throws IOException {
        write(response, HttpServletResponse.SC_UNAUTHORIZED, UNAUTHORIZED);
    }

    static void writeForbidden(HttpServletResponse response) throws IOException {
        write(response, HttpServletResponse.SC_FORBIDDEN, FORBIDDEN);
    }

    static void writeTooManyRequests(HttpServletResponse response, Duration retryAfter)
            throws IOException {
        response.setHeader(
                HttpHeaders.RETRY_AFTER, Long.toString(Math.max(1, retryAfter.toSeconds())));
        write(response, HttpStatus.TOO_MANY_REQUESTS.value(), TOO_MANY_REQUESTS);
    }

    static void writeServiceUnavailable(HttpServletResponse response) throws IOException {
        write(response, HttpServletResponse.SC_SERVICE_UNAVAILABLE, SERVICE_UNAVAILABLE);
    }

    private static void write(HttpServletResponse response, int status, String body)
            throws IOException {
        response.setStatus(status);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        response.getWriter().write(body);
    }
}
