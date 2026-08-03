package com.scms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SuperAdminEnrollRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "Role is required")
    private String role; // USER, STAFF, ADMIN

    @NotBlank(message = "Organization ID is required")
    private String organizationId;
}
