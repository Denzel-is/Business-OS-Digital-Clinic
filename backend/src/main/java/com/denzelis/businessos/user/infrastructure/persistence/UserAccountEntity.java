package com.denzelis.businessos.user.infrastructure.persistence;

import com.denzelis.businessos.shared.infrastructure.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
        name = "app_user",
        indexes = {
            @Index(name = "idx_app_user_enabled", columnList = "enabled"),
            @Index(name = "idx_app_user_created_at", columnList = "created_at")
        },
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uq_app_user_email_normalized",
                        columnNames = "email_normalized"))
public class UserAccountEntity extends AuditedEntity {

    @Column(name = "email_normalized", nullable = false, length = 320)
    private String emailNormalized;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "display_name", nullable = false, length = 120)
    private String displayName;

    @Column(nullable = false)
    private boolean enabled;

    @Column(name = "mfa_required", nullable = false)
    private boolean mfaRequired;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "app_user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<RoleEntity> roles = new HashSet<>();

    protected UserAccountEntity() {}
}
