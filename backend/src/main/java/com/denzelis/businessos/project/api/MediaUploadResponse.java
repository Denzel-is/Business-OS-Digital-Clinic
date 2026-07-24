package com.denzelis.businessos.project.api;

import java.util.UUID;

public record MediaUploadResponse(UUID id, String storageKey, String mediaType, String status) {}
