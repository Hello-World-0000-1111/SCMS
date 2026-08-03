package com.scms.repository;

import com.scms.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByOrganizationId(String organizationId);
    Optional<Category> findByOrganizationIdAndNameIgnoreCase(String organizationId, String name);
    boolean existsByNameAndOrganizationId(String name, String organizationId);
}
