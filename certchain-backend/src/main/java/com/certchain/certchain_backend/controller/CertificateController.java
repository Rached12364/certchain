package com.certchain.certchain_backend.controller;
import com.certchain.certchain_backend.entity.Certificate;
import com.certchain.certchain_backend.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CertificateController {
    private final CertificateService service;
    @PostMapping("/issue")
    public ResponseEntity<?> issue(@RequestBody Certificate cert) {
        try {
            Certificate saved = service.issueCertificate(cert);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    @GetMapping("/verify/{certHash}")
    public ResponseEntity<?> verify(@PathVariable String certHash) {
        return service.verify(certHash)
            .map(cert -> {
                Map<String, Object> response = new HashMap<>();
                response.put("exists", true);
                response.put("valid", cert.getStatus() == Certificate.CertificateStatus.VALID);
                response.put("studentName", cert.getStudentName());
                response.put("degree", cert.getDegree());
                response.put("institution", cert.getInstitution());
                response.put("issueDate", cert.getIssueDate().toString());
                response.put("txHash", cert.getTxHash() != null ? cert.getTxHash() : "");
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.ok(Map.of("exists", false, "valid", false)));
    }
    @GetMapping
    public ResponseEntity<List<Certificate>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}