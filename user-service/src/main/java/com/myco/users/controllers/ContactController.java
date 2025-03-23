package com.myco.users.controllers;

import com.myco.users.domain.Contact;
import com.myco.users.services.AppUserService;
import com.myco.users.services.ContactService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("v1/contacts")
public class ContactController {

    private final ContactService contactService;
    private final AppUserService appUserService;

    public ContactController(ContactService contactService, AppUserService appUserService) {
        this.contactService = contactService;
        this.appUserService = appUserService;
    }

    @GetMapping
    public String ping(){
        return HttpStatus.OK.name();
    }

    //We must take the mobile number from authentication token not from API URL
    @GetMapping("/{mobileNumber}")
    public List<Contact> getContacts(@PathVariable String mobileNumber){
        return contactService.findAllByAppUser(mobileNumber);
    }

    @GetMapping("/contactId/{contactId}")
    public Contact getContact(@PathVariable Long contactId){
        return contactService.find(contactId);
    }

    @PostMapping
    public Contact create(@RequestBody Contact contact){
        return contactService.save(contact);
    }
}
