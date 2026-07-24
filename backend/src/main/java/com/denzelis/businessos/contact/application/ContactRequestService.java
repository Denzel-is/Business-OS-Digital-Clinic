package com.denzelis.businessos.contact.application;

import com.denzelis.businessos.contact.api.ContactRequestSubmission;
import com.denzelis.businessos.contact.infrastructure.persistence.ContactRequestEntity;
import com.denzelis.businessos.contact.infrastructure.persistence.ContactRequestRepository;
import com.denzelis.businessos.lead.infrastructure.persistence.LeadEntity;
import com.denzelis.businessos.lead.infrastructure.persistence.LeadRepository;
import com.denzelis.businessos.security.application.ClientFingerprint;
import com.denzelis.businessos.security.infrastructure.persistence.SecurityEventEntity;
import com.denzelis.businessos.security.infrastructure.persistence.SecurityEventRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactRequestService {

    private final ClientFingerprint clientFingerprint;
    private final ContactRequestRepository contactRequestRepository;
    private final LeadRepository leadRepository;
    private final SecurityEventRepository securityEventRepository;
    private final TurnstileVerifier turnstileVerifier;

    public ContactRequestService(
            ClientFingerprint clientFingerprint,
            ContactRequestRepository contactRequestRepository,
            LeadRepository leadRepository,
            SecurityEventRepository securityEventRepository,
            TurnstileVerifier turnstileVerifier) {
        this.clientFingerprint = clientFingerprint;
        this.contactRequestRepository = contactRequestRepository;
        this.leadRepository = leadRepository;
        this.securityEventRepository = securityEventRepository;
        this.turnstileVerifier = turnstileVerifier;
    }

    @Transactional
    public void submit(ContactRequestSubmission submission, HttpServletRequest request) {
        if (!submission.website().isBlank()) {
            securityEventRepository.save(
                    SecurityEventEntity.record(
                            "HONEYPOT_TRIGGERED",
                            SecurityEventEntity.Severity.INFO,
                            clientFingerprint.from(request),
                            "A public contact honeypot was populated"));
            return;
        }
        if (!turnstileVerifier.verify(submission.turnstileToken())) {
            throw new TurnstileVerificationException();
        }

        ContactRequestEntity contactRequest =
                contactRequestRepository.save(
                        ContactRequestEntity.create(
                                submission.name(),
                                submission.email(),
                                submission.message(),
                                Instant.now()));
        leadRepository.save(LeadEntity.fromContactRequest(contactRequest.getId()));
    }
}
