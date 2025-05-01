package com.myco.users.services;

import com.myco.users.entities.AppUser;
import com.myco.users.entities.OTP;

public interface OTPService {

    String generate(String mobileNumber);
    AppUser verify(OTP otp);
}
