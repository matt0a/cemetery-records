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

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BurialBundleService {

    private final DeceasedPersonRepository deceasedPersonRepository;
    private final GravePlotRepository gravePlotRepository;
    private final BurialRecordRepository burialRecordRepository;

    @Transactional
    public BurialBundleResponse createBundle(CreateBurialBundleRequest req) {
        // 1) Get or create the target plot by (section, plotNumber)
        Optional<GravePlot> existingPlot = gravePlotRepository
                .findBySectionIgnoreCaseAndPlotNumberIgnoreCase(req.getSection(), req.getPlotNumber());

        GravePlot plot = existingPlot.orElseGet(() ->
                gravePlotRepository.save(GravePlot.builder()
                        .section(req.getSection())
                        .plotNumber(req.getPlotNumber())
                        .locationDescription(req.getLocationDescription())
                        .build())
        );

        // 2) Ensure the plot is not already used by a burial (1–1 with burial)
        if (burialRecordRepository.existsByGravePlot_Id(plot.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Plot " + plot.getSection() + "-" + plot.getPlotNumber() + " is already in use."
            );
        }

        // 3) Create deceased person
        DeceasedPerson person = deceasedPersonRepository.save(
                DeceasedPerson.builder()
                        .firstName(req.getFirstName())
                        .lastName(req.getLastName())
                        .dateOfBirth(req.getDateOfBirth())
                        .dateOfDeath(req.getDateOfDeath())
                        .gender(req.getGender())
                        .build()
        );

        // 4) Create burial linked to person + plot
        BurialRecord burial = burialRecordRepository.save(
                BurialRecord.builder()
                        .burialDate(req.getBurialDate())
                        .notes(req.getNotes())
                        .deceasedPerson(person)
                        .gravePlot(plot)
                        .build()
        );

        return BurialBundleResponse.builder()
                .burialRecordId(burial.getId())
                .deceasedPersonId(person.getId())
                .gravePlotId(plot.getId())
                .fullName(person.getFirstName() + " " + person.getLastName())
                .section(plot.getSection())
                .plotNumber(plot.getPlotNumber())
                .build();
    }
}
