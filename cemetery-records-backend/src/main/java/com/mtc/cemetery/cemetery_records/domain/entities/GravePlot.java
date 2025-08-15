package com.mtc.cemetery.cemetery_records.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

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
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"}) // <— add
public class GravePlot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "location_description")
    private String locationDescription;

    @Column(name = "section")
    private String section;

    @Column(name = "plot_number")
    private String plotNumber;

    @OneToMany(mappedBy = "gravePlot", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private List<BurialRecord> burials = new ArrayList<>();
}
