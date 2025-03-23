package com.myco.users.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
public class AppUser {

    @Id
    @GeneratedValue
    private long id;
    private String mobileNumber;
    @CreatedDate
    private long createdAt;
    @LastModifiedDate
    private long modifiedAt;
}
