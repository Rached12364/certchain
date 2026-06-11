package com.certchain.certchain_backend.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;
@Data
@Entity
@Table(name = "certificates")
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private String studentName;
    @Column(nullable = false)
    private String studentEmail;
    @Column(nullable = false)
    private String degree;
    @Column(nullable = false)
    private String institution;
    @Column(nullable = false)
    private String mention;
    private LocalDateTime issueDate;
    @Column(unique = true)
    private String certHash;
    private String txHash;
    @Enumerated(EnumType.STRING)
    private CertificateStatus status = CertificateStatus.VALID;
    public enum CertificateStatus { VALID, REVOKED }
}