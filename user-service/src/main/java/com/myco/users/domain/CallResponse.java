package com.myco.users.domain;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CallResponse {

    private String requestId;
    private int callDurationSeconds;
    private String info;
    private LocalDateTime createdAt;
}
