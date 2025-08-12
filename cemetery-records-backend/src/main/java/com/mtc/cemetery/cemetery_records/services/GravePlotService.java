package com.mtc.cemetery.cemetery_records.services;

import com.mtc.cemetery.cemetery_records.domain.entities.GravePlot;

import java.util.List;
import java.util.Optional;

public interface GravePlotService {
    GravePlot save(GravePlot gravePlot);
    Optional<GravePlot> findById(Long id);
    List<GravePlot> findAll();
    GravePlot update(Long id, GravePlot updated);
    void deleteById(Long id);
}

