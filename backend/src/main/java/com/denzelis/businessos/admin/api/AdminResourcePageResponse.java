package com.denzelis.businessos.admin.api;

import java.util.List;

public record AdminResourcePageResponse(
        String resource,
        String label,
        int page,
        int size,
        long totalItems,
        int totalPages,
        List<AdminResourceItemResponse> items) {}
