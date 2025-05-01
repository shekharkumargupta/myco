package com.myco.users.dtos;

import lombok.Data;

@Data
public class PostRequest {
    private String title;
    private String postedBy;
    private String postedFor;
}
