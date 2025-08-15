package com.mtc.cemetery.cemetery_records.weblayer.controllers;

import com.mtc.cemetery.cemetery_records.domain.entities.BurialRecord;
import com.mtc.cemetery.cemetery_records.repositories.BurialRecordRepository;
import com.mtc.cemetery.cemetery_records.weblayer.DTOs.PatchBurialRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class BurialRecordController {

    private final BurialRecordRepository burialRecordRepository;

    // ---- Public reads ----
    @GetMapping("/api/public/burial-records")
    public ResponseEntity<List<BurialRecord>> list() {
        return ResponseEntity.ok(burialRecordRepository.findAll());
    }

    @GetMapping("/api/public/burial-records/{id}")
    public ResponseEntity<BurialRecord> getOne(@PathVariable Long id) {
        return burialRecordRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ---- Admin edits (secured) ----
    @PatchMapping("/api/admin/burial-records/{id}")
    public ResponseEntity<BurialRecord> patchNotesAndDate(
            @PathVariable Long id,
            @RequestBody PatchBurialRequest req) {

        return burialRecordRepository.findById(id)
                .map(rec -> {
                    if (req.getNotes() != null) rec.setNotes(req.getNotes());
                    if (req.getBurialDate() != null) rec.setBurialDate(req.getBurialDate());
                    return ResponseEntity.ok(burialRecordRepository.save(rec));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // NOTE: No DELETE mapping here to avoid ambiguous route with AdminBurialController.
}
