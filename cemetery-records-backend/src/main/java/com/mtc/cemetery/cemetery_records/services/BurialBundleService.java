package com.mtc.cemetery.cemetery_records.services;

import com.mtc.cemetery.cemetery_records.domain.entities.BurialRecord;
import com.mtc.cemetery.cemetery_records.domain.entities.DeceasedPerson;
import com.mtc.cemetery.cemetery_records.domain.entities.GravePlot;
import com.mtc.cemetery.cemetery_records.repositories.BurialRecordRepository;
import com.mtc.cemetery.cemetery_records.repositories.DeceasedPersonRepository;
import com.mtc.cemetery.cemetery_records.repositories.GravePlotRepository;
import com.mtc.cemetery.cemetery_records.weblayer.DTOs.BurialBundleResponse;
import com.mtc.cemetery.cemetery_records.weblayer.DTOs.CreateBurialBundleRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BurialBundleService {

    private final DeceasedPersonRepository deceasedPersonRepository;
    private final GravePlotRepository gravePlotRepository;
    private final BurialRecordRepository burialRecordRepository;

    /**
     * Creates a deceased person + burial record, and links to a grave plot.
     * - If request has gravePlotId -> link to that existing plot.
     * - Else -> find-or-create plot by (section, plotNumber).
     * Multiple burials per plot are allowed.
     */
    @Transactional
    public BurialBundleResponse createBundle(CreateBurialBundleRequest req) {
        // Basic chronology checks (optional but recommended)
        LocalDate dob = req.getDateOfBirth();
        LocalDate dod = req.getDateOfDeath();
        LocalDate burialDate = req.getBurialDate();
        if (dob != null && dod != null && dod.isBefore(dob)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "dateOfDeath cannot be before dateOfBirth");
        }
        if (burialDate != null && dod != null && burialDate.isBefore(dod)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "burialDate cannot be before dateOfDeath");
        }

        // 🔎 Duplicate guard BEFORE creating person
        if (dod != null &&
                deceasedPersonRepository
                        .existsByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfDeath(
                                safe(req.getFirstName()), safe(req.getLastName()), dod)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "A deceased with the same name and date of death already exists");
        }

        // 1) Resolve target plot
        GravePlot plot;
        if (req.getGravePlotId() != null) {
            plot = gravePlotRepository.findById(req.getGravePlotId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Grave plot not found: id=" + req.getGravePlotId()));
        } else {
            if (isBlank(req.getSection()) || isBlank(req.getPlotNumber())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "section and plotNumber are required when gravePlotId is not provided");
            }
            Optional<GravePlot> existingPlot = gravePlotRepository
                    .findBySectionIgnoreCaseAndPlotNumberIgnoreCase(
                            req.getSection().trim(), req.getPlotNumber().trim());
            plot = existingPlot.orElseGet(() ->
                    gravePlotRepository.save(GravePlot.builder()
                            .section(req.getSection().trim())
                            .plotNumber(req.getPlotNumber().trim())
                            .locationDescription(req.getLocationDescription())
                            .build())
            );
        }

        // 2) Create deceased person
        DeceasedPerson person = deceasedPersonRepository.save(
                DeceasedPerson.builder()
                        .firstName(safe(req.getFirstName()))
                        .lastName(safe(req.getLastName()))
                        .dateOfBirth(dob)
                        .dateOfDeath(dod)
                        .gender(req.getGender())
                        .build()
        );

        // 3) Create burial linked to person + plot (plot reuse allowed)
        BurialRecord burial = burialRecordRepository.save(
                BurialRecord.builder()
                        .burialDate(burialDate)
                        .notes(req.getNotes())
                        .deceasedPerson(person)
                        .gravePlot(plot)
                        .build()
        );

        // 4) Build response
        return BurialBundleResponse.builder()
                .burialRecordId(burial.getId())
                .deceasedPersonId(person.getId())
                .gravePlotId(plot.getId())
                .fullName(person.getFirstName() + " " + person.getLastName())
                .section(plot.getSection())
                .plotNumber(plot.getPlotNumber())
                .build();
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
    private static String safe(String s) {
        return s == null ? null : s.trim();
    }
}
