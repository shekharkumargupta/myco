package com.myco.users.services;

import com.myco.users.domain.AppUser;
import com.myco.users.domain.Contact;
import com.myco.users.exceptions.ApplicationException;
import com.myco.users.repositories.AppUserRepository;
import com.myco.users.repositories.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactServiceImpl implements ContactService{

    private final ContactRepository contactRepository;
    private final AppUserRepository appUserRepository;

    public ContactServiceImpl(ContactRepository contactRepository, AppUserRepository appUserRepository) {
        this.contactRepository = contactRepository;
        this.appUserRepository = appUserRepository;
    }

    @Override
    public Contact save(Contact contact) throws ApplicationException {
        return contactRepository.save(contact);
    }

    @Override
    public Contact remove(long id) throws ApplicationException {
        throw new UnsupportedOperationException("Not implemented Yet");
    }

    @Override
    public Contact find(Long id) {
        return contactRepository.findById(id).orElseThrow();
    }

    @Override
    public List<Contact> findAll() {
        return contactRepository.findAll();
    }

    @Override
    public List<Contact> findAllByAppUser(String mobileNumber){
        AppUser appuser = appUserRepository.findByMobileNumber(mobileNumber);
        List<Contact> contactList = contactRepository.findByAppUser(appuser);
        return contactList;
    }
}
