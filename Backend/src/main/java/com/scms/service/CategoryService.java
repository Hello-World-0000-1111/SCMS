package com.scms.service;

import com.scms.dto.CategoryResponse;
import com.scms.exception.BadRequestException;
import com.scms.exception.ResourceNotFoundException;
import com.scms.model.Category;
import com.scms.model.Organization;
import com.scms.repository.CategoryRepository;
import com.scms.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final OrganizationRepository organizationRepository;

    public List<CategoryResponse> getCategoriesByOrganization(String organizationId) {
        return categoryRepository.findByOrganizationId(organizationId).stream()
                .map(cat -> CategoryResponse.builder()
                        .id(cat.getId())
                        .name(cat.getName())
                        .description(cat.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponse createCategory(String name, String description, String organizationId) {
        if (categoryRepository.existsByNameAndOrganizationId(name, organizationId)) {
            throw new BadRequestException("Category already exists in this organization");
        }

        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        Category category = Category.builder()
                .name(name)
                .description(description)
                .organization(organization)
                .build();

        category = categoryRepository.save(category);

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}
