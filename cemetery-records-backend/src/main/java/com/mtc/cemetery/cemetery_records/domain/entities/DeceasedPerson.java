package com.mtc.cemetery.cemetery_records.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"}) // <— add
public class DeceasedPerson {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private LocalDate dateOfBirth;
    private LocalDate dateOfDeath;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @OneToOne(mappedBy = "deceasedPerson")
    @JsonIgnore
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private BurialRecord burialRecord;
}
