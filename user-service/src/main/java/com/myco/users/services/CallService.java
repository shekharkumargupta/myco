package com.myco.users.services;

import com.myco.users.domain.CallRequest;
import com.myco.users.domain.CallResponse;

import java.util.List;

public interface CallService {

    public List<CallResponse> call(CallRequest callRequest);
}
