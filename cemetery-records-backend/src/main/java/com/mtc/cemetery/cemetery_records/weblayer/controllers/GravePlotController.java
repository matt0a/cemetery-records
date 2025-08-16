package com.mtc.cemetery.cemetery_records.weblayer.controllers;

import com.mtc.cemetery.cemetery_records.domain.entities.GravePlot;
import com.mtc.cemetery.cemetery_records.repositories.BurialRecordRepository;
import com.mtc.cemetery.cemetery_records.repositories.GravePlotRepository;
import com.mtc.cemetery.cemetery_records.weblayer.DTOs.CreatePlotRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class GravePlotController {

    private final GravePlotRepository gravePlotRepository;
    private final BurialRecordRepository burialRecordRepository;

    // ---- Public reads ----
    @GetMapping("/api/public/grave-plots")
    public ResponseEntity<List<GravePlot>> list() {
        return ResponseEntity.ok(gravePlotRepository.findAll());
    }

    @GetMapping("/api/public/grave-plots/{id}")
    public ResponseEntity<GravePlot> getOne(@PathVariable Long id) {
        return gravePlotRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ---- Admin create (secured) ----
    @PostMapping("/api/admin/grave-plots")
    public ResponseEntity<GravePlot> create(@Valid @RequestBody CreatePlotRequest req) {
        gravePlotRepository
                .findBySectionIgnoreCaseAndPlotNumberIgnoreCase(req.getSection(), req.getPlotNumber())
                .ifPresent(p -> { throw new IllegalArgumentException("Plot already exists"); });

        GravePlot saved = gravePlotRepository.save(
                GravePlot.builder()
                        .section(req.getSection())
                        .plotNumber(req.getPlotNumber())
                        .locationDescription(req.getLocationDescription())
                        .build()
        );
        return ResponseEntity.ok(saved);
    }

    // ---- Admin search (secured) ----
    // GET /api/admin/grave-plots?section=A&plotNumber=12
    @GetMapping("/api/admin/grave-plots")
    public ResponseEntity<List<GravePlot>> adminSearch(
            @RequestParam(required = false) String section,
            @RequestParam(required = false) String plotNumber
    ) {
        section = section == null ? "" : section;
        plotNumber = plotNumber == null ? "" : plotNumber;

        if (!section.isBlank() && !plotNumber.isBlank()) {
            return ResponseEntity.ok(gravePlotRepository
                    .findBySectionContainingIgnoreCaseAndPlotNumberContainingIgnoreCase(section, plotNumber));
        } else if (!section.isBlank()) {
            return ResponseEntity.ok(gravePlotRepository.findBySectionContainingIgnoreCase(section));
        } else if (!plotNumber.isBlank()) {
            return ResponseEntity.ok(gravePlotRepository.findByPlotNumberContainingIgnoreCase(plotNumber));
        } else {
            return ResponseEntity.ok(gravePlotRepository.findAll());
        }
    }

    // ---- Admin update (secured) ----
    @PatchMapping("/api/admin/grave-plots/{id}")
    public ResponseEntity<GravePlot> update(@PathVariable Long id, @RequestBody UpdatePlotRequest req) {
        return gravePlotRepository.findById(id)
                .map(p -> {
                    if (req.getSection() != null) p.setSection(req.getSection());
                    if (req.getPlotNumber() != null) p.setPlotNumber(req.getPlotNumber());
                    if (req.getLocationDescription() != null) p.setLocationDescription(req.getLocationDescription());
                    return ResponseEntity.ok(gravePlotRepository.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ---- Admin delete (secured) ----
    @DeleteMapping("/api/admin/grave-plots/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!gravePlotRepository.existsById(id)) return ResponseEntity.notFound().build();

        long count = burialRecordRepository.countByGravePlot_Id(id);
        if (count > 0) {
            return ResponseEntity.status(409).body(
                    java.util.Map.of("error", "Cannot delete plot: it is referenced by burial records.", "burialCount", count)
            );
        }
        gravePlotRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    // ---- Admin: available plots (no burials) ----
    @GetMapping("/api/admin/grave-plots/available")
    public ResponseEntity<List<GravePlot>> availableAdmin() {
        return ResponseEntity.ok(gravePlotRepository.findAvailablePlots());
    }



    // DTO for PATCH
    @lombok.Data
    public static class UpdatePlotRequest {
        private String section;
        private String plotNumber;
        private String locationDescription;
    }
}
