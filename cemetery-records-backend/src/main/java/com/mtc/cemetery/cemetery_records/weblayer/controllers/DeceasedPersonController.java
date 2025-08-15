package com.mtc.cemetery.cemetery_records.weblayer.controllers;

import com.mtc.cemetery.cemetery_records.domain.entities.BurialRecord;
import com.mtc.cemetery.cemetery_records.domain.entities.DeceasedPerson;
import com.mtc.cemetery.cemetery_records.repositories.BurialRecordRepository;
import com.mtc.cemetery.cemetery_records.repositories.DeceasedPersonRepository;
import com.mtc.cemetery.cemetery_records.weblayer.DTOs.DeceasedDetailDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/deceased-persons")
public class DeceasedPersonController {

    private final DeceasedPersonRepository deceasedPersonRepository;
    private final BurialRecordRepository burialRecordRepository;

    /**
     * ✅ STRICT SEARCH:
     * Requires firstName, lastName and dateOfBirth (YYYY-MM-DD).
     * Returns exact matches only.
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchByNameAndDob(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String dateOfBirth
    ) {
        if (firstName.isBlank() || lastName.isBlank() || dateOfBirth.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "firstName, lastName and dateOfBirth are required (YYYY-MM-DD)"
            ));
        }

        final LocalDate dob;
        try {
            dob = LocalDate.parse(dateOfBirth); // ISO-8601: 1990-05-12
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "dateOfBirth must be in ISO format (YYYY-MM-DD)"
            ));
        }

        var results = deceasedPersonRepository
                .findByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfBirth(firstName.trim(), lastName.trim(), dob);

        // You can map to a lightweight DTO if you prefer (id, full name), but returning entities is OK here.
        return ResponseEntity.ok(results);
    }

    /**
     * ✅ DETAIL:
     * Returns person + burialDate + grave plot info.
     */
    @GetMapping("/{id}/detail")
    public ResponseEntity<DeceasedDetailDTO> getDetail(@PathVariable Long id) {
        return deceasedPersonRepository.findById(id)
                .map(person -> {
                    Optional<BurialRecord> opt = burialRecordRepository.findByDeceasedPerson_Id(person.getId());

                    DeceasedDetailDTO.DeceasedDetailDTOBuilder builder = DeceasedDetailDTO.builder()
                            .id(person.getId())
                            .firstName(person.getFirstName())
                            .lastName(person.getLastName())
                            .dateOfBirth(person.getDateOfBirth())
                            .dateOfDeath(person.getDateOfDeath())
                            .gender(person.getGender());

                    opt.ifPresent(b -> {
                        builder.burialDate(b.getBurialDate());
                        var gp = b.getGravePlot();
                        if (gp != null) {
                            builder.gravePlot(DeceasedDetailDTO.GravePlotDTO.builder()
                                    .id(gp.getId())
                                    .section(gp.getSection())
                                    .plotNumber(gp.getPlotNumber())
                                    .locationDescription(gp.getLocationDescription())
                                    .build());
                        }
                    });

                    return ResponseEntity.ok(builder.build());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 🚫 OPTIONAL (strong privacy): Deprecate the broad "q" search.
     * If you still have the old endpoint that returned all or name-contains results,
     * replace it with a 400 directing clients to /search.
     */
    @GetMapping
    public ResponseEntity<?> deprecatedListOrSearch() {
        return ResponseEntity.badRequest().body(Map.of(
                "error", "This endpoint is deprecated. Use /api/public/deceased-persons/search?firstName=&lastName=&dateOfBirth=YYYY-MM-DD"
        ));
    }

    /**
     * You may keep /{id} returning entity if needed by other parts,
     * but the UI should use /{id}/detail for the rich view.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DeceasedPerson> getOne(@PathVariable Long id) {
        return deceasedPersonRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
