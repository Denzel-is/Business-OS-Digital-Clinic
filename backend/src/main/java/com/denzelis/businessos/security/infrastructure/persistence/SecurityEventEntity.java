package com.denzelis.businessos.security.infrastructure.persistence;

import com.denzelis.businessos.shared.infrastructure.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "security_event",
        indexes = {
            @Index(name = "idx_security_event_type", columnList = "event_type"),
            @Index(name = "idx_security_event_severity", columnList = "severity"),
            @Index(name = "idx_security_event_created_at", columnList = "created_at")
        })
public class SecurityEventEntity extends AuditedEntity {

    public enum Severity {
        INFO,
        WARNING,
        CRITICAL
    }

    @Column(name = "actor_user_id")
    private UUID actorUserId;

    @Column(name = "event_type", nullable = false, length = 120)
    private String eventType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Severity severity;

    @Column(name = "source_ip_hash", length = 128)
    private String sourceIpHash;

    @Column(nullable = false, columnDefinition = "text")
    private String details;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    protected SecurityEventEntity() {}
}
