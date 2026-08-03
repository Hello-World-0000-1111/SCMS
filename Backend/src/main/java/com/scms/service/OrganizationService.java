package com.scms.service;

import com.scms.config.JwtService;
import com.scms.dto.AuthResponse;
import com.scms.dto.OrgRegisterRequest;
import com.scms.exception.BadRequestException;
import com.scms.model.Category;
import com.scms.model.Organization;
import com.scms.model.User;
import com.scms.model.enums.Role;
import com.scms.repository.CategoryRepository;
import com.scms.repository.OrganizationRepository;
import com.scms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom random = new SecureRandom();

    @Transactional
    public AuthResponse registerOrganization(OrgRegisterRequest request) {
        // Validation
        if (userRepository.existsByEmail(request.getAdminEmail())) {
            throw new BadRequestException("Email already registered");
        }

        // Generate unique Org Code
        String orgCode = generateUniqueOrgCode();

        // Save Organization
        Organization organization = Organization.builder()
                .name(request.getOrgName())
                .orgCode(orgCode)
                .address(request.getAddress())
                .contactEmail(request.getContactEmail())
                .build();
        organization = organizationRepository.save(organization);

        // Save Admin User
        User admin = User.builder()
                .name(request.getAdminName())
                .email(request.getAdminEmail())
                .password(passwordEncoder.encode(request.getAdminPassword()))
                .employeeId(request.getAdminEmployeeId())
                .role(Role.ADMIN)
                .organization(organization)
                .build();
        userRepository.save(admin);

        // Seed some default categories for this organization
        seedDefaultCategories(organization);

        // Generate JWT
        String token = jwtService.generateToken(admin);

        return AuthResponse.builder()
                .token(token)
                .email(admin.getEmail())
                .name(admin.getName())
                .role(admin.getRole().name())
                .organizationId(organization.getId())
                .organizationName(organization.getName())
                .orgCode(organization.getOrgCode())
                .build();
    }

    private String generateUniqueOrgCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder("ORG-");
            for (int i = 0; i < 6; i++) {
                sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
            }
            code = sb.toString();
        } while (organizationRepository.existsByOrgCode(code));
        return code;
    }

    private void seedDefaultCategories(Organization organization) {
        List<String> defaultNames = List.of("IT Support", "Academic Issues", "Facilities & Maintenance", "Hostel Affairs", "Billing & Finance", "General Complaint");
        List<String> defaultDescriptions = List.of(
                "Technical issues related to internet, accounts, software, hardware.",
                "Issues related to courses, lectures, exams, grading.",
                "Issues related to rooms, classrooms, equipment, cleaning.",
                "Issues related to hostel rooms, mess food, hostel staff.",
                "Issues related to fee, refunds, scholarship payments.",
                "General category for any complaint not fitting other sections."
        );
        for (int i = 0; i < defaultNames.size(); i++) {
            Category category = Category.builder()
                    .name(defaultNames.get(i))
                    .description(defaultDescriptions.get(i))
                    .organization(organization)
                    .build();
            categoryRepository.save(category);
        }
    }
}
