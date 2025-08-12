package com.mtc.cemetery.cemetery_records.repositories;

import com.mtc.cemetery.cemetery_records.domain.entities.BurialRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BurialRecordRepository extends JpaRepository<BurialRecord, Long> {
    boolean existsByGravePlot_Id(Long gravePlotId);
    boolean existsByDeceasedPerson_Id(Long deceasedPersonId);
}