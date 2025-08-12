package com.mtc.cemetery.cemetery_records.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private LocalDate dateOfBirth;
    private LocalDate dateOfDeath;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @OneToOne(mappedBy = "deceasedPerson", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private BurialRecord burialRecord;
}
