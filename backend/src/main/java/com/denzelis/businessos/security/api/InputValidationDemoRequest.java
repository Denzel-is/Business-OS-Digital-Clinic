package com.denzelis.businessos.security.api;

import com.denzelis.businessos.security.domain.InputValidationContext;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record InputValidationDemoRequest(
        @NotNull InputValidationContext context, @NotBlank @Size(max = 240) String value) {}
