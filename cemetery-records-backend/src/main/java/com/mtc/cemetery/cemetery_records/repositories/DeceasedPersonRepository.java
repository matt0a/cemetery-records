package com.mtc.cemetery.cemetery_records.repositories;


import com.mtc.cemetery.cemetery_records.domain.entities.DeceasedPerson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DeceasedPersonRepository extends JpaRepository<DeceasedPerson, Long> {
    List<DeceasedPerson> findByLastNameContainingIgnoreCase(String lastName);
    List<DeceasedPerson> findByFirstNameContainingIgnoreCase(String firstName);
    List<DeceasedPerson> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String lastName, String firstName);
    boolean existsByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfDeath(
            String firstName, String lastName, LocalDate dateOfDeath);
    // NEW: exact name match (case-insensitive) + exact date of birth
    List<DeceasedPerson> findByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfBirth(
            String firstName, String lastName, LocalDate dateOfBirth
    );

}
