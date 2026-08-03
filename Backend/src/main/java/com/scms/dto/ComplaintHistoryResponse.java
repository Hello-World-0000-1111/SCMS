package com.scms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ComplaintHistoryResponse {
    private String id;
    private String oldStatus;
    private String newStatus;
    private String remarks;
    private String changedByName;
    private LocalDateTime changedAt;
}
