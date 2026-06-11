package com.certchain.certchain_backend.service;
import com.certchain.certchain_backend.entity.Certificate;
import com.certchain.certchain_backend.repository.CertificateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class CertificateService {
    private final CertificateRepository repository;
    private final BlockchainService blockchainService;
    public Certificate issueCertificate(Certificate cert) throws Exception {
        String raw = cert.getStudentName() + "|" + cert.getDegree() + "|"
                   + cert.getInstitution() + "|" + cert.getMention();
        String certHash = sha256(raw);
        cert.setCertHash(certHash);
        cert.setIssueDate(LocalDateTime.now());
        cert.setStatus(Certificate.CertificateStatus.VALID);
        try {
            String txHash = blockchainService.registerCertificate(certHash);
            if (txHash != null) cert.setTxHash(txHash);
        } catch (Exception e) {
            System.out.println("Blockchain ignoree: " + e.getMessage());
        }
        return repository.save(cert);
    }
    public Optional<Certificate> verify(String certHash) {
        return repository.findByCertHash(certHash);
    }
    public List<Certificate> getAll() {
        return repository.findAll();
    }
    private String sha256(String input) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
        StringBuilder hex = new StringBuilder();
        for (byte b : hash) {
            String h = Integer.toHexString(0xff & b);
            if (h.length() == 1) hex.append('0');
            hex.append(h);
        }
        return hex.toString();
    }
}