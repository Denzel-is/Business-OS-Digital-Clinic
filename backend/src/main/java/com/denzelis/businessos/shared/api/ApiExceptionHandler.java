package com.denzelis.businessos.shared.api;

import jakarta.validation.ConstraintViolationException;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ApiExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(ApiExceptionHandler.class);
    private static final URI VALIDATION_TYPE =
            URI.create("urn:business-os:problem:validation-error");
    private static final URI MALFORMED_INPUT_TYPE =
            URI.create("urn:business-os:problem:malformed-input");
    private static final URI PAYLOAD_TOO_LARGE_TYPE =
            URI.create("urn:business-os:problem:payload-too-large");
    private static final URI INTERNAL_ERROR_TYPE =
            URI.create("urn:business-os:problem:internal-error");

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ProblemDetail> handleInvalidArguments(
            MethodArgumentNotValidException exception) {
        List<ApiValidationError> errors =
                exception.getBindingResult().getFieldErrors().stream()
                        .map(
                                error ->
                                        new ApiValidationError(
                                                error.getField(),
                                                error.getDefaultMessage() == null
                                                        ? "Invalid value."
                                                        : error.getDefaultMessage()))
                        .distinct()
                        .toList();

        ProblemDetail problem =
                problem(
                        HttpStatus.BAD_REQUEST,
                        VALIDATION_TYPE,
                        "Validation failed",
                        "One or more request fields are invalid.");
        problem.setProperty("errors", errors);
        return response(problem);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<ProblemDetail> handleConstraintViolation(
            ConstraintViolationException exception) {
        List<ApiValidationError> errors =
                exception.getConstraintViolations().stream()
                        .map(
                                violation ->
                                        new ApiValidationError(
                                                violation.getPropertyPath().toString(),
                                                violation.getMessage()))
                        .distinct()
                        .toList();

        ProblemDetail problem =
                problem(
                        HttpStatus.BAD_REQUEST,
                        VALIDATION_TYPE,
                        "Validation failed",
                        "One or more request values are invalid.");
        problem.setProperty("errors", errors);
        return response(problem);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<ProblemDetail> handleMalformedInput(HttpMessageNotReadableException exception) {
        return response(
                problem(
                        HttpStatus.BAD_REQUEST,
                        MALFORMED_INPUT_TYPE,
                        "Malformed request",
                        "The request body could not be read."));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    ResponseEntity<ProblemDetail> handlePayloadTooLarge(MaxUploadSizeExceededException exception) {
        return response(
                problem(
                        HttpStatus.CONTENT_TOO_LARGE,
                        PAYLOAD_TOO_LARGE_TYPE,
                        "Payload too large",
                        "The request exceeds the configured upload limit."));
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ProblemDetail> handleUnexpectedFailure(Exception exception) {
        String errorId = UUID.randomUUID().toString();
        LOGGER.error(
                "Unhandled API failure id={} type={}",
                errorId,
                exception.getClass().getSimpleName());

        ProblemDetail problem =
                problem(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        INTERNAL_ERROR_TYPE,
                        "Internal server error",
                        "The request could not be completed.");
        problem.setProperty("errorId", errorId);
        return response(problem);
    }

    private static ProblemDetail problem(HttpStatus status, URI type, String title, String detail) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail);
        problem.setType(type);
        problem.setTitle(title);
        return problem;
    }

    private static ResponseEntity<ProblemDetail> response(ProblemDetail problem) {
        return ResponseEntity.status(problem.getStatus())
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(problem);
    }
}
