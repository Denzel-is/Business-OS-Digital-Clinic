package com.denzelis.businessos.security.application;

import static org.assertj.core.api.Assertions.assertThat;

import com.denzelis.businessos.security.domain.InputValidationAssessment.Outcome;
import com.denzelis.businessos.security.domain.InputValidationContext;
import org.junit.jupiter.api.Test;

class InputValidationServiceTests {

    private final InputValidationService service = new InputValidationService();

    @Test
    void acceptsANameThatMatchesTheFieldPolicy() {
        var assessment =
                service.evaluate(InputValidationContext.DISPLAY_NAME, "  Анна   Петрова  ");

        assertThat(assessment.outcome()).isEqualTo(Outcome.ACCEPTED);
        assertThat(assessment.normalizedPreview()).isEqualTo("Анна Петрова");
        assertThat(assessment.rules()).allMatch(rule -> rule.passed());
    }

    @Test
    void marksMarkupLikeSupportTextForReviewWithoutExecutingIt() {
        var assessment =
                service.evaluate(InputValidationContext.SUPPORT_MESSAGE, "Покажите <b>пример</b>");

        assertThat(assessment.outcome()).isEqualTo(Outcome.REVIEW_REQUIRED);
        assertThat(assessment.normalizedPreview()).contains("<b>пример</b>");
        assertThat(assessment.explanation()).contains("ничего не выполняет");
    }

    @Test
    void rejectsInvisibleFormattingAndContextSpecificOverflow() {
        var invisible = service.evaluate(InputValidationContext.SEARCH_QUERY, "обычный\u202Eтекст");
        var longName = service.evaluate(InputValidationContext.DISPLAY_NAME, "А".repeat(61));

        assertThat(invisible.outcome()).isEqualTo(Outcome.REJECTED);
        assertThat(longName.outcome()).isEqualTo(Outcome.REJECTED);
    }
}
