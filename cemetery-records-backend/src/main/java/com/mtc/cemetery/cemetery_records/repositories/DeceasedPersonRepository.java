package com.mtc.cemetery.cemetery_records.repositories;


import com.mtc.cemetery.cemetery_records.domain.entities.DeceasedPerson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DeceasedPersonRepository extends JpaRepository<DeceasedPerson, Long> {
    List<DeceasedPerson> findByLastNameContainingIgnoreCase(String lastName);
    List<DeceasedPerson> findByFirstNameContainingIgnoreCase(String firstName);
    List<DeceasedPerson> findByLastNameContainingIgnoreCaseOrFirstNameContainingIgnoreCase(String lastName, String firstName);
    boolean existsByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfDeath(
            String firstName, String lastName, LocalDate dateOfDeath);
}
