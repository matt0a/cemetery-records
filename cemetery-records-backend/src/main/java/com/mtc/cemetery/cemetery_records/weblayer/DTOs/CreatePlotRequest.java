package com.mtc.cemetery.cemetery_records.weblayer.DTOs;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePlotRequest {
    @NotBlank private String locationDescription;
    @NotBlank private String section;
    @NotBlank private String plotNumber;
}
