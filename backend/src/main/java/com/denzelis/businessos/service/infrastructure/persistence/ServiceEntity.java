package com.denzelis.businessos.service.infrastructure.persistence;

import com.denzelis.businessos.shared.domain.PublicationStatus;
import com.denzelis.businessos.shared.infrastructure.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "service",
        uniqueConstraints = {
            @UniqueConstraint(name = "uq_service_slug", columnNames = "slug"),
            @UniqueConstraint(name = "uq_service_name", columnNames = "name")
        })
public class ServiceEntity extends AuditedEntity {

    @Column(nullable = false, length = 80)
    private String slug;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, columnDefinition = "text")
    private String summary;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false, length = 16)
    private PublicationStatus publicationStatus;

    protected ServiceEntity() {}
}
