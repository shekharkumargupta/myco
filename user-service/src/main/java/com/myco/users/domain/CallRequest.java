package com.myco.users.domain;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CallRequest {

    private UUID id;
    private String fromUserId;
    private String toUserId;
    private String message;
    private String latitude;
    private String longitude;
    private LocalDateTime createdAt;
}
