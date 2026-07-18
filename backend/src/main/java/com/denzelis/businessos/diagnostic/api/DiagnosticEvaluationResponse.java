package com.denzelis.businessos.diagnostic.api;

import com.denzelis.businessos.diagnostic.domain.DiagnosticAssessment;
import java.util.List;

public record DiagnosticEvaluationResponse(
        int score,
        String status,
        List<FindingResponse> findings,
        List<String> priorities,
        List<String> recommendations,
        List<String> services,
        List<String> cases,
        List<String> implementationSequence,
        String disclaimer) {

    static DiagnosticEvaluationResponse from(DiagnosticAssessment assessment) {
        return new DiagnosticEvaluationResponse(
                assessment.score(),
                assessment.status(),
                assessment.findings().stream().map(FindingResponse::from).toList(),
                assessment.priorities(),
                assessment.recommendations(),
                assessment.services(),
                assessment.cases(),
                assessment.implementationSequence(),
                assessment.disclaimer());
    }

    public record FindingResponse(String code, String severity, String title, String description) {

        static FindingResponse from(DiagnosticAssessment.Finding finding) {
            return new FindingResponse(
                    finding.code(),
                    finding.severity().name(),
                    finding.title(),
                    finding.description());
        }
    }
}
