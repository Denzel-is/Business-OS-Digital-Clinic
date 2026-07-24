package com.denzelis.businessos.audit.infrastructure.persistence;

import com.denzelis.businessos.shared.infrastructure.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(
        name = "audit_log",
        indexes = {
            @Index(name = "idx_audit_log_actor_user_id", columnList = "actor_user_id"),
            @Index(name = "idx_audit_log_resource", columnList = "resource_type, resource_id"),
            @Index(name = "idx_audit_log_created_at", columnList = "created_at")
        })
public class AuditLogEntity extends AuditedEntity {

    @Column(name = "actor_user_id")
    private UUID actorUserId;

    @Column(nullable = false, length = 120)
    private String action;

    @Column(name = "resource_type", nullable = false, length = 120)
    private String resourceType;

    @Column(name = "resource_id", length = 64)
    private String resourceId;

    @Column(nullable = false, length = 32)
    private String outcome;

    @Column(nullable = false, columnDefinition = "text")
    private String details;

    protected AuditLogEntity() {}

    public static AuditLogEntity authenticationEvent(
            UUID actorUserId, String action, String outcome) {
        AuditLogEntity event = new AuditLogEntity();
        event.actorUserId = actorUserId;
        event.action = action;
        event.resourceType = "AUTHENTICATION";
        event.resourceId = null;
        event.outcome = outcome;
        event.details = "Security-sensitive authentication event";
        return event;
    }
}
