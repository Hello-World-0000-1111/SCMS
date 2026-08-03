package com.scms.model;

import com.scms.model.enums.Priority;
import com.scms.model.enums.Status;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    private String id;

    private String title;

    private String description;

    @Builder.Default
    private Status status = Status.PENDING;

    private Priority priority;

    @DBRef
    private User user;

    @DBRef
    private User assignedTo;

    @DBRef
    private Category category;

    @DBRef
    private Organization organization;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
