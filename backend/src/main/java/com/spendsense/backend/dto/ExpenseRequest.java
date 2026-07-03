package com.spendsense.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseRequest {
    private String title;
    private BigDecimal amount;
    private String description;
    private LocalDate date;
    private Long categoryId;
    private boolean recurring;
    private String recurrenceFrequency;
}