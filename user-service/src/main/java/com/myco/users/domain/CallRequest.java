package com.myco.users.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class CallRequest {

    private UUID id;
    private String from;
    private String to;
    private String message;
    private String latitude;
    private String longitude;
    private LocalDateTime createdAt;
}
