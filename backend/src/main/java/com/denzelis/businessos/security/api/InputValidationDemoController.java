package com.denzelis.businessos.security.api;

import com.denzelis.businessos.security.application.InputValidationService;
import jakarta.validation.Valid;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/security/input-validation-demo")
public class InputValidationDemoController {

    private final InputValidationService validationService;

    public InputValidationDemoController(InputValidationService validationService) {
        this.validationService = validationService;
    }

    @PostMapping
    ResponseEntity<InputValidationDemoResponse> evaluate(
            @Valid @RequestBody InputValidationDemoRequest request) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(
                        InputValidationDemoResponse.from(
                                validationService.evaluate(request.context(), request.value())));
    }
}
