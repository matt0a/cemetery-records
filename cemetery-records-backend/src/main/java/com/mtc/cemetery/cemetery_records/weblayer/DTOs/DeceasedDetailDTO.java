package com.mtc.cemetery.cemetery_records.weblayer.DTOs;

import com.mtc.cemetery.cemetery_records.domain.enums.Gender;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeceasedDetailDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private LocalDate dateOfDeath;
    private Gender gender;

    private LocalDate burialDate; // from BurialRecord

    private GravePlotDTO gravePlot;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GravePlotDTO {
        private Long id;
        private String section;
        private String plotNumber;
        private String locationDescription;
    }
}
