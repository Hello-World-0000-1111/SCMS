package com.scms.controller;

import com.scms.model.User;
import com.scms.dto.ComplaintResponse;
import com.scms.service.StaffService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import com.scms.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintResponse>> getAssignedComplaints(
            @AuthenticationPrincipal User principal
    ) {
        if (principal == null) {
            throw new BadRequestException("Missing authentication token");
        }
        List<ComplaintResponse> response = staffService.getAssignedComplaints(principal.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal User principal
    ) {
        if (principal == null) {
            throw new BadRequestException("Missing authentication token");
        }
        ComplaintResponse response = staffService.updateStatus(id, request.getStatus(), request.getRemarks(), principal);
        return ResponseEntity.ok(response);
    }

    @Data
    public static class StatusUpdateRequest {
        @NotBlank(message = "Status is required")
        private String status;
        private String remarks;
    }
}
