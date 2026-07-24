package com.denzelis.businessos.security.domain;

import java.util.List;

public record InputValidationAssessment(
        Outcome outcome, String normalizedPreview, List<RuleResult> rules, String explanation) {

    public InputValidationAssessment {
        rules = List.copyOf(rules);
    }

    public record RuleResult(String code, String label, boolean passed, String detail) {}

    public enum Outcome {
        ACCEPTED,
        REVIEW_REQUIRED,
        REJECTED
    }
}
