package com.scms.service;

import com.scms.dto.*;
import com.scms.model.Complaint;
import com.scms.model.ComplaintHistory;
import com.scms.model.User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ComplaintMapper {

    public ComplaintResponse toResponse(Complaint complaint) {
        return toResponse(complaint, false);
    }

    public ComplaintResponse toResponse(Complaint complaint, boolean includeHistory) {
        ComplaintResponse.ComplaintResponseBuilder builder = ComplaintResponse.builder()
                .id(complaint.getId())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .status(complaint.getStatus().name())
                .priority(complaint.getPriority().name())
                .category(complaint.getCategory() != null ? complaint.getCategory().getName() : null)
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt());

        if (complaint.getAssignedTo() != null) {
            builder.assignedTo(AssignedToResponse.builder()
                    .id(complaint.getAssignedTo().getId())
                    .name(complaint.getAssignedTo().getName())
                    .email(complaint.getAssignedTo().getEmail())
                    .build());
        }

        if (includeHistory) {
            builder.statusHistory(Collections.emptyList());
        }

        return builder.build();
    }

    public ComplaintResponse toDetailResponse(Complaint complaint, List<ComplaintHistory> history) {
        ComplaintResponse response = toResponse(complaint, true);
        response.setStatusHistory(history.stream()
                .map(this::toHistoryResponse)
                .collect(Collectors.toList()));
        return response;
    }

    public StatusHistoryResponse toHistoryResponse(ComplaintHistory history) {
        return StatusHistoryResponse.builder()
                .id(history.getId())
                .status(history.getNewStatus())
                .note(history.getRemarks())
                .changedAt(history.getChangedAt())
                .changedBy(ChangedByResponse.builder()
                        .name(history.getChangedBy() != null ? history.getChangedBy().getName() : null)
                        .build())
                .build();
    }

    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .employeeId(user.getEmployeeId())
                .role(user.getRole().name())
                .organizationId(user.getOrganization() != null ? user.getOrganization().getId() : null)
                .build();
    }

    public AuthResponse toAuthResponse(User user, String token) {
        AuthResponse.AuthResponseBuilder builder = AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name());

        if (user.getOrganization() != null) {
            builder.organizationId(user.getOrganization().getId())
                    .organizationName(user.getOrganization().getName())
                    .orgCode(user.getOrganization().getOrgCode());
        }

        return builder.build();
    }
}
