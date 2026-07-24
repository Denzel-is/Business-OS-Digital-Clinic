CREATE TABLE app_role (
    id UUID PRIMARY KEY,
    code VARCHAR(64) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_app_role_code UNIQUE (code)
);

CREATE TABLE app_user (
    id UUID PRIMARY KEY,
    email_normalized VARCHAR(320) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(120) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    mfa_required BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_app_user_email_normalized UNIQUE (email_normalized),
    CONSTRAINT ck_app_user_email_normalized
        CHECK (email_normalized = LOWER(email_normalized))
);

CREATE INDEX idx_app_user_enabled ON app_user (enabled);
CREATE INDEX idx_app_user_created_at ON app_user (created_at);

CREATE TABLE app_user_role (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_app_user_role_user
        FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE,
    CONSTRAINT fk_app_user_role_role
        FOREIGN KEY (role_id) REFERENCES app_role (id) ON DELETE RESTRICT
);

CREATE INDEX idx_app_user_role_role_id ON app_user_role (role_id);

CREATE TABLE project_category (
    id UUID PRIMARY KEY,
    slug VARCHAR(80) NOT NULL,
    name VARCHAR(120) NOT NULL,
    publication_status VARCHAR(16) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_project_category_slug UNIQUE (slug),
    CONSTRAINT uq_project_category_name UNIQUE (name),
    CONSTRAINT ck_project_category_publication_status
        CHECK (publication_status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED'))
);

CREATE INDEX idx_project_category_publication_status
    ON project_category (publication_status);

CREATE TABLE technology (
    id UUID PRIMARY KEY,
    slug VARCHAR(80) NOT NULL,
    name VARCHAR(120) NOT NULL,
    publication_status VARCHAR(16) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_technology_slug UNIQUE (slug),
    CONSTRAINT uq_technology_name UNIQUE (name),
    CONSTRAINT ck_technology_publication_status
        CHECK (publication_status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED'))
);

CREATE INDEX idx_technology_publication_status ON technology (publication_status);

CREATE TABLE service (
    id UUID PRIMARY KEY,
    slug VARCHAR(80) NOT NULL,
    name VARCHAR(160) NOT NULL,
    summary TEXT NOT NULL,
    publication_status VARCHAR(16) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_service_slug UNIQUE (slug),
    CONSTRAINT uq_service_name UNIQUE (name),
    CONSTRAINT ck_service_publication_status
        CHECK (publication_status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED'))
);

CREATE INDEX idx_service_publication_status ON service (publication_status);

CREATE TABLE project (
    id UUID PRIMARY KEY,
    slug VARCHAR(120) NOT NULL,
    title VARCHAR(180) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    publication_status VARCHAR(16) NOT NULL,
    published_at TIMESTAMPTZ,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_project_slug UNIQUE (slug),
    CONSTRAINT ck_project_publication_status
        CHECK (publication_status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    CONSTRAINT ck_project_published_at
        CHECK (publication_status <> 'PUBLISHED' OR published_at IS NOT NULL),
    CONSTRAINT ck_project_sort_order CHECK (sort_order >= 0)
);

CREATE INDEX idx_project_publication_status ON project (publication_status);
CREATE INDEX idx_project_published_at ON project (published_at);
CREATE INDEX idx_project_sort_order ON project (sort_order);

CREATE TABLE project_category_link (
    project_id UUID NOT NULL,
    category_id UUID NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project_category_link_project
        FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE,
    CONSTRAINT fk_project_category_link_category
        FOREIGN KEY (category_id) REFERENCES project_category (id) ON DELETE RESTRICT
);

CREATE INDEX idx_project_category_link_category_id
    ON project_category_link (category_id);

CREATE TABLE project_technology_link (
    project_id UUID NOT NULL,
    technology_id UUID NOT NULL,
    PRIMARY KEY (project_id, technology_id),
    CONSTRAINT fk_project_technology_link_project
        FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE,
    CONSTRAINT fk_project_technology_link_technology
        FOREIGN KEY (technology_id) REFERENCES technology (id) ON DELETE RESTRICT
);

CREATE INDEX idx_project_technology_link_technology_id
    ON project_technology_link (technology_id);

CREATE TABLE project_service_link (
    project_id UUID NOT NULL,
    service_id UUID NOT NULL,
    PRIMARY KEY (project_id, service_id),
    CONSTRAINT fk_project_service_link_project
        FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE,
    CONSTRAINT fk_project_service_link_service
        FOREIGN KEY (service_id) REFERENCES service (id) ON DELETE RESTRICT
);

CREATE INDEX idx_project_service_link_service_id ON project_service_link (service_id);

CREATE TABLE project_media (
    id UUID PRIMARY KEY,
    project_id UUID NOT NULL,
    media_type VARCHAR(16) NOT NULL,
    storage_key VARCHAR(512) NOT NULL,
    alt_text VARCHAR(300) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    publication_status VARCHAR(16) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_project_media_project
        FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE,
    CONSTRAINT uq_project_media_position UNIQUE (project_id, sort_order),
    CONSTRAINT ck_project_media_type
        CHECK (media_type IN ('IMAGE', 'VIDEO', 'DOCUMENT')),
    CONSTRAINT ck_project_media_publication_status
        CHECK (publication_status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    CONSTRAINT ck_project_media_sort_order CHECK (sort_order >= 0),
    CONSTRAINT ck_project_media_storage_key
        CHECK (storage_key !~ '(^|[\\/])\\.\\.([\\/]|$)')
);

CREATE INDEX idx_project_media_project_id ON project_media (project_id);

CREATE TABLE diagnostic_session (
    id UUID PRIMARY KEY,
    public_id VARCHAR(64) NOT NULL,
    status VARCHAR(16) NOT NULL,
    business_health_score INTEGER,
    contact_consent BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_diagnostic_session_public_id UNIQUE (public_id),
    CONSTRAINT ck_diagnostic_session_status
        CHECK (status IN ('STARTED', 'COMPLETED', 'EXPIRED')),
    CONSTRAINT ck_diagnostic_session_score
        CHECK (business_health_score BETWEEN 0 AND 100),
    CONSTRAINT ck_diagnostic_session_completion
        CHECK (status <> 'COMPLETED' OR completed_at IS NOT NULL)
);

CREATE INDEX idx_diagnostic_session_status ON diagnostic_session (status);
CREATE INDEX idx_diagnostic_session_created_at ON diagnostic_session (created_at);

CREATE TABLE diagnostic_answer (
    id UUID PRIMARY KEY,
    session_id UUID NOT NULL,
    question_code VARCHAR(80) NOT NULL,
    answer_code VARCHAR(80) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_diagnostic_answer_session
        FOREIGN KEY (session_id) REFERENCES diagnostic_session (id) ON DELETE CASCADE,
    CONSTRAINT uq_diagnostic_answer_question UNIQUE (session_id, question_code)
);

CREATE INDEX idx_diagnostic_answer_session_id ON diagnostic_answer (session_id);

CREATE TABLE contact_request (
    id UUID PRIMARY KEY,
    contact_name VARCHAR(120) NOT NULL,
    email_normalized VARCHAR(320) NOT NULL,
    message TEXT NOT NULL,
    consent_granted_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(24) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT ck_contact_request_email_normalized
        CHECK (email_normalized = LOWER(email_normalized)),
    CONSTRAINT ck_contact_request_status
        CHECK (status IN ('NEW', 'IN_PROGRESS', 'CLOSED'))
);

CREATE INDEX idx_contact_request_status ON contact_request (status);
CREATE INDEX idx_contact_request_created_at ON contact_request (created_at);

CREATE TABLE lead (
    id UUID PRIMARY KEY,
    contact_request_id UUID,
    source VARCHAR(80) NOT NULL,
    summary VARCHAR(240) NOT NULL,
    status VARCHAR(16) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_lead_contact_request
        FOREIGN KEY (contact_request_id) REFERENCES contact_request (id) ON DELETE SET NULL,
    CONSTRAINT ck_lead_status
        CHECK (status IN ('NEW', 'QUALIFIED', 'CONVERTED', 'CLOSED'))
);

CREATE INDEX idx_lead_status ON lead (status);
CREATE INDEX idx_lead_contact_request_id ON lead (contact_request_id);

CREATE TABLE audit_log (
    id UUID PRIMARY KEY,
    actor_user_id UUID,
    action VARCHAR(120) NOT NULL,
    resource_type VARCHAR(120) NOT NULL,
    resource_id VARCHAR(64),
    outcome VARCHAR(32) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_audit_log_actor_user
        FOREIGN KEY (actor_user_id) REFERENCES app_user (id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_log_actor_user_id ON audit_log (actor_user_id);
CREATE INDEX idx_audit_log_resource ON audit_log (resource_type, resource_id);
CREATE INDEX idx_audit_log_created_at ON audit_log (created_at);

CREATE TABLE security_event (
    id UUID PRIMARY KEY,
    actor_user_id UUID,
    event_type VARCHAR(120) NOT NULL,
    severity VARCHAR(16) NOT NULL,
    source_ip_hash VARCHAR(128),
    details TEXT NOT NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_security_event_actor_user
        FOREIGN KEY (actor_user_id) REFERENCES app_user (id) ON DELETE SET NULL,
    CONSTRAINT ck_security_event_severity
        CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL'))
);

CREATE INDEX idx_security_event_type ON security_event (event_type);
CREATE INDEX idx_security_event_severity ON security_event (severity);
CREATE INDEX idx_security_event_created_at ON security_event (created_at);

CREATE TABLE site_settings (
    id UUID PRIMARY KEY,
    setting_key VARCHAR(120) NOT NULL,
    setting_value TEXT NOT NULL,
    public_value BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_site_settings_key UNIQUE (setting_key)
);
