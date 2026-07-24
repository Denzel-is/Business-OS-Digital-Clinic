package com.denzelis.businessos.auth.application;

import com.denzelis.businessos.user.infrastructure.persistence.UserAccountEntity;
import com.denzelis.businessos.user.infrastructure.persistence.UserAccountRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserAccountDetailsService implements UserDetailsService {

    private static final String GENERIC_ACCOUNT_ERROR = "Account credentials are invalid";

    private final UserAccountRepository repository;

    public UserAccountDetailsService(UserAccountRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) {
        UserAccountEntity account =
                repository
                        .findByEmailNormalized(UserAccountEntity.normalizeEmail(username))
                        .orElseThrow(() -> new UsernameNotFoundException(GENERIC_ACCOUNT_ERROR));

        String[] authorities =
                account.getRoles().stream()
                        .map(role -> "ROLE_" + role.getCode())
                        .sorted()
                        .toArray(String[]::new);

        return User.withUsername(account.getEmailNormalized())
                .password(account.getPasswordHash())
                .disabled(!account.isEnabled())
                .authorities(authorities)
                .build();
    }
}
