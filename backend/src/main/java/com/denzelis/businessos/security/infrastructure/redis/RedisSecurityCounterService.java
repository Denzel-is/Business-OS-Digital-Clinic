package com.denzelis.businessos.security.infrastructure.redis;

import com.denzelis.businessos.security.application.RateLimitDecision;
import com.denzelis.businessos.security.application.SecurityCounterService;
import java.time.Duration;
import java.util.List;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(
        prefix = "business-os.security.rate-limit",
        name = "enabled",
        havingValue = "true",
        matchIfMissing = true)
public class RedisSecurityCounterService implements SecurityCounterService {

    private static final DefaultRedisScript<Long> INCREMENT_SCRIPT =
            new DefaultRedisScript<>(
                    """
                    local current = redis.call('INCR', KEYS[1])
                    if current == 1 then
                      redis.call('PEXPIRE', KEYS[1], ARGV[1])
                    end
                    return current
                    """,
                    Long.class);

    private final StringRedisTemplate redisTemplate;

    public RedisSecurityCounterService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public RateLimitDecision consume(
            String namespace, String subject, long capacity, Duration window) {
        Long observedCount =
                redisTemplate.execute(
                        INCREMENT_SCRIPT,
                        List.of(key(namespace, subject)),
                        Long.toString(window.toMillis()));
        if (observedCount == null) {
            throw new IllegalStateException("Redis did not return a counter value");
        }
        return observedCount <= capacity
                ? RateLimitDecision.allowed(observedCount)
                : RateLimitDecision.denied(observedCount, window);
    }

    @Override
    public boolean isBlocked(String namespace, String subject, long capacity) {
        String value = redisTemplate.opsForValue().get(key(namespace, subject));
        if (value == null) {
            return false;
        }
        try {
            return Long.parseLong(value) >= capacity;
        } catch (NumberFormatException exception) {
            redisTemplate.delete(key(namespace, subject));
            return false;
        }
    }

    @Override
    public void clear(String namespace, String subject) {
        redisTemplate.delete(key(namespace, subject));
    }

    private static String key(String namespace, String subject) {
        return "business-os:security:" + namespace + ":" + subject;
    }
}
