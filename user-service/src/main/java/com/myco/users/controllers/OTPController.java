package com.myco.users.controllers;

import com.myco.users.domain.OTP;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("v1/otp")
public class OTPController {


    @PostMapping
    public ResponseEntity<String> verify(@RequestBody OTP otp){
		if("1111".equalsIgnoreCase(otp.getOtp())){
			return ResponseEntity.ok().build();
		}else{
			return  ResponseEntity.notFound().build();
		}
    }
	
	@PostMapping("/send")
    public ResponseEntity<String> send(@RequestBody OTP otp){
		return ResponseEntity.ok("1111");
    }
}
