package com.denzelis.businessos.admin.application;

import java.util.Arrays;

public enum AdminResource {
    PROJECTS(
            "projects",
            "Проекты",
            Scope.CONTENT,
            "SELECT id::text, title, slug, publication_status, created_at FROM project ORDER BY created_at DESC",
            "SELECT COUNT(*) FROM project"),
    CATEGORIES(
            "categories",
            "Категории",
            Scope.CONTENT,
            "SELECT id::text, name, slug, publication_status, created_at FROM project_category ORDER BY created_at DESC",
            "SELECT COUNT(*) FROM project_category"),
    MEDIA(
            "media",
            "Медиа",
            Scope.CONTENT,
            "SELECT id::text, alt_text, media_type, publication_status, created_at FROM project_media ORDER BY created_at DESC",
            "SELECT COUNT(*) FROM project_media"),
    SERVICES(
            "services",
            "Услуги",
            Scope.CONTENT,
            "SELECT id::text, name, slug, publication_status, created_at FROM service ORDER BY created_at DESC",
            "SELECT COUNT(*) FROM service"),
    LEADS(
            "leads",
            "Лиды",
            Scope.CONTENT,
            "SELECT id::text, summary, source, status, created_at FROM lead ORDER BY created_at DESC",
            "SELECT COUNT(*) FROM lead"),
    DIAGNOSTICS(
            "diagnostics",
            "Диагностика",
            Scope.CONTENT,
            "SELECT id::text, public_id, COALESCE('Score: ' || business_health_score::text, 'Score pending'), status, created_at FROM diagnostic_session ORDER BY created_at DESC",
            "SELECT COUNT(*) FROM diagnostic_session"),
    SEO(
            "seo",
            "SEO",
            Scope.CONTENT,
            "SELECT id::text, setting_key, CASE WHEN public_value THEN 'Public' ELSE 'Private' END, 'CONFIGURED', created_at FROM site_settings WHERE setting_key LIKE 'seo.%' ORDER BY created_at DESC",
            "SELECT COUNT(*) FROM site_settings WHERE setting_key LIKE 'seo.%'"),
    USERS(
            "users",
            "Пользователи",
            Scope.SYSTEM,
            "SELECT id::text, display_name, email_normalized, CASE WHEN enabled THEN 'ENABLED' ELSE 'DISABLED' END, created_at FROM app_user ORDER BY created_at DESC",
            "SELECT COUNT(*) FROM app_user"),
    AUDIT_LOGS(
            "audit-logs",
            "Журнал аудита",
            Scope.SYSTEM,
            "SELECT id::text, action, resource_type, outcome, created_at FROM audit_log ORDER BY created_at DESC",
            "SELECT COUNT(*) FROM audit_log"),
    SETTINGS(
            "settings",
            "Настройки",
            Scope.SYSTEM,
            "SELECT id::text, setting_key, CASE WHEN public_value THEN 'Public value' ELSE 'Private value' END, 'CONFIGURED', created_at FROM site_settings ORDER BY created_at DESC",
            "SELECT COUNT(*) FROM site_settings");

    private final String slug;
    private final String label;
    private final Scope scope;
    private final String pageQuery;
    private final String countQuery;

    AdminResource(String slug, String label, Scope scope, String pageQuery, String countQuery) {
        this.slug = slug;
        this.label = label;
        this.scope = scope;
        this.pageQuery = pageQuery;
        this.countQuery = countQuery;
    }

    public static AdminResource fromSlug(String slug) {
        return Arrays.stream(values())
                .filter(resource -> resource.slug.equals(slug))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown admin resource"));
    }

    public String slug() {
        return slug;
    }

    public String label() {
        return label;
    }

    public Scope scope() {
        return scope;
    }

    String pageQuery() {
        return pageQuery;
    }

    String countQuery() {
        return countQuery;
    }

    public enum Scope {
        CONTENT,
        SYSTEM
    }
}
