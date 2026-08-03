package com.scms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "organizations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {

    @Id
    private String id;

    private String name;

    private String orgCode;

    private String address;

    private String contactEmail;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
