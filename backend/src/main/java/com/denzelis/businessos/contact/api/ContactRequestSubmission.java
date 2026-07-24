package com.denzelis.businessos.contact.api;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequestSubmission(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Email @Size(max = 320) String email,
        @NotBlank @Size(min = 20, max = 2000) String message,
        @AssertTrue boolean consent,
        @Size(max = 200) String website,
        @Size(max = 2048) String turnstileToken) {

    public ContactRequestSubmission {
        website = website == null ? "" : website;
        turnstileToken = turnstileToken == null ? "" : turnstileToken;
    }
}
