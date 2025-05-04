package com.myco.users.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String postedBy;
    private String postedFor;

    @CreationTimestamp
    private LocalDateTime createdAt;
    private String longitude;
    private String latitude;
//
//    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<UploadedFile> uploadedFiles = new ArrayList<>();
}
