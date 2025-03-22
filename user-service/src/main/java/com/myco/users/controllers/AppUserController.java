package com.myco.users.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("v1/users")
public class AppUserController {

    @GetMapping
    public String ping(){
        return HttpStatus.OK.name();
    }
}
