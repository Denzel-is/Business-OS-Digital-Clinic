package com.denzelis.businessos.security.api;

public record CsrfTokenResponse(String headerName, String parameterName, String token) {}
