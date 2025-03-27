package com.myco.users.services;

import com.myco.users.domain.QRCode;
import com.myco.users.exceptions.ApplicationException;

public interface QRCodeService {

    public QRCode save(QRCode qrCode) throws ApplicationException;
    public QRCode remove(long id) throws ApplicationException;
    public QRCode find(Long id);
}
