package com.denzelis.businessos.settings.infrastructure.persistence;

import com.denzelis.businessos.shared.infrastructure.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "site_settings",
        uniqueConstraints =
                @UniqueConstraint(name = "uq_site_settings_key", columnNames = "setting_key"))
public class SiteSettingsEntity extends AuditedEntity {

    @Column(name = "setting_key", nullable = false, length = 120)
    private String settingKey;

    @Column(name = "setting_value", nullable = false, columnDefinition = "text")
    private String settingValue;

    @Column(name = "public_value", nullable = false)
    private boolean publicValue;

    protected SiteSettingsEntity() {}
}
