package com.myco.users.controllers;

import com.myco.users.domain.AppUser;
import com.myco.users.services.AppUserService;
import com.myco.users.services.QRCodeGeneratorServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/qr")
public class QRController {

    private final QRCodeGeneratorServiceImpl qrCodeServiceImpl;
    private final AppUserService appUserService;

    public QRController(QRCodeGeneratorServiceImpl qrCodeServiceImpl, AppUserService appUserService) {
        this.qrCodeServiceImpl = qrCodeServiceImpl;
        this.appUserService = appUserService;
    }

    @GetMapping
    public String ping(){
        return HttpStatus.OK.name();
    }

    @PostMapping(produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] createQRCode(@RequestBody String mobileNumber){
        AppUser appUser = appUserService.findByMobileNumber(mobileNumber);
        byte[] image = new byte[0];
        try {
            image = qrCodeServiceImpl.create(appUser.getId().toString(),250,250);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return image;
    }
}
