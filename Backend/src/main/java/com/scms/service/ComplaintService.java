package com.scms.service;

import com.scms.dto.ComplaintRequest;
import com.scms.dto.ComplaintResponse;
import com.scms.exception.BadRequestException;
import com.scms.exception.ResourceNotFoundException;
import com.scms.model.*;
import com.scms.model.enums.Priority;
import com.scms.model.enums.Role;
import com.scms.model.enums.Status;
import com.scms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintHistoryRepository complaintHistoryRepository;
    private final CategoryRepository categoryRepository;
    private final ComplaintMapper complaintMapper;

    public List<ComplaintResponse> getMyComplaints(User user) {
        return complaintRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(complaintMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintResponse submitComplaint(ComplaintRequest request, User user) {
        Category category = resolveCategory(request, user);
        Priority priority = parsePriority(request.getPriority());

        Complaint complaint = Complaint.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .status(Status.PENDING)
                .priority(priority)
                .user(user)
                .category(category)
                .organization(user.getOrganization())
                .build();

        complaint = complaintRepository.save(complaint);
        addHistoryEntry(complaint, null, Status.PENDING.name(), "Complaint submitted", user);

        return complaintMapper.toResponse(complaint);
    }

    public ComplaintResponse getComplaintDetail(String id, User currentUser) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        validateAccess(complaint, currentUser);

        List<ComplaintHistory> history = complaintHistoryRepository
                .findByComplaintIdOrderByChangedAtAsc(complaint.getId());

        return complaintMapper.toDetailResponse(complaint, history);
    }

    private void validateAccess(Complaint complaint, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            if (!complaint.getOrganization().getId().equals(currentUser.getOrganization().getId())) {
                throw new ResourceNotFoundException("Complaint not found");
            }
            return;
        }

        if (currentUser.getRole() == Role.STAFF) {
            if (complaint.getAssignedTo() == null
                    || !complaint.getAssignedTo().getId().equals(currentUser.getId())) {
                throw new ResourceNotFoundException("Complaint not found");
            }
            return;
        }

        if (!complaint.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Complaint not found");
        }
    }

    private Category resolveCategory(ComplaintRequest request, User user) {
        if (request.getCategoryId() != null) {
            return categoryRepository.findById(request.getCategoryId())
                    .filter(c -> c.getOrganization().getId().equals(user.getOrganization().getId()))
                    .orElseThrow(() -> new BadRequestException("Invalid category"));
        }

        if (request.getCategory() == null || request.getCategory().isBlank()) {
            throw new BadRequestException("Category is required");
        }

        return categoryRepository
                .findByOrganizationIdAndNameIgnoreCase(user.getOrganization().getId(), request.getCategory().trim())
                .orElseThrow(() -> new BadRequestException("Invalid category: " + request.getCategory()));
    }

    private Priority parsePriority(String priority) {
        try {
            return Priority.valueOf(priority.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid priority: " + priority);
        }
    }

    void addHistoryEntry(Complaint complaint, String oldStatus, String newStatus, String remarks, User changedBy) {
        ComplaintHistory history = ComplaintHistory.builder()
                .complaint(complaint)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .remarks(remarks)
                .changedBy(changedBy)
                .build();
        complaintHistoryRepository.save(history);
    }

    public List<ComplaintHistory> getComplaintHistory(String id, User currentUser) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        validateAccess(complaint, currentUser);
        return complaintHistoryRepository.findByComplaintIdOrderByChangedAtAsc(complaint.getId());
    }

    public ComplaintResponse mapToResponse(Complaint complaint) {
        return complaintMapper.toResponse(complaint);
    }
}
