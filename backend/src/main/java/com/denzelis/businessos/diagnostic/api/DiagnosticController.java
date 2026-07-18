package com.denzelis.businessos.diagnostic.api;

import com.denzelis.businessos.diagnostic.application.DiagnosticEvaluationService;
import jakarta.validation.Valid;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/diagnostics")
public class DiagnosticController {

    private final DiagnosticEvaluationService evaluationService;

    public DiagnosticController(DiagnosticEvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @PostMapping("/evaluate")
    ResponseEntity<DiagnosticEvaluationResponse> evaluate(
            @Valid @RequestBody DiagnosticEvaluationRequest request) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(
                        DiagnosticEvaluationResponse.from(
                                evaluationService.evaluate(request.toAnswers())));
    }
}
