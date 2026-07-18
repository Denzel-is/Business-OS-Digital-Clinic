package com.denzelis.businessos.diagnostic.domain;

import java.util.List;

public record DiagnosticAssessment(
        int score,
        String status,
        List<Finding> findings,
        List<String> priorities,
        List<String> recommendations,
        List<String> services,
        List<String> cases,
        List<String> implementationSequence,
        String disclaimer) {

    public DiagnosticAssessment {
        findings = List.copyOf(findings);
        priorities = List.copyOf(priorities);
        recommendations = List.copyOf(recommendations);
        services = List.copyOf(services);
        cases = List.copyOf(cases);
        implementationSequence = List.copyOf(implementationSequence);
    }

    public record Finding(String code, Severity severity, String title, String description) {}

    public enum Severity {
        HIGH,
        MEDIUM,
        LOW
    }
}
