package com.denzelis.businessos.diagnostic.application;

import static org.assertj.core.api.Assertions.assertThat;

import com.denzelis.businessos.diagnostic.domain.DiagnosticAnswers;
import com.denzelis.businessos.diagnostic.domain.DiagnosticAssessment;
import org.junit.jupiter.api.Test;

class DiagnosticEvaluationServiceTests {

    private final DiagnosticEvaluationService service = new DiagnosticEvaluationService();

    @Test
    void identifiesCriticalFrictionWithoutInventingOutcomes() {
        DiagnosticAssessment assessment =
                service.evaluate(
                        new DiagnosticAnswers(
                                DiagnosticAnswers.BusinessType.SERVICES,
                                DiagnosticAnswers.TeamSize.ELEVEN_TO_FIFTY,
                                DiagnosticAnswers.PrimaryProblem.SECURITY_RISKS,
                                DiagnosticAnswers.ManualOperations.DOMINANT,
                                DiagnosticAnswers.ExistingSystems.FRAGMENTED,
                                DiagnosticAnswers.DigitalProduct.UNSTABLE,
                                DiagnosticAnswers.LeadHandling.CHAOTIC,
                                DiagnosticAnswers.AnalyticsMaturity.NONE,
                                DiagnosticAnswers.AiUsage.UNCONTROLLED,
                                DiagnosticAnswers.PersonalDataUsage.SENSITIVE,
                                DiagnosticAnswers.ExpectedResult.REDUCE_RISK));

        assertThat(assessment.score()).isEqualTo(20);
        assertThat(assessment.status()).isEqualTo("Высокое цифровое трение");
        assertThat(assessment.findings())
                .extracting(DiagnosticAssessment.Finding::code)
                .contains("security-risk", "personal-data", "uncontrolled-ai");
        assertThat(assessment.services()).contains("Security by design");
        assertThat(assessment.disclaimer()).contains("не заменяет полноценный аудит");
    }

    @Test
    void returnsHighScoreOnlyForControlledAnswers() {
        DiagnosticAssessment assessment =
                service.evaluate(
                        new DiagnosticAnswers(
                                DiagnosticAnswers.BusinessType.SAAS,
                                DiagnosticAnswers.TeamSize.TWO_TO_TEN,
                                DiagnosticAnswers.PrimaryProblem.POOR_UX,
                                DiagnosticAnswers.ManualOperations.NONE,
                                DiagnosticAnswers.ExistingSystems.INTEGRATED,
                                DiagnosticAnswers.DigitalProduct.MODERN,
                                DiagnosticAnswers.LeadHandling.AUTOMATED,
                                DiagnosticAnswers.AnalyticsMaturity.REAL_TIME,
                                DiagnosticAnswers.AiUsage.EMBEDDED,
                                DiagnosticAnswers.PersonalDataUsage.NONE,
                                DiagnosticAnswers.ExpectedResult.IMPROVE_EXPERIENCE));

        assertThat(assessment.score()).isEqualTo(91);
        assertThat(assessment.status()).isEqualTo("Устойчивый контур");
        assertThat(assessment.priorities()).containsExactly("Трение в интерфейсе");
    }
}
