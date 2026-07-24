package com.denzelis.businessos.security.application;

import com.denzelis.businessos.configuration.security.RateLimitProperties;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import org.springframework.stereotype.Component;

@Component
public class ClientFingerprint {

    private final RateLimitProperties properties;

    public ClientFingerprint(RateLimitProperties properties) {
        this.properties = properties;
    }

    public String from(HttpServletRequest request) {
        return hash(request.getRemoteAddr());
    }

    public String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes =
                    digest.digest(
                            (properties.keySalt() + ":" + value).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(bytes);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }
}
