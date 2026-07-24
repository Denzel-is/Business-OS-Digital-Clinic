package com.denzelis.businessos.auth.application;

import com.denzelis.businessos.user.infrastructure.persistence.RoleEntity;
import com.denzelis.businessos.user.infrastructure.persistence.RoleRepository;
import com.denzelis.businessos.user.infrastructure.persistence.UserAccountEntity;
import com.denzelis.businessos.user.infrastructure.persistence.UserAccountRepository;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminBootstrapService implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapService.class);
    private static final Pattern SIMPLE_EMAIL =
            Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", Pattern.CASE_INSENSITIVE);
    private static final int MINIMUM_PASSWORD_LENGTH = 16;

    private final AdminBootstrapProperties properties;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final UserAccountRepository userAccountRepository;

    public AdminBootstrapService(
            AdminBootstrapProperties properties,
            PasswordEncoder passwordEncoder,
            RoleRepository roleRepository,
            UserAccountRepository userAccountRepository) {
        this.properties = properties;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments arguments) {
        if (!properties.enabled()) {
            return;
        }

        validateConfiguration();
        String normalizedEmail = UserAccountEntity.normalizeEmail(properties.email());
        if (userAccountRepository.findByEmailNormalized(normalizedEmail).isPresent()) {
            log.info("Bootstrap administrator already exists; no credential was changed.");
            return;
        }

        RoleEntity administratorRole =
                roleRepository
                        .findByCode("ADMIN")
                        .orElseThrow(
                                () ->
                                        new IllegalStateException(
                                                "ADMIN role is missing from database migrations"));
        UserAccountEntity administrator =
                UserAccountEntity.createAdministrator(
                        normalizedEmail,
                        passwordEncoder.encode(properties.password()),
                        properties.displayName(),
                        administratorRole);
        userAccountRepository.save(administrator);
        log.info("Bootstrap administrator created. Disable bootstrap configuration now.");
    }

    private void validateConfiguration() {
        if (!SIMPLE_EMAIL.matcher(properties.email()).matches()) {
            throw new IllegalStateException("Bootstrap administrator email is invalid");
        }
        if (properties.password().length() < MINIMUM_PASSWORD_LENGTH) {
            throw new IllegalStateException(
                    "Bootstrap administrator password must contain at least "
                            + MINIMUM_PASSWORD_LENGTH
                            + " characters");
        }
        if (properties.displayName().isBlank() || properties.displayName().length() > 120) {
            throw new IllegalStateException("Bootstrap administrator display name is invalid");
        }
    }
}
