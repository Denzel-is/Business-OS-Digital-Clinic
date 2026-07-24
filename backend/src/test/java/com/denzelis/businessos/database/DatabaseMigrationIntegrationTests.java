package com.denzelis.businessos.database;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@ActiveProfiles("postgres-integration")
@SpringBootTest
@Testcontainers
class DatabaseMigrationIntegrationTests {

    @Container @ServiceConnection
    static final PostgreSQLContainer postgres =
            new PostgreSQLContainer("postgres:17-alpine")
                    .withDatabaseName("business_os_migration_test")
                    .withUsername("business_os_test")
                    .withPassword("test-only-password");

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    DatabaseMigrationIntegrationTests(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Test
    void migratesAnEmptyDatabaseAndValidatesEveryJpaEntity() {
        Integer tableCount =
                jdbcTemplate.queryForObject(
                        """
                        SELECT COUNT(*)
                        FROM information_schema.tables
                        WHERE table_schema = 'public'
                          AND table_name IN (
                              'app_user',
                              'app_role',
                              'project',
                              'project_category',
                              'project_media',
                              'technology',
                              'service',
                              'diagnostic_session',
                              'diagnostic_answer',
                              'lead',
                              'contact_request',
                              'audit_log',
                              'security_event',
                              'site_settings'
                          )
                        """,
                        Integer.class);
        Integer migrationCount =
                jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM flyway_schema_history WHERE success = TRUE",
                        Integer.class);
        Integer applicationTableCount =
                jdbcTemplate.queryForObject(
                        """
                        SELECT COUNT(*)
                        FROM information_schema.tables
                        WHERE table_schema = 'public'
                          AND table_name <> 'flyway_schema_history'
                        """,
                        Integer.class);

        assertThat(tableCount).isEqualTo(14);
        assertThat(applicationTableCount).isEqualTo(18);
        assertThat(migrationCount).isEqualTo(2);
    }

    @Test
    void seedsOnlyThePublicDemoCatalogWithoutPersonalRecords() {
        assertThat(count("SELECT COUNT(*) FROM project")).isEqualTo(6);
        assertThat(count("SELECT COUNT(*) FROM project_category")).isEqualTo(8);
        assertThat(count("SELECT COUNT(*) FROM technology")).isEqualTo(6);
        assertThat(count("SELECT COUNT(*) FROM service")).isEqualTo(6);
        assertThat(count("SELECT COUNT(*) FROM app_role")).isEqualTo(2);

        assertThat(count("SELECT COUNT(*) FROM app_user")).isZero();
        assertThat(count("SELECT COUNT(*) FROM contact_request")).isZero();
        assertThat(count("SELECT COUNT(*) FROM lead")).isZero();
        assertThat(count("SELECT COUNT(*) FROM diagnostic_session")).isZero();
        assertThat(count("SELECT COUNT(*) FROM audit_log")).isZero();
        assertThat(count("SELECT COUNT(*) FROM security_event")).isZero();
    }

    @Test
    void enforcesUniqueAndForeignKeyConstraints() {
        assertThatThrownBy(
                        () ->
                                jdbcTemplate.update(
                                        """
                                        INSERT INTO project_category (
                                            id, slug, name, publication_status
                                        )
                                        VALUES (
                                            '70000000-0000-4000-8000-000000000001',
                                            'web',
                                            'Duplicate web',
                                            'PUBLISHED'
                                        )
                                        """))
                .isInstanceOf(DataIntegrityViolationException.class);

        assertThatThrownBy(
                        () ->
                                jdbcTemplate.update(
                                        """
                                        INSERT INTO diagnostic_answer (
                                            id, session_id, question_code, answer_code
                                        )
                                        VALUES (
                                            '70000000-0000-4000-8000-000000000002',
                                            '70000000-0000-4000-8000-000000000003',
                                            'business-type',
                                            'services'
                                        )
                                        """))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    private long count(String query) {
        Long count = jdbcTemplate.queryForObject(query, Long.class);
        return count == null ? 0 : count;
    }
}
