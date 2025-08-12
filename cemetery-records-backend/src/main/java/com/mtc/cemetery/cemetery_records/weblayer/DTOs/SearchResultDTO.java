package com.mtc.cemetery.cemetery_records.weblayer.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class SearchResultDTO {
    private Long id;
    private String fullName;
    private String graveNumber;
    private String section;
    private LocalDate dateOfDeath;
}
