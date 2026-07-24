package com.denzelis.businessos.project.infrastructure.persistence;

import com.denzelis.businessos.shared.domain.PublicationStatus;
import com.denzelis.businessos.shared.infrastructure.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "project_media",
        indexes = @Index(name = "idx_project_media_project_id", columnList = "project_id"),
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uq_project_media_position",
                        columnNames = {"project_id", "sort_order"}))
public class ProjectMediaEntity extends AuditedEntity {

    public enum MediaType {
        IMAGE,
        VIDEO,
        DOCUMENT
    }

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectEntity project;

    @Enumerated(EnumType.STRING)
    @Column(name = "media_type", nullable = false, length = 16)
    private MediaType mediaType;

    @Column(name = "storage_key", nullable = false, length = 512)
    private String storageKey;

    @Column(name = "alt_text", nullable = false, length = 300)
    private String altText;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false, length = 16)
    private PublicationStatus publicationStatus;

    protected ProjectMediaEntity() {}
}
