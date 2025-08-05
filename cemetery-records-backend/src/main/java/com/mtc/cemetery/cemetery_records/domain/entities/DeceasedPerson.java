package com.mtc.cemetery.cemetery_records.domain.entities;

import com.mtc.cemetery.cemetery_records.domain.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "deceased_persons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeceasedPerson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    private LocalDate dateOfBirth;
    private LocalDate dateOfDeath;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @OneToOne(mappedBy = "deceasedPerson", cascade = CascadeType.ALL)
    private BurialRecord burialRecord;
}
