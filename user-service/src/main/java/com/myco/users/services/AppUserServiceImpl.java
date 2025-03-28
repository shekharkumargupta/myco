package com.myco.users.services;

import com.myco.users.domain.AppUser;
import com.myco.users.exceptions.ApplicationException;
import com.myco.users.repositories.AppUserRepository;
import com.myco.users.repositories.QRCodeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AppUserServiceImpl implements AppUserService{

    @Value("${qr.searchUrl}")
    private String searchUrl;

    private final AppUserRepository appUserRepository;
    private final QRCodeRepository qrCodeRepository;
    private final QRCodeGeneratorService qrCodeGeneratorService;

    public AppUserServiceImpl(AppUserRepository appUserRepository, QRCodeRepository qrCodeRepository, QRCodeGeneratorService qrCodeGeneratorService) {
        this.appUserRepository = appUserRepository;
        this.qrCodeRepository = qrCodeRepository;
        this.qrCodeGeneratorService = qrCodeGeneratorService;
    }

    @Override
    public AppUser save(AppUser appUser) throws ApplicationException {
        AppUser savedAppUser = appUserRepository.save(appUser);

        //No need to save QR Code for now
        //Always generate QR Code from User UUID.

//        byte[] qrCodeImage = qrCodeGeneratorService
//                .create(appUser.getId().toString(), 250, 250);

//        QRCode qrCode = new QRCode();
//        qrCode.setQrcode(qrCodeImage);
//        qrCode.setUser(savedAppUser);
//        qrCodeRepository.save(qrCode);
        return savedAppUser;
    }

    @Override
    public AppUser remove(long id) throws ApplicationException {
        throw new UnsupportedOperationException("Not yet implemented!");
    }

    @Override
    public AppUser find(String uuid) {
        UUID uuid2 = UUID.fromString(uuid);
        return appUserRepository.findById(uuid2).orElseThrow();
    }

    @Override
    public AppUser find(UUID uuid) {
        return appUserRepository.findById(uuid).orElseThrow();
    }

    @Override
    public AppUser findByMobileNumber(String mobileNumber) {
        return appUserRepository.findByMobileNumber(mobileNumber);
    }

    @Override
    public List<AppUser> findAll() {
        return appUserRepository.findAll();
    }

    @Override
    public String createUserUrl(String mobileNumber) {
        String userId = findByMobileNumber(mobileNumber).getId().toString();
        String qrUrl = searchUrl + "/" + userId;
        return qrUrl;
    }
}
