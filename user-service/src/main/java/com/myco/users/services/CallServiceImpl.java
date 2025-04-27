package com.myco.users.services;

import com.myco.users.domain.CallRequest;
import com.myco.users.domain.CallResponse;
import com.myco.users.domain.Contact;
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
    private String fromPhoneNumber = "+17177947344";

    private final ContactService contactService;

    public CallServiceImpl(ContactService contactService) {
        this.contactService = contactService;
    }


    @Override
    public List<CallResponse> call(CallRequest callRequest) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        List<Contact> contacts = contactService.findAllByUserId(callRequest.getToUserId());
        List<CallResponse> callResponses = new ArrayList<>();

        for (Contact contact : contacts) {
            String message = createCallMessage();
            String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
            String twimlUrl = TWILIO_CALL_URL + encodedMessage;
            Call call = Call.creator(
                    new PhoneNumber(contact.getContactNumber()), // To number
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

    private String createCallMessage(){
        String twiml = "<Response>" +
                "<Say language=\"hi-IN\" voice=\"Google.hi-IN-Standard-A\">" +
                "नमस्ते! Samriddhi यह एक परीक्षण कॉल है।" +
                "</Say>" +
                "</Response>";
        return twiml;
    }

}
