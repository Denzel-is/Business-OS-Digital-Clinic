package com.denzelis.businessos.security.application;

import java.time.Duration;

public interface SecurityCounterService {

    RateLimitDecision consume(String namespace, String subject, long capacity, Duration window);

    boolean isBlocked(String namespace, String subject, long capacity);

    void clear(String namespace, String subject);
}
