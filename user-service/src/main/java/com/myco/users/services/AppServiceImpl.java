package com.myco.users.services;

import com.myco.users.domain.AppUser;
import com.myco.users.exceptions.ApplicationException;
import com.myco.users.repositories.AppUserRepository;

import java.util.List;

public class AppServiceImpl implements AppUserService{

    private final AppUserRepository appUserRepository;

    public AppServiceImpl(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    public AppUser save(AppUser appUser) throws ApplicationException {
        return appUserRepository.save(appUser);
    }

    @Override
    public AppUser remove(long id) throws ApplicationException {
        throw new UnsupportedOperationException("Not yet implemented!");
    }

    @Override
    public AppUser find(Long id) {
        return appUserRepository.findById(id).orElseThrow();
    }

    @Override
    public List<AppUser> findAll() {
        return appUserRepository.findAll();
    }
}
