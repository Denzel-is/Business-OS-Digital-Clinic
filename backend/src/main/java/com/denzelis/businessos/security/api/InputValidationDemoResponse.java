package com.denzelis.businessos.security.api;

import com.denzelis.businessos.security.domain.InputValidationAssessment;
import java.util.List;

public record InputValidationDemoResponse(
        String outcome, String normalizedPreview, List<RuleResponse> rules, String explanation) {

    static InputValidationDemoResponse from(InputValidationAssessment assessment) {
        return new InputValidationDemoResponse(
                assessment.outcome().name(),
                assessment.normalizedPreview(),
                assessment.rules().stream().map(RuleResponse::from).toList(),
                assessment.explanation());
    }

    public record RuleResponse(String code, String label, boolean passed, String detail) {

        static RuleResponse from(InputValidationAssessment.RuleResult rule) {
            return new RuleResponse(rule.code(), rule.label(), rule.passed(), rule.detail());
        }
    }
}
