package com.scms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignRequest {

    @NotNull(message = "Staff ID is required")
    private String staffId;
}
