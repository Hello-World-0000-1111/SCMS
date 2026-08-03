package com.scms.controller;

import com.scms.dto.*;
import com.scms.service.AdminService;
import com.scms.service.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final CurrentUserService currentUserService;

    @GetMapping("/complaints/stats")
    public ResponseEntity<StatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats(currentUserService.getCurrentUser()));
    }

    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String priority
    ) {
        return ResponseEntity.ok(adminService.getAllComplaints(
                currentUserService.getCurrentUser(), status, category, priority));
    }

    @PutMapping("/complaints/{id}/assign")
    public ResponseEntity<ComplaintResponse> assignComplaint(
            @PathVariable String id,
            @Valid @RequestBody AssignRequest request
    ) {
        return ResponseEntity.ok(adminService.assignComplaint(
                id, request.getStaffId(), currentUserService.getCurrentUser()));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers(currentUserService.getCurrentUser()));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable String id,
            @Valid @RequestBody RoleUpdateRequest request
    ) {
        return ResponseEntity.ok(adminService.updateUserRole(
                id, request.getRole(), currentUserService.getCurrentUser()));
    }

    @GetMapping("/staff")
    public ResponseEntity<List<UserResponse>> getStaffMembers() {
        return ResponseEntity.ok(adminService.getStaffMembers(currentUserService.getCurrentUser()));
    }
}
