package com.myco.users.services;

import com.myco.users.domain.CallRequest;
import com.myco.users.domain.CallResponse;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Call;
import com.twilio.twiml.VoiceResponse;
import com.twilio.twiml.voice.Say;
import com.twilio.type.PhoneNumber;
import com.twilio.type.Twiml;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class CallServiceImpl implements CallService{

    public static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    public static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");
    public String toPhoneNumber = "+918264481868";
    public String fromPhoneNumber = "+17177947344";


    @Override
    public CallResponse call(CallRequest callRequest) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        String message = "Hello, Samriddhi Samriddhi Samriddhi this is a test call from Java using Twilio!";
        String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);

        // Use Twimlet to say your message
        String twimlUrl = "https://twimlets.com/message?Message%5B0%5D=" + encodedMessage;

        Call call = Call.creator(
                new PhoneNumber("+918264481868"), // To number
                new PhoneNumber("+17177947344"), // From your Twilio number
                URI.create(twimlUrl)
        ).create();

        System.out.println("Call SID: " + call.getSid());
        return new CallResponse();
    }

    public static void main(String args[]){
        CallService callService = new CallServiceImpl();
        callService.call(null);
    }
}
