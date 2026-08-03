package com.scms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "complaint_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintHistory {

    @Id
    private String id;

    @DBRef
    private Complaint complaint;

    private String oldStatus;

    private String newStatus;

    private String remarks;

    @DBRef
    private User changedBy;

    @Builder.Default
    private LocalDateTime changedAt = LocalDateTime.now();
}
