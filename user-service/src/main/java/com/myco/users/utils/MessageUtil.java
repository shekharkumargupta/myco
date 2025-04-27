package com.myco.users.utils;

import com.myco.users.domain.Message;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MessageUtil {

    private Map<String, List<Message>> worldLanguageMap;

    public MessageUtil() {
        worldLanguageMap = new HashMap<>();

        List<Message> messages = new ArrayList<>();
        messages.add(new Message("IN", "English", "en-IN", "नमस्ते! Samriddhi यह एक परीक्षण कॉल है।"));
        messages.add(new Message("IN", "Hindi","hi-IN", "नमस्ते! Samriddhi यह एक परीक्षण कॉल है।"));
        messages.add(new Message("IN", "Gujarati","gu-IN", "नमस्ते! Samriddhi यह एक परीक्षण कॉल है।"));
        messages.add(new Message("IN", "Kannada","kn-IN", "नमस्ते! Samriddhi यह एक परीक्षण कॉल है।"));
        messages.add(new Message("IN", "Malayalam","ml-IN", "नमस्ते! Samriddhi यह एक परीक्षण कॉल है।"));
        messages.add(new Message("IN", "Marathi","mr-IN", "नमस्ते! Samriddhi यह एक परीक्षण कॉल है।"));
        messages.add(new Message("IN", "Bengali","bn-IN", "नमस्ते! Samriddhi यह एक परीक्षण कॉल है।"));
        messages.add(new Message("IN", "Tamil","ta-IN", "नमस्ते! Samriddhi यह एक परीक्षण कॉल है।"));
        messages.add(new Message("IN", "Telugu","te-IN", "नमस्ते! Samriddhi यह एक परीक्षण कॉल है।"));
        messages.add(new Message("IN", "Punjabi","pa-IN", "नमस्ते! Samriddhi यह एक परीक्षण कॉल है।"));

        messages.add(new Message("FR", "Belgium","fr-BE", "नमस्ते! Samriddhi यह एक परीक्षण कॉल है।"));
        messages.add(new Message("FR", "Canadian","fr-CA", "नमस्ते! Samriddhi यह एक परीक्षण कॉल है।"));
        messages.add(new Message("FR", "French","fr-FR", "नमस्ते! Samriddhi यह एक परीक्षण कॉल है।"));

        worldLanguageMap = messages.stream()
                .collect(Collectors.groupingBy(Message::getCountryCode));
    }

    private Map<String, Message> getMessages(String countryCode){
        Map<String, Message> messageMap = worldLanguageMap.get(countryCode)
                .stream()
                .collect(Collectors.toMap(message -> message.getLanguage(), message -> message));
        return messageMap;
    }

    public Message getMessage(String countryCode, String language){
        Message message = getMessages(countryCode).get(language);
        return message;
    }

    public Set<String> getCountries(){
        return worldLanguageMap.keySet();
    }

    public Set<String> getLanguages(String countryCode){
        return getMessages(countryCode).keySet();
    }
}
