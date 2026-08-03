package com.scms.service;

import com.scms.dto.*;
import com.scms.exception.BadRequestException;
import com.scms.exception.ResourceNotFoundException;
import com.scms.model.Complaint;
import com.scms.model.User;
import com.scms.model.enums.Priority;
import com.scms.model.enums.Role;
import com.scms.model.enums.Status;
import com.scms.repository.ComplaintRepository;
import com.scms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final ComplaintMapper complaintMapper;
    private final ComplaintService complaintService;

    public StatsResponse getStats(User admin) {
        String orgId = admin.getOrganization().getId();
        return StatsResponse.builder()
                .total(complaintRepository.countByOrganizationId(orgId))
                .pending(complaintRepository.countByOrganizationIdAndStatus(orgId, Status.PENDING))
                .inProgress(complaintRepository.countByOrganizationIdAndStatus(orgId, Status.IN_PROGRESS))
                .resolved(complaintRepository.countByOrganizationIdAndStatus(orgId, Status.RESOLVED))
                .build();
    }

    public List<ComplaintResponse> getAllComplaints(User admin, String status, String category, String priority) {
        return complaintRepository.findByOrganizationIdOrderByCreatedAtDesc(admin.getOrganization().getId()).stream()
                .filter(c -> matchesStatus(c, status))
                .filter(c -> matchesCategory(c, category))
                .filter(c -> matchesPriority(c, priority))
                .map(complaintMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintResponse assignComplaint(String complaintId, String staffId, User admin) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        if (!complaint.getOrganization().getId().equals(admin.getOrganization().getId())) {
            throw new ResourceNotFoundException("Complaint not found");
        }

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new BadRequestException("Staff member not found"));

        if (staff.getRole() != Role.STAFF) {
            throw new BadRequestException("Selected user is not a staff member");
        }

        if (!staff.getOrganization().getId().equals(admin.getOrganization().getId())) {
            throw new BadRequestException("Staff member does not belong to your organization");
        }

        complaint.setAssignedTo(staff);
        complaint = complaintRepository.save(complaint);

        complaintService.addHistoryEntry(
                complaint,
                complaint.getStatus().name(),
                complaint.getStatus().name(),
                "Assigned to " + staff.getName(),
                admin
        );

        return complaintMapper.toResponse(complaint);
    }

    public List<UserResponse> getAllUsers(User admin) {
        return userRepository.findByOrganizationId(admin.getOrganization().getId()).stream()
                .map(complaintMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getStaffMembers(User admin) {
        return userRepository.findByOrganizationIdAndRole(admin.getOrganization().getId(), Role.STAFF).stream()
                .map(complaintMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateUserRole(String userId, String roleName, User admin) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getOrganization().getId().equals(admin.getOrganization().getId())) {
            throw new ResourceNotFoundException("User not found");
        }

        Role newRole;
        try {
            newRole = Role.valueOf(roleName.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid role: " + roleName);
        }

        user.setRole(newRole);
        user = userRepository.save(user);
        return complaintMapper.toUserResponse(user);
    }

    private boolean matchesStatus(Complaint complaint, String status) {
        if (status == null || status.isBlank()) {
            return true;
        }
        try {
            return complaint.getStatus() == Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return true;
        }
    }

    private boolean matchesCategory(Complaint complaint, String category) {
        if (category == null || category.isBlank()) {
            return true;
        }
        return complaint.getCategory() != null
                && complaint.getCategory().getName().equalsIgnoreCase(category);
    }

    private boolean matchesPriority(Complaint complaint, String priority) {
        if (priority == null || priority.isBlank()) {
            return true;
        }
        try {
            return complaint.getPriority() == Priority.valueOf(priority.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return true;
        }
    }
}
