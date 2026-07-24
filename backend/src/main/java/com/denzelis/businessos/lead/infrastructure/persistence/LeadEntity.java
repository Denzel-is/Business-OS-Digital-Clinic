package com.denzelis.businessos.lead.infrastructure.persistence;

import com.denzelis.businessos.shared.infrastructure.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(
        name = "lead",
        indexes = {
            @Index(name = "idx_lead_status", columnList = "status"),
            @Index(name = "idx_lead_contact_request_id", columnList = "contact_request_id")
        })
public class LeadEntity extends AuditedEntity {

    public enum Status {
        NEW,
        QUALIFIED,
        CONVERTED,
        CLOSED
    }

    @Column(name = "contact_request_id")
    private UUID contactRequestId;

    @Column(nullable = false, length = 80)
    private String source;

    @Column(nullable = false, length = 240)
    private String summary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Status status;

    protected LeadEntity() {}
}
