package com.scms.config;

import com.scms.model.Category;
import com.scms.model.Organization;
import com.scms.model.User;
import com.scms.model.enums.Role;
import com.scms.repository.CategoryRepository;
import com.scms.repository.OrganizationRepository;
import com.scms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final OrganizationRepository organizationRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        Organization org = organizationRepository.save(Organization.builder()
                .name("SCMS Demo Organization")
                .orgCode("SCMS001")
                .address("123 Demo Street")
                .contactEmail("contact@scms.demo")
                .build());

        List<String> categoryNames = List.of("TECHNICAL", "BILLING", "HR", "FACILITIES");
        for (String name : categoryNames) {
            categoryRepository.save(Category.builder()
                    .name(name)
                    .description(name + " related complaints")
                    .organization(org)
                    .build());
        }

        userRepository.save(User.builder()
                .name("Admin User")
                .email("admin@scms.com")
                .password(passwordEncoder.encode("password123"))
                .employeeId("EMP001")
                .role(Role.ADMIN)
                .organization(org)
                .build());
        
         userRepository.save(User.builder()
                .name("Admin User")
                .email("admin1@scms.com")
                .password(passwordEncoder.encode("password123"))
                .employeeId("EMP002")
                .role(Role.ADMIN)
                .organization(org)
                .build());

        userRepository.save(User.builder()
                .name("Staff User")
                .email("staff@scms.com")
                .password(passwordEncoder.encode("password123"))
                .employeeId("EMP002")
                .role(Role.STAFF)
                .organization(org)
                .build());

        userRepository.save(User.builder()
                .name("Demo User")
                .email("user@scms.com")
                .password(passwordEncoder.encode("password123"))
                .employeeId("EMP003")
                .role(Role.USER)
                .organization(org)
                .build());
        // Dummy users
        for (int i = 1; i <= 20; i++) {
            userRepository.save(User.builder()
                    .name("Dummy User " + i)
                    .email("dummy" + i + "@scms.com")
                    .password(passwordEncoder.encode("password123"))
                    .employeeId("EMP" + String.format("%03d", 100 + i))
                    .role(Role.USER)
                    .organization(org)
                    .build());
        }
    }
}
