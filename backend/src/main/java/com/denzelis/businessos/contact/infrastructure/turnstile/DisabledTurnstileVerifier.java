package com.denzelis.businessos.contact.infrastructure.turnstile;

import com.denzelis.businessos.contact.application.TurnstileVerifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(
        prefix = "business-os.security.turnstile",
        name = "enabled",
        havingValue = "false",
        matchIfMissing = true)
public class DisabledTurnstileVerifier implements TurnstileVerifier {

    @Override
    public boolean verify(String token) {
        return true;
    }
}
