package com.mtc.cemetery.cemetery_records.repositories;

import com.mtc.cemetery.cemetery_records.domain.entities.GravePlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GravePlotRepository extends JpaRepository<GravePlot, Long> {
    boolean existsBySectionAndPlotNumber(String section, String plotNumber);
    Optional<GravePlot> findBySectionIgnoreCaseAndPlotNumberIgnoreCase(String section, String plotNumber);
    boolean existsBySectionIgnoreCaseAndPlotNumberIgnoreCase(String section, String plotNumber);
    List<GravePlot> findBySectionContainingIgnoreCaseAndPlotNumberContainingIgnoreCase(String section, String plotNumber);
    List<GravePlot> findBySectionContainingIgnoreCase(String section);
    List<GravePlot> findByPlotNumberContainingIgnoreCase(String plotNumber);
}