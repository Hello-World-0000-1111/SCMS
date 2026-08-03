package com.scms.repository;

import com.scms.model.User;
import com.scms.model.enums.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByOrganizationIdAndEmployeeId(String organizationId, String employeeId);
    List<User> findByOrganizationId(String organizationId);
    List<User> findByOrganizationIdAndRole(String organizationId, Role role);
}
