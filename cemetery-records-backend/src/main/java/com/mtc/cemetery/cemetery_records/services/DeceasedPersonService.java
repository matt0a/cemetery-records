package com.mtc.cemetery.cemetery_records.services;

import com.mtc.cemetery.cemetery_records.domain.entities.DeceasedPerson;

import java.util.List;
import java.util.Optional;

public interface DeceasedPersonService {
    DeceasedPerson save(DeceasedPerson person);
    Optional<DeceasedPerson> findById(Long id);
    List<DeceasedPerson> findAll();
    DeceasedPerson update(Long id, DeceasedPerson updated);
    void deleteById(Long id);
}
