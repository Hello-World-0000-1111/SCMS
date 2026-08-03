package com.scms.controller;

import com.scms.dto.AuthResponse;
import com.scms.dto.OrgRegisterRequest;
import com.scms.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerOrganization(@Valid @RequestBody OrgRegisterRequest request) {
        return ResponseEntity.ok(organizationService.registerOrganization(request));
    }
}
