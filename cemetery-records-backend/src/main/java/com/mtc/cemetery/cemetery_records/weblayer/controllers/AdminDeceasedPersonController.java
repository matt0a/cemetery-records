package com.mtc.cemetery.cemetery_records.weblayer.controllers;

import com.mtc.cemetery.cemetery_records.domain.entities.DeceasedPerson;
import com.mtc.cemetery.cemetery_records.domain.enums.Gender;
import com.mtc.cemetery.cemetery_records.repositories.BurialRecordRepository;
import com.mtc.cemetery.cemetery_records.repositories.DeceasedPersonRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/deceased-persons")
public class AdminDeceasedPersonController {

    private final DeceasedPersonRepository personRepo;
    private final BurialRecordRepository burialRepo;

    // GET /api/admin/deceased-persons?q=jo
    @GetMapping
    public ResponseEntity<List<DeceasedPerson>> search(@RequestParam(defaultValue = "") String q) {
        if (q.isBlank()) return ResponseEntity.ok(personRepo.findAll());
        return ResponseEntity.ok(
                personRepo.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(q, q)
        );
    }


    @PatchMapping("/{id}")
    public ResponseEntity<DeceasedPerson> patch(@PathVariable Long id, @RequestBody UpdatePersonRequest req) {
        return personRepo.findById(id)
                .map(p -> {
                    if (req.firstName != null) p.setFirstName(req.firstName);
                    if (req.lastName != null) p.setLastName(req.lastName);
                    if (req.dateOfBirth != null) p.setDateOfBirth(req.dateOfBirth);
                    if (req.dateOfDeath != null) p.setDateOfDeath(req.dateOfDeath);
                    if (req.gender != null) p.setGender(req.gender);
                    return ResponseEntity.ok(personRepo.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!personRepo.existsById(id)) return ResponseEntity.notFound().build();

        long count = burialRepo.countByDeceasedPerson_Id(id);
        if (count > 0) {
            return ResponseEntity.status(409).body(
                    java.util.Map.of("error", "Cannot delete person: there are linked burial records.", "burialCount", count)
            );
        }
        personRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    @Data
    public static class UpdatePersonRequest {
        private String firstName;
        private String lastName;
        private LocalDate dateOfBirth;
        private LocalDate dateOfDeath;
        private Gender gender;
    }
}
