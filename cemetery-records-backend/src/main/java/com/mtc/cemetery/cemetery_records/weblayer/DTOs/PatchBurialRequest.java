package com.mtc.cemetery.cemetery_records.weblayer.DTOs;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatchBurialRequest {
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate burialDate;
    private String notes;
}
