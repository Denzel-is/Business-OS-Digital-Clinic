package com.denzelis.businessos.user.infrastructure.persistence;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccountEntity, UUID> {

    @EntityGraph(attributePaths = "roles")
    Optional<UserAccountEntity> findByEmailNormalized(String emailNormalized);
}
