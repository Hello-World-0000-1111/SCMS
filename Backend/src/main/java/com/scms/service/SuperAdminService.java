package com.scms.service;

import com.scms.dto.OrgRegisterRequest;
import com.scms.dto.SuperAdminEnrollRequest;
import com.scms.dto.UserResponse;
import com.scms.exception.BadRequestException;
import com.scms.exception.ResourceNotFoundException;
import com.scms.model.Organization;
import com.scms.model.User;
import com.scms.model.enums.Role;
import com.scms.repository.OrganizationRepository;
import com.scms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuperAdminService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final OrganizationService organizationService;

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    @Transactional
    public Organization registerOrganization(OrgRegisterRequest request) {
        organizationService.registerOrganization(request);
        return organizationRepository.findByOrgCode(request.getOrgName()).orElse(null); // Or find by name
    }

    @Transactional
    public UserResponse enrollUser(SuperAdminEnrollRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        Organization organization = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        if (userRepository.existsByOrganizationIdAndEmployeeId(organization.getId(), request.getEmployeeId())) {
            throw new BadRequestException("Employee ID already exists in this organization");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid role: " + request.getRole());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .employeeId(request.getEmployeeId())
                .role(role)
                .organization(organization)
                .build();

        userRepository.save(user);
        return userService.mapToResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userService::mapToResponse)
                .collect(Collectors.toList());
    }
}
