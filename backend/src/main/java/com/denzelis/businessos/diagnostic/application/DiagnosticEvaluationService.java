package com.denzelis.businessos.diagnostic.application;

import com.denzelis.businessos.diagnostic.domain.DiagnosticAnswers;
import com.denzelis.businessos.diagnostic.domain.DiagnosticAssessment;
import com.denzelis.businessos.diagnostic.domain.DiagnosticAssessment.Finding;
import com.denzelis.businessos.diagnostic.domain.DiagnosticAssessment.Severity;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class DiagnosticEvaluationService {

    private static final String DISCLAIMER =
            "Предварительная диагностика основана только на выбранных ответах и не заменяет полноценный аудит.";

    public DiagnosticAssessment evaluate(DiagnosticAnswers answers) {
        List<Finding> findings = new ArrayList<>();
        Set<String> recommendations = new LinkedHashSet<>();
        Set<String> services = new LinkedHashSet<>();
        Set<String> cases = new LinkedHashSet<>();
        int deductions = primaryProblemDeduction(answers.primaryProblem());

        addPrimaryProblem(answers.primaryProblem(), findings, recommendations, services, cases);
        deductions += manualOperationsDeduction(answers.manualOperations());
        addManualOperations(answers.manualOperations(), findings, recommendations, services, cases);
        deductions += existingSystemsDeduction(answers.existingSystems());
        addExistingSystems(answers.existingSystems(), findings, recommendations, services);
        deductions += digitalProductDeduction(answers.digitalProduct());
        addDigitalProduct(answers.digitalProduct(), findings, recommendations, services, cases);
        deductions += leadHandlingDeduction(answers.leadHandling());
        addLeadHandling(answers.leadHandling(), findings, recommendations, services, cases);
        deductions += analyticsDeduction(answers.analytics());
        addAnalytics(answers.analytics(), findings, recommendations, services, cases);
        deductions += aiUsageDeduction(answers.aiUsage());
        addAiUsage(answers.aiUsage(), findings, recommendations, services, cases);
        deductions += personalDataDeduction(answers.personalData());
        addPersonalData(answers.personalData(), findings, recommendations, services, cases);
        addExpectedResult(answers.expectedResult(), recommendations, services);

        List<Finding> orderedFindings =
                findings.stream()
                        .sorted(
                                Comparator.comparingInt(
                                                (Finding finding) ->
                                                        severityOrder(finding.severity()))
                                        .thenComparing(Finding::code))
                        .toList();
        List<String> priorities =
                orderedFindings.stream()
                        .filter(finding -> finding.severity() != Severity.LOW)
                        .limit(3)
                        .map(Finding::title)
                        .toList();
        int score = Math.max(20, 100 - deductions);

        return new DiagnosticAssessment(
                score,
                scoreStatus(score),
                orderedFindings,
                priorities,
                List.copyOf(recommendations),
                List.copyOf(services),
                List.copyOf(cases),
                implementationSequence(orderedFindings),
                DISCLAIMER);
    }

    private static void addPrimaryProblem(
            DiagnosticAnswers.PrimaryProblem problem,
            List<Finding> findings,
            Set<String> recommendations,
            Set<String> services,
            Set<String> cases) {
        switch (problem) {
            case LOST_LEADS ->
                    add(
                            findings,
                            recommendations,
                            services,
                            cases,
                            new Finding(
                                    "lead-loss",
                                    Severity.HIGH,
                                    "Потери в обработке заявок",
                                    "Нужно проследить путь заявки от канала до ответственного."),
                            "Собрать единую воронку и события передачи заявки.",
                            "Автоматизация",
                            "Автоматизация обработки заявок");
            case MANUAL_WORK ->
                    add(
                            findings,
                            recommendations,
                            services,
                            cases,
                            new Finding(
                                    "manual-load",
                                    Severity.MEDIUM,
                                    "Высокая доля ручных операций",
                                    "Повторяющиеся действия ограничивают скорость процесса."),
                            "Описать повторяемые сценарии и оценить безопасную автоматизацию.",
                            "Автоматизация",
                            "Автоматизация обработки заявок");
            case LOW_CONVERSION ->
                    add(
                            findings,
                            recommendations,
                            services,
                            cases,
                            new Finding(
                                    "conversion-friction",
                                    Severity.MEDIUM,
                                    "Неизмеренное пользовательское трение",
                                    "Целевой путь требует событийной аналитики и UX-проверки."),
                            "Инструментировать ключевые шаги и проверить причины отказа.",
                            "UX/UI",
                            "Редизайн интернет-магазина");
            case UNSTABLE_SYSTEMS ->
                    add(
                            findings,
                            recommendations,
                            services,
                            cases,
                            new Finding(
                                    "system-instability",
                                    Severity.HIGH,
                                    "Нестабильный цифровой контур",
                                    "Сначала нужна наблюдаемость и карта критичных зависимостей."),
                            "Зафиксировать SLI, ошибки и критичные пользовательские сценарии.",
                            "Business systems",
                            "Аналитический дашборд");
            case SECURITY_RISKS ->
                    add(
                            findings,
                            recommendations,
                            services,
                            cases,
                            new Finding(
                                    "security-risk",
                                    Severity.HIGH,
                                    "Непроверенный контур безопасности",
                                    "Риски нельзя оценить без активов, потоков данных и модели угроз."),
                            "Провести инвентаризацию активов и первичное моделирование угроз.",
                            "Security by design",
                            "Защищённый клиентский портал");
            case POOR_UX ->
                    add(
                            findings,
                            recommendations,
                            services,
                            cases,
                            new Finding(
                                    "ux-friction",
                                    Severity.MEDIUM,
                                    "Трение в интерфейсе",
                                    "Нужна проверка маршрутов, ошибок и доступности интерфейса."),
                            "Провести сценарный UX-аудит на реальных задачах.",
                            "UX/UI",
                            "Редизайн интернет-магазина");
        }
    }

    private static void addManualOperations(
            DiagnosticAnswers.ManualOperations value,
            List<Finding> findings,
            Set<String> recommendations,
            Set<String> services,
            Set<String> cases) {
        if (value == DiagnosticAnswers.ManualOperations.REGULAR
                || value == DiagnosticAnswers.ManualOperations.DOMINANT) {
            Severity severity =
                    value == DiagnosticAnswers.ManualOperations.DOMINANT
                            ? Severity.HIGH
                            : Severity.MEDIUM;
            add(
                    findings,
                    recommendations,
                    services,
                    cases,
                    new Finding(
                            "manual-operations",
                            severity,
                            "Повторяющаяся ручная работа",
                            "Ошибки и задержки растут вместе с объёмом операций."),
                    "Выбрать один частый сценарий и измерить время до и после автоматизации.",
                    "Автоматизация",
                    "Автоматизация обработки заявок");
        }
    }

    private static void addExistingSystems(
            DiagnosticAnswers.ExistingSystems value,
            List<Finding> findings,
            Set<String> recommendations,
            Set<String> services) {
        if (value == DiagnosticAnswers.ExistingSystems.FRAGMENTED
                || value == DiagnosticAnswers.ExistingSystems.NONE) {
            add(
                    findings,
                    recommendations,
                    services,
                    Set.of(),
                    new Finding(
                            "system-fragmentation",
                            Severity.MEDIUM,
                            "Разорванный системный контур",
                            "Данные и ответственность теряются между несвязанными инструментами."),
                    "Спроектировать целевой поток данных до выбора интеграционного решения.",
                    "Business systems",
                    null);
        }
    }

    private static void addDigitalProduct(
            DiagnosticAnswers.DigitalProduct value,
            List<Finding> findings,
            Set<String> recommendations,
            Set<String> services,
            Set<String> cases) {
        if (value == DiagnosticAnswers.DigitalProduct.OUTDATED
                || value == DiagnosticAnswers.DigitalProduct.UNSTABLE) {
            add(
                    findings,
                    recommendations,
                    services,
                    cases,
                    new Finding(
                            "digital-product",
                            value == DiagnosticAnswers.DigitalProduct.UNSTABLE
                                    ? Severity.HIGH
                                    : Severity.MEDIUM,
                            "Проблемный сайт или приложение",
                            "Технические и UX-риски нужно разделить до переписывания продукта."),
                    "Провести технический и сценарный аудит текущего продукта.",
                    "Web-продукты",
                    "Редизайн интернет-магазина");
        }
    }

    private static void addLeadHandling(
            DiagnosticAnswers.LeadHandling value,
            List<Finding> findings,
            Set<String> recommendations,
            Set<String> services,
            Set<String> cases) {
        if (value == DiagnosticAnswers.LeadHandling.MANUAL
                || value == DiagnosticAnswers.LeadHandling.CHAOTIC) {
            add(
                    findings,
                    recommendations,
                    services,
                    cases,
                    new Finding(
                            "lead-routing",
                            value == DiagnosticAnswers.LeadHandling.CHAOTIC
                                    ? Severity.HIGH
                                    : Severity.MEDIUM,
                            "Ручная маршрутизация заявок",
                            "Нет гарантированного назначения, статуса и времени реакции."),
                    "Определить единый статусный маршрут и правила назначения.",
                    "Автоматизация",
                    "Автоматизация обработки заявок");
        }
    }

    private static void addAnalytics(
            DiagnosticAnswers.AnalyticsMaturity value,
            List<Finding> findings,
            Set<String> recommendations,
            Set<String> services,
            Set<String> cases) {
        if (value == DiagnosticAnswers.AnalyticsMaturity.MANUAL
                || value == DiagnosticAnswers.AnalyticsMaturity.NONE) {
            add(
                    findings,
                    recommendations,
                    services,
                    cases,
                    new Finding(
                            "analytics-gap",
                            value == DiagnosticAnswers.AnalyticsMaturity.NONE
                                    ? Severity.HIGH
                                    : Severity.MEDIUM,
                            "Недостаточная наблюдаемость бизнеса",
                            "Решения принимаются без своевременных и согласованных сигналов."),
                    "Согласовать минимальный набор событий, метрик и владельцев данных.",
                    "Data и аналитика",
                    "Аналитический дашборд");
        }
    }

    private static void addAiUsage(
            DiagnosticAnswers.AiUsage value,
            List<Finding> findings,
            Set<String> recommendations,
            Set<String> services,
            Set<String> cases) {
        if (value == DiagnosticAnswers.AiUsage.UNCONTROLLED) {
            add(
                    findings,
                    recommendations,
                    services,
                    cases,
                    new Finding(
                            "uncontrolled-ai",
                            Severity.HIGH,
                            "Неконтролируемое использование ИИ",
                            "Не определены разрешённые данные, источники и проверка результата."),
                    "Ввести политику данных, проверяемые источники и human-in-the-loop.",
                    "AI-интеграции",
                    "ИИ-помощник сотрудников");
        }
    }

    private static void addPersonalData(
            DiagnosticAnswers.PersonalDataUsage value,
            List<Finding> findings,
            Set<String> recommendations,
            Set<String> services,
            Set<String> cases) {
        if (value == DiagnosticAnswers.PersonalDataUsage.REGULAR
                || value == DiagnosticAnswers.PersonalDataUsage.SENSITIVE) {
            add(
                    findings,
                    recommendations,
                    services,
                    cases,
                    new Finding(
                            "personal-data",
                            value == DiagnosticAnswers.PersonalDataUsage.SENSITIVE
                                    ? Severity.HIGH
                                    : Severity.MEDIUM,
                            "Повышенные требования к данным",
                            "Нужны минимизация, разграничение доступа, аудит и план восстановления."),
                    "Описать потоки персональных данных и проверить доступ по ролям.",
                    "Security by design",
                    "Защищённый клиентский портал");
        }
    }

    private static void addExpectedResult(
            DiagnosticAnswers.ExpectedResult value,
            Set<String> recommendations,
            Set<String> services) {
        switch (value) {
            case SAVE_TIME -> services.add("Автоматизация");
            case GROW_REVENUE -> services.add("Web-продукты");
            case IMPROVE_EXPERIENCE -> services.add("UX/UI");
            case REDUCE_RISK -> services.add("Security by design");
            case GAIN_VISIBILITY -> services.add("Data и аналитика");
        }
        recommendations.add("Зафиксировать исходный сигнал и критерий результата до внедрения.");
    }

    private static void add(
            List<Finding> findings,
            Set<String> recommendations,
            Set<String> services,
            Set<String> cases,
            Finding finding,
            String recommendation,
            String service,
            String caseTitle) {
        findings.add(finding);
        recommendations.add(recommendation);
        services.add(service);
        if (caseTitle != null) {
            cases.add(caseTitle);
        }
    }

    private static int primaryProblemDeduction(DiagnosticAnswers.PrimaryProblem value) {
        return switch (value) {
            case LOST_LEADS -> 12;
            case MANUAL_WORK, LOW_CONVERSION -> 10;
            case UNSTABLE_SYSTEMS -> 15;
            case SECURITY_RISKS -> 16;
            case POOR_UX -> 9;
        };
    }

    private static int manualOperationsDeduction(DiagnosticAnswers.ManualOperations value) {
        return switch (value) {
            case NONE -> 0;
            case RARE -> 2;
            case REGULAR -> 8;
            case DOMINANT -> 15;
        };
    }

    private static int existingSystemsDeduction(DiagnosticAnswers.ExistingSystems value) {
        return switch (value) {
            case INTEGRATED -> 0;
            case PARTIAL -> 5;
            case FRAGMENTED -> 11;
            case NONE -> 8;
        };
    }

    private static int digitalProductDeduction(DiagnosticAnswers.DigitalProduct value) {
        return switch (value) {
            case MODERN -> 0;
            case OUTDATED -> 8;
            case UNSTABLE -> 13;
            case NONE -> 5;
        };
    }

    private static int leadHandlingDeduction(DiagnosticAnswers.LeadHandling value) {
        return switch (value) {
            case AUTOMATED -> 0;
            case PARTIAL -> 4;
            case MANUAL -> 9;
            case CHAOTIC -> 14;
        };
    }

    private static int analyticsDeduction(DiagnosticAnswers.AnalyticsMaturity value) {
        return switch (value) {
            case REAL_TIME -> 0;
            case BASIC -> 3;
            case MANUAL -> 8;
            case NONE -> 12;
        };
    }

    private static int aiUsageDeduction(DiagnosticAnswers.AiUsage value) {
        return switch (value) {
            case NONE, EMBEDDED -> 0;
            case EXPERIMENTING -> 1;
            case UNCONTROLLED -> 7;
        };
    }

    private static int personalDataDeduction(DiagnosticAnswers.PersonalDataUsage value) {
        return switch (value) {
            case NONE -> 0;
            case LIMITED -> 1;
            case REGULAR -> 3;
            case SENSITIVE -> 7;
        };
    }

    private static int severityOrder(Severity severity) {
        return switch (severity) {
            case HIGH -> 0;
            case MEDIUM -> 1;
            case LOW -> 2;
        };
    }

    private static String scoreStatus(int score) {
        if (score >= 80) {
            return "Устойчивый контур";
        }
        if (score >= 60) {
            return "Требует внимания";
        }
        return "Высокое цифровое трение";
    }

    private static List<String> implementationSequence(List<Finding> findings) {
        List<String> sequence = new ArrayList<>();
        sequence.add("Подтвердить симптомы данными и владельцами процесса.");
        if (findings.stream().anyMatch(finding -> finding.severity() == Severity.HIGH)) {
            sequence.add("Стабилизировать критичные риски и точки потери данных.");
        }
        sequence.add("Спроектировать минимальный целевой процесс и контрольные события.");
        sequence.add("Внедрять по одному измеримому сценарию с проверкой результата.");
        return List.copyOf(sequence);
    }
}
