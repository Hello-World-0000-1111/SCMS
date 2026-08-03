package com.scms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ComplaintRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String categoryId;

    private String category;

    @NotBlank(message = "Priority is required")
    private String priority;
}
