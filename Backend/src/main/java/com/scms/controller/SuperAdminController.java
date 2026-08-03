package com.scms.controller;

import com.scms.dto.OrgRegisterRequest;
import com.scms.dto.SuperAdminEnrollRequest;
import com.scms.dto.UserResponse;
import com.scms.model.Organization;
import com.scms.service.SuperAdminService;
import com.scms.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final SuperAdminService superAdminService;
    private final OrganizationService organizationService;

    @GetMapping("/organizations")
    public ResponseEntity<List<Organization>> getAllOrganizations() {
        return ResponseEntity.ok(superAdminService.getAllOrganizations());
    }

    @PostMapping("/organizations")
    public ResponseEntity<?> registerOrganization(@Valid @RequestBody OrgRegisterRequest request) {
        return ResponseEntity.ok(organizationService.registerOrganization(request));
    }

    @PostMapping("/enroll")
    public ResponseEntity<UserResponse> enrollUser(@Valid @RequestBody SuperAdminEnrollRequest request) {
        return ResponseEntity.ok(superAdminService.enrollUser(request));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(superAdminService.getAllUsers());
    }
}
