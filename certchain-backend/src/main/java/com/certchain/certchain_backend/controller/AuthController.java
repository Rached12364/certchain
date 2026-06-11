package com.certchain.certchain_backend.controller;
import com.certchain.certchain_backend.config.JwtService;
import com.certchain.certchain_backend.entity.User;
import com.certchain.certchain_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        if (userRepository.findByUsername(body.get("username")).isPresent())
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur deja existant"));
        User user = new User();
        user.setUsername(body.get("username"));
        user.setPassword(passwordEncoder.encode(body.get("password")));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Compte cree avec succes"));
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        return userRepository.findByUsername(body.get("username"))
            .filter(u -> passwordEncoder.matches(body.get("password"), u.getPassword()))
            .map(u -> ResponseEntity.ok(Map.of(
                "token", jwtService.generateToken(u.getUsername()),
                "username", u.getUsername()
            )))
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Identifiants incorrects")));
    }
}