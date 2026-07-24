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
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
        name = "project",
        indexes = {
            @Index(name = "idx_project_publication_status", columnList = "publication_status"),
            @Index(name = "idx_project_published_at", columnList = "published_at"),
            @Index(name = "idx_project_sort_order", columnList = "sort_order")
        },
        uniqueConstraints = @UniqueConstraint(name = "uq_project_slug", columnNames = "slug"))
public class ProjectEntity extends AuditedEntity {

    @Column(nullable = false, length = 120)
    private String slug;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String summary;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false, length = 16)
    private PublicationStatus publicationStatus;

    @Column(name = "published_at")
    private Instant publishedAt;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "project_category_link",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<ProjectCategoryEntity> categories = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "project_technology_link",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "technology_id"))
    private Set<TechnologyEntity> technologies = new HashSet<>();

    protected ProjectEntity() {}
}
