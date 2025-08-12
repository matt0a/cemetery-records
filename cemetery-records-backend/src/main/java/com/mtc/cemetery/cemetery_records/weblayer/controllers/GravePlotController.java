package com.mtc.cemetery.cemetery_records.weblayer.controllers;

import com.mtc.cemetery.cemetery_records.domain.entities.GravePlot;
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
}
