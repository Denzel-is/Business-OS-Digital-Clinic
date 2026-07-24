package com.denzelis.businessos.auth.application;

import com.denzelis.businessos.audit.infrastructure.persistence.AuditLogEntity;
import com.denzelis.businessos.audit.infrastructure.persistence.AuditLogRepository;
import com.denzelis.businessos.security.infrastructure.persistence.SecurityEventEntity;
import com.denzelis.businessos.security.infrastructure.persistence.SecurityEventRepository;
import com.denzelis.businessos.user.infrastructure.persistence.UserAccountEntity;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationMonitoringService {

    private final AuditLogRepository auditLogRepository;
    private final MeterRegistry meterRegistry;
    private final SecurityEventRepository securityEventRepository;

    public AuthenticationMonitoringService(
            AuditLogRepository auditLogRepository,
            MeterRegistry meterRegistry,
            SecurityEventRepository securityEventRepository) {
        this.auditLogRepository = auditLogRepository;
        this.meterRegistry = meterRegistry;
        this.securityEventRepository = securityEventRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void loginSucceeded(UserAccountEntity account) {
        auditLogRepository.save(
                AuditLogEntity.authenticationEvent(account.getId(), "LOGIN", "SUCCESS"));
        meterRegistry.counter("business_os.authentication", "outcome", "success").increment();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void loginFailed(String sourceIpHash) {
        securityEventRepository.save(
                SecurityEventEntity.record(
                        "AUTHENTICATION_FAILURE",
                        SecurityEventEntity.Severity.WARNING,
                        sourceIpHash,
                        "A credential verification attempt failed"));
        meterRegistry.counter("business_os.authentication", "outcome", "failure").increment();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logoutSucceeded(UserAccountEntity account) {
        auditLogRepository.save(
                AuditLogEntity.authenticationEvent(account.getId(), "LOGOUT", "SUCCESS"));
        meterRegistry.counter("business_os.logout", "outcome", "success").increment();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void rateLimitExceeded(String sourceIpHash, String policy) {
        securityEventRepository.save(
                SecurityEventEntity.record(
                        "RATE_LIMIT_EXCEEDED",
                        SecurityEventEntity.Severity.WARNING,
                        sourceIpHash,
                        "Rate-limit policy denied a request: " + policy));
    }
}
