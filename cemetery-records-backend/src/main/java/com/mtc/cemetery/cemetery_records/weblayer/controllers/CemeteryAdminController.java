package com.mtc.cemetery.cemetery_records.weblayer.controllers;


import com.mtc.cemetery.cemetery_records.services.CemeteryAdminService;
import com.mtc.cemetery.cemetery_records.weblayer.DTOs.BurialBundleResponse;
import com.mtc.cemetery.cemetery_records.weblayer.DTOs.CreateBurialBundleRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class CemeteryAdminController {

    private final CemeteryAdminService service;

    @PostMapping("/burials")
    public ResponseEntity<BurialBundleResponse> createBurial(@Valid @RequestBody CreateBurialBundleRequest request) {
        return ResponseEntity.ok(service.createBurialBundle(request));
    }
}
