package com.mtc.cemetery.cemetery_records.services;

import com.mtc.cemetery.cemetery_records.domain.entities.BurialRecord;
import com.mtc.cemetery.cemetery_records.repositories.BurialRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BurialRecordServiceImpl implements BurialRecordService {

    private final BurialRecordRepository repository;

    @Override
    public BurialRecord save(BurialRecord burialRecord) {
        return repository.save(burialRecord);
    }

    @Override
    public Optional<BurialRecord> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<BurialRecord> findAll() {
        return repository.findAll();
    }

    @Override
    public BurialRecord update(Long id, BurialRecord updatedRecord) {
        BurialRecord existing = repository.findById(id).orElseThrow();
        updatedRecord.setId(existing.getId());
        return repository.save(updatedRecord);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
