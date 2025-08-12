package com.mtc.cemetery.cemetery_records.weblayer.DTOs;

import com.mtc.cemetery.cemetery_records.domain.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateBurialBundleRequest {
    // Deceased
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    private LocalDate dateOfBirth;
    @NotNull
    private LocalDate dateOfDeath;
    @NotNull
    private Gender gender;

    // Either provide an existing gravePlotId OR (section + plotNumber) for a new plot
    private Long gravePlotId;
    private String locationDescription; // optional
    private String section;             // required if gravePlotId is null
    private String plotNumber;          // required if gravePlotId is null

    // Burial
    @NotNull
    private LocalDate burialDate;
    private String notes;
}
