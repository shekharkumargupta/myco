package com.myco.users.controllers;

import com.myco.users.domain.CallRequest;
import com.myco.users.domain.CallResponse;
import com.myco.users.services.CallService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("v1/call")
public class CallController {

    private final CallService callService;

    public CallController(CallService callService) {
        this.callService = callService;
    }

    @PostMapping
    public ResponseEntity<String> makeCall(@RequestBody CallRequest callRequest){
        CallResponse callResponse = callService.call(callRequest);
        return ResponseEntity.ok(callResponse.getRequestId().toString());
    }
}
