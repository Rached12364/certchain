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
    private String validatePassword(String password) {
        if (password == null || password.length() < 8)
            return "Le mot de passe doit contenir au moins 8 caracteres";
        if (!password.matches(".*[A-Z].*"))
            return "Le mot de passe doit contenir au moins une lettre majuscule";
        if (!password.matches(".*[a-z].*"))
            return "Le mot de passe doit contenir au moins une lettre minuscule";
        if (!password.matches(".*[0-9].*"))
            return "Le mot de passe doit contenir au moins un chiffre";
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};:,.<>?].*"))
            return "Le mot de passe doit contenir au moins un symbole (!@#$%...)";
        return null;
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        if (username == null || username.length() < 3)
            return ResponseEntity.badRequest().body(Map.of("error", "Nom d utilisateur trop court (min 3 caracteres)"));
        String pwdError = validatePassword(password);
        if (pwdError != null)
            return ResponseEntity.badRequest().body(Map.of("error", pwdError));
        if (userRepository.findByUsername(username).isPresent())
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur deja existant"));
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
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