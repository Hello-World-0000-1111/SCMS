package com.scms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OrgRegisterRequest {

    @NotBlank(message = "Organization name is required")
    private String orgName;

    private String address;

    @Email(message = "Invalid organization email format")
    private String contactEmail;

    @NotBlank(message = "Admin name is required")
    private String adminName;

    @NotBlank(message = "Admin email is required")
    @Email(message = "Invalid admin email format")
    private String adminEmail;

    @NotBlank(message = "Admin password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String adminPassword;

    private String adminEmployeeId;
}
