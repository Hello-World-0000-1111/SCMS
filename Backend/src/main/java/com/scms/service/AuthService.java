package com.scms.service;

import com.scms.config.JwtService;
import com.scms.dto.AuthResponse;
import com.scms.dto.LoginRequest;
import com.scms.dto.RegisterRequest;
import com.scms.exception.BadRequestException;
import com.scms.model.Organization;
import com.scms.model.User;
import com.scms.model.enums.Role;
import com.scms.repository.OrganizationRepository;
import com.scms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ComplaintMapper complaintMapper;

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new BadRequestException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        String token = jwtService.generateToken(user);
        return complaintMapper.toAuthResponse(user, token);
    }

    @Transactional
    public Map<String, String> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        Organization organization = organizationRepository.findByOrgCode(request.getOrgCode())
                .orElseThrow(() -> new BadRequestException("Invalid organization code"));

        if (userRepository.existsByOrganizationIdAndEmployeeId(organization.getId(), request.getEmployeeId())) {
            throw new BadRequestException("Employee ID already exists in this organization");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .employeeId(request.getEmployeeId())
                .role(Role.USER)
                .organization(organization)
                .build();

        userRepository.save(user);
        return Map.of("message", "Registration successful");
    }
}
