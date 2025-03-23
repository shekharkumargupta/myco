package com.myco.users.controllers;

import com.myco.users.services.QRCodeService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;

@RestController
@RequestMapping("v1/qr")
public class QRController {

    private static final String QR_CODE_IMAGE_PATH = "d:/QRCode.png";
    private final QRCodeService qrCodeService;

    public QRController(QRCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    @GetMapping("/{mobileNumber}")
    public String getQRCode(@PathVariable String mobileNumber){
        return mobileNumber;
    }

    @PostMapping(value = "/{mobileNumber}", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] createQRCode(@PathVariable String mobileNumber){
        byte[] image = new byte[0];
        try {
            image = qrCodeService.getQRCodeImage(mobileNumber,250,250);
            //qrCodeService.generateQRCodeImage(mobileNumber,250,250,QR_CODE_IMAGE_PATH);
        } catch (Exception e) {
            e.printStackTrace();
        }
        //String qrcode = Base64.getEncoder().encodeToString(image);
        //return qrcode;
        return image;
    }
}
