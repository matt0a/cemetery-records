package com.mtc.cemetery.cemetery_records.weblayer.controllers;

import com.mtc.cemetery.cemetery_records.services.AuthService;
import com.mtc.cemetery.cemetery_records.weblayer.DTOs.LoginRequest;
import com.mtc.cemetery.cemetery_records.weblayer.DTOs.LoginResponse;
import com.mtc.cemetery.cemetery_records.weblayer.DTOs.RegisterRequest;
import com.mtc.cemetery.cemetery_records.weblayer.DTOs.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        UserResponse registeredUser = authService.register(request);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.login(request);
        return ResponseEntity.ok(loginResponse);
    }
}
