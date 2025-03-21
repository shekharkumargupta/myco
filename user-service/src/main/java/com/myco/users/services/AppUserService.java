package com.myco.users.services;

import com.myco.users.domain.AppUser;
import com.myco.users.exceptions.ApplicationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AppUserService {


    public AppUser save(AppUser appUser) throws ApplicationException;
    public AppUser remove(long id) throws ApplicationException;

    public AppUser find(Long id);
    public List<AppUser> findAll();
}
