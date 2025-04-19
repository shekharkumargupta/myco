package com.myco.users.services;

import com.myco.users.domain.AppUser;
import com.myco.users.domain.OTP;

public interface OTPService {

    String generate(String mobileNumber);
    AppUser verify(OTP otp);
}
