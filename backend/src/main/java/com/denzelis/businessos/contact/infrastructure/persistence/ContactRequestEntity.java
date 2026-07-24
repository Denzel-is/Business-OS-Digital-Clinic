package com.denzelis.businessos.contact.infrastructure.persistence;

import com.denzelis.businessos.shared.infrastructure.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(
        name = "contact_request",
        indexes = {
            @Index(name = "idx_contact_request_status", columnList = "status"),
            @Index(name = "idx_contact_request_created_at", columnList = "created_at")
        })
public class ContactRequestEntity extends AuditedEntity {

    public enum Status {
        NEW,
        IN_PROGRESS,
        CLOSED
    }

    @Column(name = "contact_name", nullable = false, length = 120)
    private String contactName;

    @Column(name = "email_normalized", nullable = false, length = 320)
    private String emailNormalized;

    @Column(nullable = false, columnDefinition = "text")
    private String message;

    @Column(name = "consent_granted_at", nullable = false)
    private Instant consentGrantedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private Status status;

    protected ContactRequestEntity() {}
}
