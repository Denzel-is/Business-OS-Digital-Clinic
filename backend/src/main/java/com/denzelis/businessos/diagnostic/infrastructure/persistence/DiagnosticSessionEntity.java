package com.denzelis.businessos.diagnostic.infrastructure.persistence;

import com.denzelis.businessos.shared.infrastructure.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(
        name = "diagnostic_session",
        indexes = {
            @Index(name = "idx_diagnostic_session_status", columnList = "status"),
            @Index(name = "idx_diagnostic_session_created_at", columnList = "created_at")
        },
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uq_diagnostic_session_public_id",
                        columnNames = "public_id"))
public class DiagnosticSessionEntity extends AuditedEntity {

    public enum Status {
        STARTED,
        COMPLETED,
        EXPIRED
    }

    @Column(name = "public_id", nullable = false, length = 64)
    private String publicId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Status status;

    @Column(name = "business_health_score")
    private Integer businessHealthScore;

    @Column(name = "contact_consent", nullable = false)
    private boolean contactConsent;

    @Column(name = "completed_at")
    private Instant completedAt;

    protected DiagnosticSessionEntity() {}
}
