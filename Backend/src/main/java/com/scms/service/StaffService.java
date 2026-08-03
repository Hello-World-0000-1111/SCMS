package com.scms.service;

import com.scms.dto.ComplaintResponse;
import com.scms.exception.BadRequestException;
import com.scms.exception.ResourceNotFoundException;
import com.scms.model.Complaint;
import com.scms.model.ComplaintHistory;
import com.scms.model.User;
import com.scms.model.enums.Status;
import com.scms.repository.ComplaintHistoryRepository;
import com.scms.repository.ComplaintRepository;
import com.scms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintHistoryRepository complaintHistoryRepository;
    private final UserRepository userRepository;
    private final ComplaintService complaintService;

    public List<ComplaintResponse> getAssignedComplaints(String staffId) {
        return complaintRepository.findByAssignedToIdOrderByCreatedAtDesc(staffId).stream()
                .map(complaintService::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintResponse updateStatus(String id, String statusStr, String remarks, User principal) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        // Verify assignment
        if (complaint.getAssignedTo() == null || !complaint.getAssignedTo().getId().equals(principal.getId())) {
            throw new BadRequestException("This complaint is not assigned to you");
        }

        Status status;
        try {
            status = Status.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status value");
        }

        // Staff can only set status to IN_PROGRESS or RESOLVED
        if (status != Status.IN_PROGRESS && status != Status.RESOLVED) {
            throw new BadRequestException("Staff can only update status to IN_PROGRESS or RESOLVED");
        }

        User staff = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found"));

        String oldStatus = complaint.getStatus().name();
        complaint.setStatus(status);
        complaint = complaintRepository.save(complaint);

        // Record history
        ComplaintHistory history = ComplaintHistory.builder()
                .complaint(complaint)
                .oldStatus(oldStatus)
                .newStatus(status.name())
                .remarks(remarks != null ? remarks : "Status updated by staff")
                .changedBy(staff)
                .build();
        complaintHistoryRepository.save(history);

        return complaintService.mapToResponse(complaint);
    }
}
