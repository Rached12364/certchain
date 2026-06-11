package com.certchain.certchain_backend.config;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
@Service
public class JwtService {
    private static final String SECRET = "certchain-super-secret-key-2026-must-be-long-enough";
    private static final long EXPIRATION = 86400000L;
    private Key key() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }
    public String generateToken(String username) {
        return Jwts.builder()
            .subject(username)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
            .signWith(key())
            .compact();
    }
    public String extractUsername(String token) {
        return Jwts.parser().verifyWith((javax.crypto.SecretKey) key()).build()
            .parseSignedClaims(token).getPayload().getSubject();
    }
    public boolean isValid(String token) {
        try { extractUsername(token); return true; }
        catch (Exception e) { return false; }
    }
}