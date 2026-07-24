package com.denzelis.businessos.security.application;

import java.time.Duration;

public record RateLimitDecision(boolean allowed, long observedCount, Duration retryAfter) {

    public static RateLimitDecision allowed(long observedCount) {
        return new RateLimitDecision(true, observedCount, Duration.ZERO);
    }

    public static RateLimitDecision denied(long observedCount, Duration retryAfter) {
        return new RateLimitDecision(false, observedCount, retryAfter);
    }
}
