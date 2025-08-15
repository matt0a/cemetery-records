package com.mtc.cemetery.cemetery_records.services;

import com.mtc.cemetery.cemetery_records.domain.entities.BurialRecord;
import com.mtc.cemetery.cemetery_records.domain.entities.DeceasedPerson;
import com.mtc.cemetery.cemetery_records.domain.entities.GravePlot;
import com.mtc.cemetery.cemetery_records.repositories.BurialRecordRepository;
import com.mtc.cemetery.cemetery_records.repositories.DeceasedPersonRepository;
import com.mtc.cemetery.cemetery_records.repositories.GravePlotRepository;
import com.mtc.cemetery.cemetery_records.weblayer.DTOs.BurialBundleResponse;
import com.mtc.cemetery.cemetery_records.weblayer.DTOs.CreateBurialBundleRequest;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class CemeteryAdminService {

    private final DeceasedPersonRepository deceasedRepo;
    private final GravePlotRepository gravePlotRepo;
    private final BurialRecordRepository burialRepo;

    @Transactional
    public BurialBundleResponse createBurialBundle(CreateBurialBundleRequest req) {
        LocalDate dob = req.getDateOfBirth();
        LocalDate dod = req.getDateOfDeath();
        LocalDate burialDate = req.getBurialDate();

        // Basic chronology guards
        if (dob != null && dod != null && dod.isBefore(dob)) {
            throw new IllegalArgumentException("Date of death cannot be before date of birth.");
        }
        if (burialDate != null && dod != null && burialDate.isBefore(dod)) {
            throw new IllegalArgumentException("Burial date cannot be before date of death.");
        }

        // Optional duplicate guard (same name+DoD)
        if (dod != null && deceasedRepo.existsByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfDeath(
                req.getFirstName(), req.getLastName(), dod)) {
            throw new IllegalArgumentException("A deceased with the same name and date of death already exists.");
        }

        // Resolve or create plot
        GravePlot plot;
        if (req.getGravePlotId() != null) {
            plot = gravePlotRepo.findById(req.getGravePlotId())
                    .orElseThrow(() -> new EntityNotFoundException("Grave plot not found: " + req.getGravePlotId()));
        } else {
            if (req.getSection() == null || req.getPlotNumber() == null) {
                throw new IllegalArgumentException("Either gravePlotId OR (section & plotNumber) must be provided.");
            }
            plot = gravePlotRepo.findBySectionIgnoreCaseAndPlotNumberIgnoreCase(req.getSection(), req.getPlotNumber())
                    .orElseGet(() -> gravePlotRepo.save(
                            GravePlot.builder()
                                    .section(req.getSection())
                                    .plotNumber(req.getPlotNumber())
                                    .locationDescription(req.getLocationDescription())
                                    .build()
                    ));
        }


        // Create deceased person
        DeceasedPerson deceased = deceasedRepo.save(
                DeceasedPerson.builder()
                        .firstName(req.getFirstName())
                        .lastName(req.getLastName())
                        .dateOfBirth(dob)
                        .dateOfDeath(dod)
                        .gender(req.getGender())
                        .build()
        );

        // Create burial (owning side sets the relationship)
        BurialRecord burialRecord = burialRepo.save(
                BurialRecord.builder()
                        .burialDate(burialDate)
                        .notes(req.getNotes())
                        .deceasedPerson(deceased)
                        .gravePlot(plot)
                        .build()
        );

        // If DeceasedPerson has a bidirectional @OneToOne to BurialRecord, keep this:
        deceased.setBurialRecord(burialRecord);
        // Do NOT call plot.setBurialRecord(...); plots can have many burials now.

        return BurialBundleResponse.builder()
                .deceasedPersonId(deceased.getId())
                .gravePlotId(plot.getId())
                .burialRecordId(burialRecord.getId())
                .build();
    }
}
