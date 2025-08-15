package com.mtc.cemetery.cemetery_records.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "burial_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"}) // <— add
public class BurialRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate burialDate;
    private String notes;

    // many burials → one plot
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "grave_plot_id", nullable = false)
    @JsonIgnoreProperties({"burials","hibernateLazyInitializer","handler"})
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private GravePlot gravePlot;

    // one burial ↔ one person
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "deceased_person_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"burialRecord","hibernateLazyInitializer","handler"})
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private DeceasedPerson deceasedPerson;
}
