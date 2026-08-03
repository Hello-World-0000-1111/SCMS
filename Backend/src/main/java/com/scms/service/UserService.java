package com.scms.service;

import com.scms.dto.UserResponse;
import com.scms.exception.BadRequestException;
import com.scms.exception.ResourceNotFoundException;
import com.scms.model.User;
import com.scms.model.enums.Role;
import com.scms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> getUsersInOrganization(String orgId) {
        return userRepository.findByOrganizationId(orgId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getStaffMembers(String orgId) {
        return userRepository.findByOrganizationIdAndRole(orgId, Role.STAFF)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateUserRole(String userId, String roleStr, User adminUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (adminUser.getRole() != Role.SUPER_ADMIN) {
            if (user.getOrganization() == null || adminUser.getOrganization() == null ||
                !user.getOrganization().getId().equals(adminUser.getOrganization().getId())) {
                throw new BadRequestException("Access Denied");
            }
        }

        if (user.getId().equals(adminUser.getId())) {
            throw new BadRequestException("You cannot change your own admin role");
        }

        Role role;
        try {
            role = Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role name");
        }

        user.setRole(role);
        user = userRepository.save(user);

        return mapToResponse(user);
    }

    public UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .employeeId(user.getEmployeeId())
                .role(user.getRole().name())
                .organizationId(user.getOrganization() != null ? user.getOrganization().getId() : null)
                .organizationName(user.getOrganization() != null ? user.getOrganization().getName() : null)
                .build();
    }
}
