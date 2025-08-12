package com.mtc.cemetery.cemetery_records.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

// imports include jakarta.persistence.*

@Entity
@Table(
        name = "grave_plots",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_graveplot_section_plot",
                columnNames = {"section","plot_number"}
        )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GravePlot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "location_description")
    private String locationDescription;

    @Column(name = "section")
    private String section;

    @Column(name = "plot_number")
    private String plotNumber;

    @OneToOne(mappedBy = "gravePlot", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private BurialRecord burialRecord;
}
