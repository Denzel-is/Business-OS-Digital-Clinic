package com.denzelis.businessos.contact.api;

import com.denzelis.businessos.contact.application.ContactRequestService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contact-requests")
public class ContactRequestController {

    private final ContactRequestService service;

    public ContactRequestController(ContactRequestService service) {
        this.service = service;
    }

    @PostMapping
    ResponseEntity<ContactRequestResponse> submit(
            @Valid @RequestBody ContactRequestSubmission submission, HttpServletRequest request) {
        service.submit(submission, request);
        return ResponseEntity.accepted()
                .cacheControl(CacheControl.noStore())
                .body(new ContactRequestResponse(true));
    }
}
