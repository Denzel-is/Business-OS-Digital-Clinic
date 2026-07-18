package com.denzelis.businessos.diagnostic.api;

import com.denzelis.businessos.diagnostic.domain.DiagnosticAnswers;
import jakarta.validation.constraints.NotNull;

public record DiagnosticEvaluationRequest(
        @NotNull DiagnosticAnswers.BusinessType businessType,
        @NotNull DiagnosticAnswers.TeamSize teamSize,
        @NotNull DiagnosticAnswers.PrimaryProblem primaryProblem,
        @NotNull DiagnosticAnswers.ManualOperations manualOperations,
        @NotNull DiagnosticAnswers.ExistingSystems existingSystems,
        @NotNull DiagnosticAnswers.DigitalProduct digitalProduct,
        @NotNull DiagnosticAnswers.LeadHandling leadHandling,
        @NotNull DiagnosticAnswers.AnalyticsMaturity analytics,
        @NotNull DiagnosticAnswers.AiUsage aiUsage,
        @NotNull DiagnosticAnswers.PersonalDataUsage personalData,
        @NotNull DiagnosticAnswers.ExpectedResult expectedResult) {

    DiagnosticAnswers toAnswers() {
        return new DiagnosticAnswers(
                businessType,
                teamSize,
                primaryProblem,
                manualOperations,
                existingSystems,
                digitalProduct,
                leadHandling,
                analytics,
                aiUsage,
                personalData,
                expectedResult);
    }
}
