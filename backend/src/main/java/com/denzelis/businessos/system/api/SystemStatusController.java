package com.denzelis.businessos.system.api;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/system/status")
public class SystemStatusController {

    @GetMapping
    ResponseEntity<SystemStatusResponse> status() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(new SystemStatusResponse("business-os-backend", "available"));
    }
}
