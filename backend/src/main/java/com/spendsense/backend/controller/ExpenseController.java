package com.spendsense.backend.controller;

import com.spendsense.backend.dto.ExpenseRequest;
import com.spendsense.backend.dto.ExpenseResponse;
import com.spendsense.backend.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(
            @RequestBody ExpenseRequest request,
            Principal principal) {
        return ResponseEntity.ok(
                expenseService.createExpense(request, principal.getName()));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses(Principal principal) {
        return ResponseEntity.ok(
                expenseService.getAllExpenses(principal.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @RequestBody ExpenseRequest request,
            Principal principal) {
        return ResponseEntity.ok(
                expenseService.updateExpense(id, request, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long id,
            Principal principal) {
        expenseService.deleteExpense(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/range")
    public ResponseEntity<List<ExpenseResponse>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            Principal principal) {
        return ResponseEntity.ok(
                expenseService.getExpensesByDateRange(principal.getName(), start, end));
    }

    @GetMapping("/export/csv")
    public ResponseEntity<String> exportCsv(Principal principal) {
        List<com.spendsense.backend.dto.ExpenseResponse> expenses =
                expenseService.getAllExpenses(principal.getName());

        StringBuilder csv = new StringBuilder();
        csv.append("Title,Amount,Category,Date,Recurring\n");

        for (com.spendsense.backend.dto.ExpenseResponse e : expenses) {
            csv.append(e.getTitle()).append(",")
                    .append(e.getAmount()).append(",")
                    .append(e.getCategoryName()).append(",")
                    .append(e.getDate()).append(",")
                    .append(e.isRecurring()).append("\n");
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=expenses.csv")
                .header("Content-Type", "text/csv")
                .body(csv.toString());
    }
}