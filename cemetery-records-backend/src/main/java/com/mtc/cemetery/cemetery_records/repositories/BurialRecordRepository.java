package com.mtc.cemetery.cemetery_records.repositories;

import com.mtc.cemetery.cemetery_records.domain.entities.BurialRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BurialRecordRepository extends JpaRepository<BurialRecord, Long> {
    boolean existsByGravePlot_Id(Long gravePlotId);
    boolean existsByDeceasedPerson_Id(Long deceasedPersonId);
    // NEW: fetch burial bundle for a given deceased person
    Optional<BurialRecord> findByDeceasedPerson_Id(Long deceasedPersonId);
    long countByDeceasedPerson_Id(Long deceasedPersonId);
    long countByGravePlot_Id(Long gravePlotId);
    List<BurialRecord> findByGravePlot_Id(Long gravePlotId);
}