package com.myco.users.repositories;

import com.myco.users.entities.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UploadedFileRepository extends JpaRepository<UploadedFile, Long> {
    // Custom queries can go here if needed
}
