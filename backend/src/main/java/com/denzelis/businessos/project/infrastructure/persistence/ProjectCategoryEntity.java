package com.denzelis.businessos.project.infrastructure.persistence;

import com.denzelis.businessos.shared.domain.PublicationStatus;
import com.denzelis.businessos.shared.infrastructure.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "project_category",
        indexes =
                @Index(
                        name = "idx_project_category_publication_status",
                        columnList = "publication_status"),
        uniqueConstraints = {
            @UniqueConstraint(name = "uq_project_category_slug", columnNames = "slug"),
            @UniqueConstraint(name = "uq_project_category_name", columnNames = "name")
        })
public class ProjectCategoryEntity extends AuditedEntity {

    @Column(nullable = false, length = 80)
    private String slug;

    @Column(nullable = false, length = 120)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false, length = 16)
    private PublicationStatus publicationStatus;

    protected ProjectCategoryEntity() {}
}
