package com.myco.users.controllers;

import com.myco.users.domain.AppUser;
import com.myco.users.domain.OTP;
import com.myco.users.services.AppUserService;
import com.myco.users.services.OTPService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("v1/otp")
public class OTPController {

	private final OTPService otpService;
	private final AppUserService appUserService;

	public OTPController(OTPService otpService, AppUserService appUserService) {
		this.otpService = otpService;
		this.appUserService = appUserService;
	}

	@PostMapping("/send")
	public ResponseEntity<String> send(@RequestBody String mobileNumber){
		String generated = otpService.generate(mobileNumber);
		return ResponseEntity.ok(generated);
	}

	@PostMapping("/verify")
    public ResponseEntity<AppUser> verify(@RequestBody OTP otp){
		AppUser appUser = otpService.verify(otp);
		return ResponseEntity.ok().body(appUser);
    }

}
