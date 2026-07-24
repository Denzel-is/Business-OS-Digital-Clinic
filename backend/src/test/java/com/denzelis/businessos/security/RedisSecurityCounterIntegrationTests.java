package com.denzelis.businessos.security;

import static org.assertj.core.api.Assertions.assertThat;

import com.denzelis.businessos.security.application.RateLimitDecision;
import com.denzelis.businessos.security.application.SecurityCounterService;
import java.time.Duration;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@ActiveProfiles("test")
@SpringBootTest(properties = "business-os.security.rate-limit.enabled=true")
@Testcontainers
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class RedisSecurityCounterIntegrationTests {

    @Container
    static final GenericContainer<?> redis =
            new GenericContainer<>(DockerImageName.parse("redis:7-alpine")).withExposedPorts(6379);

    private final SecurityCounterService counterService;

    @Autowired
    RedisSecurityCounterIntegrationTests(SecurityCounterService counterService) {
        this.counterService = counterService;
    }

    @DynamicPropertySource
    static void redisProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.redis.host", redis::getHost);
        registry.add("spring.data.redis.port", () -> redis.getMappedPort(6379));
    }

    @Test
    void atomicallyDeniesAfterCapacityAndCanClearTheWindow() {
        String subject = UUID.randomUUID().toString();

        RateLimitDecision first =
                counterService.consume("integration", subject, 2, Duration.ofMinutes(1));
        RateLimitDecision second =
                counterService.consume("integration", subject, 2, Duration.ofMinutes(1));
        RateLimitDecision denied =
                counterService.consume("integration", subject, 2, Duration.ofMinutes(1));

        assertThat(first.allowed()).isTrue();
        assertThat(second.allowed()).isTrue();
        assertThat(denied.allowed()).isFalse();
        assertThat(denied.observedCount()).isEqualTo(3);
        assertThat(counterService.isBlocked("integration", subject, 2)).isTrue();

        counterService.clear("integration", subject);
        assertThat(counterService.isBlocked("integration", subject, 2)).isFalse();
    }
}
