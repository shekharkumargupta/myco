package com.myco.users.repositories;

import com.myco.users.domain.AppUser;
import com.myco.users.domain.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findByAppUser(AppUser appUser);
}
