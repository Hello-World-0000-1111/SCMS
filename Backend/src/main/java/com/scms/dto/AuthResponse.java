package com.scms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String userId;
    private String name;
    private String email;
    private String role;
    private String organizationId;
    private String organizationName;
    private String orgCode;
}
