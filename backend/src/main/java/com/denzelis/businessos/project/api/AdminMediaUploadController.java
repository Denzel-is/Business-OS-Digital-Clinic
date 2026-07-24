package com.denzelis.businessos.project.api;

import com.denzelis.businessos.project.application.SafeMediaUploadService;
import java.util.UUID;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/content/media")
public class AdminMediaUploadController {

    private final SafeMediaUploadService uploadService;

    public AdminMediaUploadController(SafeMediaUploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    ResponseEntity<MediaUploadResponse> upload(
            @RequestParam UUID projectId,
            @RequestParam String altText,
            @RequestParam(defaultValue = "0") int sortOrder,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(uploadService.upload(projectId, altText, sortOrder, file));
    }
}
