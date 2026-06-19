package com.certchain.certchain_backend.controller;
import com.certchain.certchain_backend.entity.Certificate;
import com.certchain.certchain_backend.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
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
    }    @GetMapping("/insight")
    public ResponseEntity<?> getInsight() {
        List<Certificate> all = service.getAll();
        if (all.isEmpty()) {
            return ResponseEntity.ok(Map.of("text", "Aucun certificat n a encore ete emis."));
        }
        int total = all.size();
        long onChain = all.stream().filter(c -> c.getTxHash() != null && !c.getTxHash().isEmpty()).count();
        int onChainPct = (int) Math.round((onChain * 100.0) / total);
        Map<String, Long> mentionCounts = all.stream()
            .collect(Collectors.groupingBy(Certificate::getMention, Collectors.counting()));
        String topMention = mentionCounts.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey).orElse("N/A");
        long topMentionCount = mentionCounts.getOrDefault(topMention, 0L);
        int topMentionPct = (int) Math.round((topMentionCount * 100.0) / total);
        long institutionsCount = all.stream().map(Certificate::getInstitution).distinct().count();
        LocalDateTime last7 = LocalDateTime.now().minusDays(7);
        long recentCount = all.stream()
            .filter(c -> c.getIssueDate() != null && c.getIssueDate().isAfter(last7))
            .count();
        StringBuilder sb = new StringBuilder();
        sb.append(total).append(" certificats ont ete emis au total, dont ").append(onChain)
          .append(" (").append(onChainPct).append("%) enregistres sur la blockchain. ");
        sb.append("La mention \"").append(topMention).append("\" est la plus frequente, representant ")
          .append(topMentionPct).append("% des diplomes. ");
        sb.append(institutionsCount).append(institutionsCount > 1 ? " institutions differentes utilisent" : " institution utilise")
          .append(" la plateforme. ");
        if (recentCount > 0) {
            sb.append(recentCount).append(" certificat").append(recentCount > 1 ? "s" : "")
              .append(" emis au cours des 7 derniers jours.");
        } else {
            sb.append("Aucune emission au cours des 7 derniers jours.");
        }
        return ResponseEntity.ok(Map.of("text", sb.toString()));
    }
    @GetMapping
    public ResponseEntity<List<Certificate>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}