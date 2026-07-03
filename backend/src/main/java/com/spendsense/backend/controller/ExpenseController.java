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
}