package com.denzelis.businessos.configuration.security;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
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

    private SecurityProblemWriter() {}

    static void writeUnauthorized(HttpServletResponse response) throws IOException {
        write(response, HttpServletResponse.SC_UNAUTHORIZED, UNAUTHORIZED);
    }

    static void writeForbidden(HttpServletResponse response) throws IOException {
        write(response, HttpServletResponse.SC_FORBIDDEN, FORBIDDEN);
    }

    private static void write(HttpServletResponse response, int status, String body)
            throws IOException {
        response.setStatus(status);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        response.getWriter().write(body);
    }
}
