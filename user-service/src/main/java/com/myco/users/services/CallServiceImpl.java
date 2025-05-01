package com.myco.users.services;

import com.myco.users.dtos.CallRequest;
import com.myco.users.dtos.CallResponse;
import com.myco.users.dtos.MessageParameter;
import com.myco.users.entities.*;
import com.myco.users.utils.MessageUtil;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Call;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class CallServiceImpl implements CallService{

    private static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    private static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");
    private static final String TWILIO_CALL_URL = "https://twimlets.com/message?Message%5B0%5D=";
    private String fromPhoneNumber = "";
    private String toPhoneNumber = "";

    private final ContactService contactService;
    private final AppUserService appUserService;
    private final MessageUtil messageUtil;
    public CallServiceImpl(ContactService contactService, AppUserService appUserService, MessageUtil messageUtil) {
        this.contactService = contactService;
        this.appUserService = appUserService;
        this.messageUtil = messageUtil;
    }


    @Override
    public List<CallResponse> call(CallRequest callRequest) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        List<CallResponse> callResponses = new ArrayList<>();
        List<Contact> contacts = contactService.findAllByUserId(callRequest.getToUserId());
        AppUser owner = appUserService.find(callRequest.getToUserId());
        AppUser caller = appUserService.find(callRequest.getFromUserId());

        for (Contact contact : contacts) {
            callRequest.setCaller(caller);
            callRequest.setOwner(owner);
            callRequest.setContact(contact);

            String message = createCallMessages(callRequest);
            System.out.println("Message: " + message);
            String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
            String twimlUrl = TWILIO_CALL_URL + encodedMessage;
            Call call = Call.creator(
                    new PhoneNumber(toPhoneNumber), // To number
                    new PhoneNumber(fromPhoneNumber), // From your Twilio number
                    URI.create(twimlUrl)
            ).create();

            CallResponse callResponse = createResponse(call, contact);
            callResponses.add(callResponse);
        }
        return callResponses;
    }

    private CallResponse createResponse(Call call, Contact contact){
        CallResponse callResponse = new CallResponse();
        callResponse.setRequestId(call.getSid());
        callResponse.setInfo(contact.getRelation());
        log.info("Call SID: " + call.getSid());
        return callResponse;
    }

    private String createCallMessages(CallRequest callRequest){
        MessageParameter messageParameter = new MessageParameter(
                "IN",
                "pa-IN",
                callRequest.getContact().getContactName(),
                callRequest.getOwner().getMobileNumber(),
                callRequest.getCaller().getMobileNumber()
        );
        String message = messageUtil.prepareMessage(messageParameter);
        return message;
    }
}
