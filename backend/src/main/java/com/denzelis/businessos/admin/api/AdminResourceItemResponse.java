package com.denzelis.businessos.admin.api;

import java.time.Instant;

public record AdminResourceItemResponse(
        String id, String title, String subtitle, String status, Instant createdAt) {}
