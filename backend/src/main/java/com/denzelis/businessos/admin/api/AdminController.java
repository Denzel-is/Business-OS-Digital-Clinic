package com.denzelis.businessos.admin.api;

import com.denzelis.businessos.admin.application.AdminQueryService;
import com.denzelis.businessos.admin.application.AdminResource;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminQueryService queryService;

    public AdminController(AdminQueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    AdminOverviewResponse overview(Authentication authentication) {
        boolean administrator =
                authentication.getAuthorities().stream()
                        .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        return queryService.overview(administrator);
    }

    @GetMapping("/content/{resource:projects|categories|media|services|leads|diagnostics|seo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    AdminResourcePageResponse content(
            @PathVariable String resource,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(50) int size) {
        return queryService.page(AdminResource.fromSlug(resource), page, size);
    }

    @GetMapping("/system/{resource:users|audit-logs|settings}")
    @PreAuthorize("hasRole('ADMIN')")
    AdminResourcePageResponse system(
            @PathVariable String resource,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(50) int size) {
        return queryService.page(AdminResource.fromSlug(resource), page, size);
    }
}
