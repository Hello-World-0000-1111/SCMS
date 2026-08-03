package com.scms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ComplaintResponse {
    private String id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String category;
    private AssignedToResponse assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<StatusHistoryResponse> statusHistory;
}
