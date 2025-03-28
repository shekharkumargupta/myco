package com.myco.users.controllers;

import com.myco.users.domain.AppUser;
import com.myco.users.services.AppUserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("v1/users")
public class AppUserController {



    private final AppUserService appUserService;

    public AppUserController(AppUserService appUserService){
        this.appUserService = appUserService;
    }

    @GetMapping
    public String ping(){
        return HttpStatus.OK.name();
    }

    @GetMapping("/{mobileNumber}")
    public AppUser findByMobileNumber(String mobileNumber){
        AppUser appUser = appUserService.findByMobileNumber(mobileNumber);
        return appUser;
    }

    @PostMapping
    public AppUser create(@RequestBody String mobileNumber){
        AppUser appUser = new AppUser();
        appUser.setMobileNumber(mobileNumber);
        return appUserService.save(appUser);
    }
}
