package com.scms.controller;

import com.scms.dto.ComplaintRequest;
import com.scms.dto.ComplaintResponse;
import com.scms.model.ComplaintHistory;
import com.scms.model.User;
import com.scms.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponse> submitComplaint(
            @Valid @RequestBody ComplaintRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(complaintService.submitComplaint(request, currentUser));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(complaintService.getMyComplaints(currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getComplaintDetail(
            @PathVariable String id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(complaintService.getComplaintDetail(id, currentUser));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<ComplaintHistory>> getComplaintHistory(
            @PathVariable String id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(complaintService.getComplaintHistory(id, currentUser));
    }
}
