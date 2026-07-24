package com.denzelis.businessos.security.application;

import com.denzelis.businessos.security.domain.InputValidationAssessment;
import com.denzelis.businessos.security.domain.InputValidationAssessment.Outcome;
import com.denzelis.businessos.security.domain.InputValidationAssessment.RuleResult;
import com.denzelis.businessos.security.domain.InputValidationContext;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class InputValidationService {

    public InputValidationAssessment evaluate(InputValidationContext context, String value) {
        String normalized = normalize(value);
        boolean validLength = normalized.length() <= context.maximumLength();
        boolean hasUnsafeControlCharacters =
                value.codePoints().anyMatch(InputValidationService::isUnsafeControlCharacter);
        boolean hasInvisibleFormatCharacters =
                value.codePoints()
                        .anyMatch(codePoint -> Character.getType(codePoint) == Character.FORMAT);
        boolean matchesContextPolicy =
                context != InputValidationContext.DISPLAY_NAME
                        || normalized
                                .codePoints()
                                .allMatch(InputValidationService::isDisplayNameCodePoint);
        boolean containsMarkupDelimiters = normalized.contains("<") || normalized.contains(">");

        List<RuleResult> rules = new ArrayList<>();
        rules.add(
                new RuleResult(
                        "bounded-length",
                        "Контекстное ограничение длины",
                        validLength,
                        "Максимум для этого поля: " + context.maximumLength() + " символов."));
        rules.add(
                new RuleResult(
                        "control-characters",
                        "Управляющие символы",
                        !hasUnsafeControlCharacters,
                        "Скрытые управляющие символы не должны менять обработку значения."));
        rules.add(
                new RuleResult(
                        "invisible-formatting",
                        "Невидимое форматирование",
                        !hasInvisibleFormatCharacters,
                        "Невидимые управляющие направлением и форматированием символы требуют отклонения."));
        rules.add(
                new RuleResult(
                        "context-policy",
                        "Правило конкретного поля",
                        matchesContextPolicy,
                        context == InputValidationContext.DISPLAY_NAME
                                ? "Имя допускает буквы, цифры, пробел и ограниченный набор знаков."
                                : "Свободный текст проверяется по длине и безопасно кодируется при выводе."));
        rules.add(
                new RuleResult(
                        "output-context",
                        "Контекст вывода",
                        !containsMarkupDelimiters,
                        "Разметкоподобный текст показывается только как текст и требует дополнительной проверки контекста."));

        Outcome outcome =
                outcome(
                        validLength,
                        hasUnsafeControlCharacters,
                        hasInvisibleFormatCharacters,
                        matchesContextPolicy,
                        containsMarkupDelimiters);

        return new InputValidationAssessment(
                outcome,
                preview(normalized),
                rules,
                "Симуляция ничего не выполняет и не определяет наличие уязвимости. Сервер только применяет ограничения поля; безопасный вывод остаётся обязанностью интерфейса.");
    }

    private static Outcome outcome(
            boolean validLength,
            boolean hasUnsafeControlCharacters,
            boolean hasInvisibleFormatCharacters,
            boolean matchesContextPolicy,
            boolean containsMarkupDelimiters) {
        if (!validLength || hasUnsafeControlCharacters || hasInvisibleFormatCharacters) {
            return Outcome.REJECTED;
        }
        if (!matchesContextPolicy || containsMarkupDelimiters) {
            return Outcome.REVIEW_REQUIRED;
        }
        return Outcome.ACCEPTED;
    }

    private static String normalize(String value) {
        return value.strip().replaceAll("\\s+", " ");
    }

    private static String preview(String value) {
        return value.length() <= 80 ? value : value.substring(0, 80) + "…";
    }

    private static boolean isUnsafeControlCharacter(int codePoint) {
        return Character.isISOControl(codePoint)
                && codePoint != '\n'
                && codePoint != '\r'
                && codePoint != '\t';
    }

    private static boolean isDisplayNameCodePoint(int codePoint) {
        return Character.isLetterOrDigit(codePoint)
                || Character.isWhitespace(codePoint)
                || codePoint == '-'
                || codePoint == '\''
                || codePoint == '.';
    }
}
