package com.myco.users.controllers;

import com.myco.users.domain.AppUser;
import com.myco.users.domain.OTP;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("v1/otp")
public class OTPController {


    @PostMapping
    public String create(@RequestBody OTP otp){
        return HttpStatus.OK.name();
    }
}
