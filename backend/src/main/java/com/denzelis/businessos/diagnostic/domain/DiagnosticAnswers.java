package com.denzelis.businessos.diagnostic.domain;

public record DiagnosticAnswers(
        BusinessType businessType,
        TeamSize teamSize,
        PrimaryProblem primaryProblem,
        ManualOperations manualOperations,
        ExistingSystems existingSystems,
        DigitalProduct digitalProduct,
        LeadHandling leadHandling,
        AnalyticsMaturity analytics,
        AiUsage aiUsage,
        PersonalDataUsage personalData,
        ExpectedResult expectedResult) {

    public enum BusinessType {
        RETAIL,
        SERVICES,
        SAAS,
        MANUFACTURING,
        NONPROFIT,
        OTHER
    }

    public enum TeamSize {
        SOLO,
        TWO_TO_TEN,
        ELEVEN_TO_FIFTY,
        FIFTY_ONE_TO_TWO_HUNDRED,
        OVER_TWO_HUNDRED
    }

    public enum PrimaryProblem {
        LOST_LEADS,
        MANUAL_WORK,
        LOW_CONVERSION,
        UNSTABLE_SYSTEMS,
        SECURITY_RISKS,
        POOR_UX
    }

    public enum ManualOperations {
        NONE,
        RARE,
        REGULAR,
        DOMINANT
    }

    public enum ExistingSystems {
        INTEGRATED,
        PARTIAL,
        FRAGMENTED,
        NONE
    }

    public enum DigitalProduct {
        MODERN,
        OUTDATED,
        UNSTABLE,
        NONE
    }

    public enum LeadHandling {
        AUTOMATED,
        PARTIAL,
        MANUAL,
        CHAOTIC
    }

    public enum AnalyticsMaturity {
        REAL_TIME,
        BASIC,
        MANUAL,
        NONE
    }

    public enum AiUsage {
        NONE,
        EXPERIMENTING,
        EMBEDDED,
        UNCONTROLLED
    }

    public enum PersonalDataUsage {
        NONE,
        LIMITED,
        REGULAR,
        SENSITIVE
    }

    public enum ExpectedResult {
        SAVE_TIME,
        GROW_REVENUE,
        IMPROVE_EXPERIENCE,
        REDUCE_RISK,
        GAIN_VISIBILITY
    }
}
