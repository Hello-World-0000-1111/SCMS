package com.scms.repository;

import com.scms.model.ComplaintHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintHistoryRepository extends MongoRepository<ComplaintHistory, String> {
    List<ComplaintHistory> findByComplaintIdOrderByChangedAtAsc(String complaintId);
}
