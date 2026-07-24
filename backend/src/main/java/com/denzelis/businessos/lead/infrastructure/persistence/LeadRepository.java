package com.denzelis.businessos.lead.infrastructure.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadRepository extends JpaRepository<LeadEntity, UUID> {}
