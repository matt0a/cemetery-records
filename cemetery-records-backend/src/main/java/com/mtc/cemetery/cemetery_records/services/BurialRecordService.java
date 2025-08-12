package com.mtc.cemetery.cemetery_records.services;

import com.mtc.cemetery.cemetery_records.domain.entities.BurialRecord;

import java.util.List;
import java.util.Optional;

public interface BurialRecordService {
    BurialRecord save(BurialRecord burialRecord);
    Optional<BurialRecord> findById(Long id);
    List<BurialRecord> findAll();
    BurialRecord update(Long id, BurialRecord updatedRecord);
    void deleteById(Long id);
}
