package com.myco.users.services;

import com.myco.users.domain.Contact;
import com.myco.users.exceptions.ApplicationException;
import com.myco.users.repositories.ContactRepository;

import java.util.List;

public class ContactServiceImpl implements ContactService{

    private final ContactRepository contactRepository;

    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
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
}
