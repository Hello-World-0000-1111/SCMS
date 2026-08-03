package com.scms.repository;

import com.scms.model.Complaint;
import com.scms.model.enums.Status;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends MongoRepository<Complaint, String> {
    List<Complaint> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Complaint> findByOrganizationIdOrderByCreatedAtDesc(String organizationId);
    List<Complaint> findByAssignedToIdOrderByCreatedAtDesc(String staffId);
    
    long countByOrganizationId(String organizationId);
    long countByOrganizationIdAndStatus(String organizationId, Status status);
}
