package com.mtc.cemetery.cemetery_records.weblayer.controllers;

import com.mtc.cemetery.cemetery_records.domain.entities.DeceasedPerson;
import com.mtc.cemetery.cemetery_records.repositories.DeceasedPersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/deceased-persons")
public class DeceasedPersonController {

    private final DeceasedPersonRepository deceasedPersonRepository;

    @GetMapping
    public ResponseEntity<List<DeceasedPerson>> list(
            @RequestParam(value = "q", required = false) String q) {
        if (q == null || q.isBlank()) {
            return ResponseEntity.ok(deceasedPersonRepository.findAll());
        }
        return ResponseEntity.ok(
                deceasedPersonRepository.findByLastNameContainingIgnoreCaseOrFirstNameContainingIgnoreCase(q, q)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeceasedPerson> getOne(@PathVariable Long id) {
        return deceasedPersonRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
