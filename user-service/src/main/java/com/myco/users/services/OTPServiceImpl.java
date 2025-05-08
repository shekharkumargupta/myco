package com.myco.users.services;

import com.myco.users.entities.AppUser;
import com.myco.users.entities.OTP;
import com.myco.users.exceptions.InvalidOTPException;
import com.myco.users.repositories.AppUserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OTPServiceImpl implements OTPService{


    private final AppUserRepository appUserRepository;

    public OTPServiceImpl(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    public String generate(String mobileNumber) {
        AppUser appUser = appUserRepository.findByMobileNumber(mobileNumber);
        if(Optional.ofNullable(appUser).isEmpty()){
            appUser = new AppUser();
            appUser.setMobileNumber(mobileNumber);
            AppUser save = appUserRepository.save(appUser);
        }
        return "1111"; //write a logic to generate OTP and Save into DB
    }

    @Override
    public AppUser verify(OTP otp) {
        String otpInDB = "1111"; //Fetch it from DB which was store when generated.
        if(otpInDB.equalsIgnoreCase(otp.getOtp())){
            AppUser appUser = appUserRepository.findByMobileNumber(otp.getMobileNumber());
            appUser.setVerified(true);
            appUserRepository.save(appUser);
            return appUser;
        }else {
            throw new InvalidOTPException("Invalid OTP provided");
        }
    }
}
