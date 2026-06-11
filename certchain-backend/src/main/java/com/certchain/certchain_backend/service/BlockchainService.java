package com.certchain.certchain_backend.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;
@Service
public class BlockchainService {
    @Value("${blockchain.node.script:C:/Users/rache/certchain/certchain-blockchain/scripts/issue.js}")
    private String scriptPath;
    public String registerCertificate(String certHash) {
        try {
            ProcessBuilder pb = new ProcessBuilder("node", scriptPath, certHash);
            pb.directory(new java.io.File("C:/Users/rache/certchain/certchain-blockchain"));
            pb.redirectErrorStream(true);
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            String txHash = null;
            while ((line = reader.readLine()) != null) {
                System.out.println("[Node] " + line);
                if (line.startsWith("TX_HASH:")) {
                    txHash = line.substring(8);
                }
            }
            process.waitFor();
            return txHash;
        } catch (Exception e) {
            System.out.println("EXCEPTION blockchain: " + e.getMessage());
            return null;
        }
    }
}