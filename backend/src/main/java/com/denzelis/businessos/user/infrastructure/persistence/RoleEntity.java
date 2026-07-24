package com.denzelis.businessos.user.infrastructure.persistence;

import com.denzelis.businessos.shared.infrastructure.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "app_role",
        uniqueConstraints = @UniqueConstraint(name = "uq_app_role_code", columnNames = "code"))
public class RoleEntity extends AuditedEntity {

    @Column(nullable = false, length = 64)
    private String code;

    @Column(nullable = false, length = 255)
    private String description;

    protected RoleEntity() {}
}
