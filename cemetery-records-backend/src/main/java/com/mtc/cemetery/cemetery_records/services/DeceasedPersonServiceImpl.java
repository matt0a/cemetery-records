package com.mtc.cemetery.cemetery_records.services;

import com.mtc.cemetery.cemetery_records.domain.entities.DeceasedPerson;
import com.mtc.cemetery.cemetery_records.repositories.DeceasedPersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeceasedPersonServiceImpl implements DeceasedPersonService {

    private final DeceasedPersonRepository repository;

    @Override
    public DeceasedPerson save(DeceasedPerson person) {
        return repository.save(person);
    }

    @Override
    public Optional<DeceasedPerson> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<DeceasedPerson> findAll() {
        return repository.findAll();
    }

    @Override
    @Transactional
    public DeceasedPerson update(Long id, DeceasedPerson updated) {
        DeceasedPerson existing = repository.findById(id).orElseThrow();
        updated.setId(existing.getId());
        return repository.save(updated);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
