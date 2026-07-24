package com.denzelis.businessos.admin.api;

public record AdminModuleSummary(
        String slug, String label, String scope, long itemCount, boolean available) {}
