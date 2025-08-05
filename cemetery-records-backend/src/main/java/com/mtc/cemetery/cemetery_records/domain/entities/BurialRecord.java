package com.mtc.cemetery.cemetery_records.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "burial_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BurialRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate burialDate;
    private String notes;

    @OneToOne
    @JoinColumn(name = "deceased_person_id")
    private DeceasedPerson deceasedPerson;

    @OneToOne
    @JoinColumn(name = "grave_plot_id")
    private GravePlot gravePlot;
}
