package com.myco.users.services;

import com.myco.users.domain.CallRequest;
import com.myco.users.domain.CallResponse;

public interface CallService {

    public CallResponse call(CallRequest callRequest);
}
