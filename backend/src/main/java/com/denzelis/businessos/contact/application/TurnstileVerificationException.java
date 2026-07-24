package com.denzelis.businessos.contact.application;

public class TurnstileVerificationException extends RuntimeException {

    public TurnstileVerificationException() {
        super("Bot challenge validation failed");
    }
}
