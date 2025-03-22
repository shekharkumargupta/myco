package com.myco.users.services;

import com.myco.users.domain.Contact;
import com.myco.users.exceptions.ApplicationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ContactService {

    public Contact save(Contact contact) throws ApplicationException;
    public Contact remove(long id) throws ApplicationException;

    public Contact find(Long id);
    public List<Contact> findAll();
}
