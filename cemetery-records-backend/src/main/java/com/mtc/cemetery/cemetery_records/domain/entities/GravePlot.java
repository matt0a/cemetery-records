package com.mtc.cemetery.cemetery_records.domain.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "grave_plots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GravePlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String locationDescription;
    private String section;
    private String plotNumber;

    @OneToOne(mappedBy = "gravePlot", cascade = CascadeType.ALL)
    private BurialRecord burialRecord;
}
