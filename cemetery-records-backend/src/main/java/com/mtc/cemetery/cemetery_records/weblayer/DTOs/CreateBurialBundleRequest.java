package com.mtc.cemetery.cemetery_records.weblayer.DTOs;

import com.mtc.cemetery.cemetery_records.domain.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateBurialBundleRequest {
    // Deceased
    @NotBlank @Size(max = 100)
    private String firstName;

    @NotBlank @Size(max = 100)
    private String lastName;

    // Optional; don’t force @Past because historical data entry can be imperfect
    private LocalDate dateOfBirth;

    @NotNull
    private LocalDate dateOfDeath;

    @NotNull
    private Gender gender;

    // Plot reference: either gravePlotId OR (section + plotNumber)
    private Long gravePlotId;

    @Size(max = 255)
    private String locationDescription; // optional

    // required only when gravePlotId is null
    @Size(max = 50)
    private String section;

    // required only when gravePlotId is null
    @Size(max = 50)
    private String plotNumber;

    // Burial
    @NotNull
    private LocalDate burialDate;

    @Size(max = 1000)
    private String notes;

    // ---------- Cross-field / conditional validation ----------

    @AssertTrue(message = "Provide either gravePlotId or both section and plotNumber")
    public boolean isPlotReferenceProvided() {
        return gravePlotId != null || (notBlank(section) && notBlank(plotNumber));
    }

    @AssertTrue(message = "dateOfBirth must be on or before dateOfDeath")
    public boolean isBirthBeforeDeath() {
        if (dateOfBirth != null && dateOfDeath != null) {
            return !dateOfBirth.isAfter(dateOfDeath);
        }
        return true; // no dob provided -> fine
    }

    @AssertTrue(message = "burialDate must be on or after dateOfDeath")
    public boolean isBurialAfterDeath() {
        if (burialDate != null && dateOfDeath != null) {
            return !burialDate.isBefore(dateOfDeath);
        }
        return true;
    }

    private static boolean notBlank(String s) {
        return s != null && !s.trim().isEmpty();
    }
}
