package com.certchain.certchain_backend.repository;
import com.certchain.certchain_backend.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {
    Optional<Certificate> findByCertHash(String certHash);
    boolean existsByCertHash(String certHash);
}