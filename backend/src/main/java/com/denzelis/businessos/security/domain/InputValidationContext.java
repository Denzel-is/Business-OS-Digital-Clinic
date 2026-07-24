package com.denzelis.businessos.security.domain;

public enum InputValidationContext {
    DISPLAY_NAME(60),
    SEARCH_QUERY(120),
    SUPPORT_MESSAGE(240);

    private final int maximumLength;

    InputValidationContext(int maximumLength) {
        this.maximumLength = maximumLength;
    }

    public int maximumLength() {
        return maximumLength;
    }
}
