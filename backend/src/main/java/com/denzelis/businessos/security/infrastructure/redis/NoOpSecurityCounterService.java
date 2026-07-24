package com.denzelis.businessos.security.infrastructure.redis;

import com.denzelis.businessos.security.application.RateLimitDecision;
import com.denzelis.businessos.security.application.SecurityCounterService;
import java.time.Duration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(
        prefix = "business-os.security.rate-limit",
        name = "enabled",
        havingValue = "false")
public class NoOpSecurityCounterService implements SecurityCounterService {

    @Override
    public RateLimitDecision consume(
            String namespace, String subject, long capacity, Duration window) {
        return RateLimitDecision.allowed(0);
    }

    @Override
    public boolean isBlocked(String namespace, String subject, long capacity) {
        return false;
    }

    @Override
    public void clear(String namespace, String subject) {}
}
