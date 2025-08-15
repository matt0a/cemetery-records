package com.mtc.cemetery.cemetery_records.services;

import com.mtc.cemetery.cemetery_records.domain.entities.BurialRecord;
import com.mtc.cemetery.cemetery_records.repositories.BurialRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BurialRecordServiceImpl implements BurialRecordService {

    private final BurialRecordRepository repository;

    @Override @Transactional
    public BurialRecord save(BurialRecord burialRecord) {
        return repository.save(burialRecord);
    }

    @Override @Transactional(readOnly = true)
    public Optional<BurialRecord> findById(Long id) {
        return repository.findById(id);
    }

    @Override @Transactional(readOnly = true)
    public List<BurialRecord> findAll() {
        return repository.findAll();
    }

    @Override @Transactional
    public BurialRecord update(Long id, BurialRecord updatedRecord) {
        BurialRecord existing = repository.findById(id).orElseThrow();
        // If you only allow certain fields to change, copy them selectively:
        existing.setBurialDate(updatedRecord.getBurialDate());
        existing.setNotes(updatedRecord.getNotes());
        // Usually you *do not* let callers change gravePlot/deceasedPerson via this method.
        return repository.save(existing);
    }

    @Override @Transactional
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
