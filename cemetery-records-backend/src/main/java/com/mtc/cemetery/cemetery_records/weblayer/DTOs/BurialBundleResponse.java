package com.mtc.cemetery.cemetery_records.weblayer.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BurialBundleResponse {
    private Long deceasedPersonId;
    private Long gravePlotId;
    private Long burialRecordId;

    private String fullName;
    private String section;
    private String plotNumber;
}
