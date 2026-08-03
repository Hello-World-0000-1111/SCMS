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
public class StatusHistoryResponse {
    private String id;
    private String status;
    private String note;
    private LocalDateTime changedAt;
    private ChangedByResponse changedBy;
}
