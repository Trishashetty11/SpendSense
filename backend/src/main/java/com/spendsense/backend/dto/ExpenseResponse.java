package com.spendsense.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private String title;
    private BigDecimal amount;
    private String description;
    private LocalDate date;
    private String categoryName;
    private String categoryIcon;
    private String categoryColor;
    private boolean recurring;
    private String recurrenceFrequency;
}