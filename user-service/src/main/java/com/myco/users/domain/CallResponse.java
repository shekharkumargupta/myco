package com.myco.users.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class CallResponse {

    private UUID requestId;
    private int callDurationSeconds;
    private String response;
    private String latitude;
    private String longitude;
    private LocalDateTime createdAt;
}
