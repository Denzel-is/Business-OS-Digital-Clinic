package com.denzelis.businessos.admin.application;

import com.denzelis.businessos.admin.api.AdminModuleSummary;
import com.denzelis.businessos.admin.api.AdminOverviewResponse;
import com.denzelis.businessos.admin.api.AdminResourceItemResponse;
import com.denzelis.businessos.admin.api.AdminResourcePageResponse;
import java.sql.Timestamp;
import java.util.Arrays;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminQueryService {

    private static final int MAXIMUM_PAGE_SIZE = 50;

    private final JdbcTemplate jdbcTemplate;

    public AdminQueryService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional(readOnly = true)
    public AdminOverviewResponse overview(boolean administrator) {
        return new AdminOverviewResponse(
                Arrays.stream(AdminResource.values())
                        .filter(
                                resource ->
                                        administrator
                                                || resource.scope() == AdminResource.Scope.CONTENT)
                        .map(
                                resource ->
                                        new AdminModuleSummary(
                                                resource.slug(),
                                                resource.label(),
                                                resource.scope().name(),
                                                count(resource),
                                                true))
                        .toList());
    }

    @Transactional(readOnly = true)
    public AdminResourcePageResponse page(AdminResource resource, int page, int requestedSize) {
        int size = Math.min(requestedSize, MAXIMUM_PAGE_SIZE);
        long totalItems = count(resource);
        int totalPages = totalItems == 0 ? 0 : (int) Math.ceil((double) totalItems / size);
        int offset = page * size;
        var items =
                jdbcTemplate.query(
                        resource.pageQuery() + " LIMIT ? OFFSET ?",
                        (resultSet, rowNumber) ->
                                new AdminResourceItemResponse(
                                        resultSet.getString(1),
                                        resultSet.getString(2),
                                        resultSet.getString(3),
                                        resultSet.getString(4),
                                        resultSet.getObject(5, Timestamp.class).toInstant()),
                        size,
                        offset);
        return new AdminResourcePageResponse(
                resource.slug(), resource.label(), page, size, totalItems, totalPages, items);
    }

    private long count(AdminResource resource) {
        Long count = jdbcTemplate.queryForObject(resource.countQuery(), Long.class);
        return count == null ? 0 : count;
    }
}
