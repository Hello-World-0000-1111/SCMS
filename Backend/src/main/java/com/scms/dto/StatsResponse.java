package com.scms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StatsResponse {
    private long total;
    private long pending;
    private long inProgress;
    private long resolved;
}
