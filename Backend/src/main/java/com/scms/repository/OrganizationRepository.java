package com.scms.repository;

import com.scms.model.Organization;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationRepository extends MongoRepository<Organization, String> {
    Optional<Organization> findByOrgCode(String orgCode);
    boolean existsByOrgCode(String orgCode);
}
