package com.spendsense.backend.controller;

import com.spendsense.backend.dto.ExpenseResponse;
import com.spendsense.backend.service.AiInsightService;
import com.spendsense.backend.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AiInsightController {

    private final AiInsightService aiInsightService;
    private final ExpenseService expenseService;

    @GetMapping("/insights")
    public ResponseEntity<Map<String, String>> getInsights(Principal principal) {
        List<ExpenseResponse> expenses = expenseService.getAllExpenses(principal.getName());
        String insights = aiInsightService.generateInsights(expenses);
        return ResponseEntity.ok(Map.of("insights", insights));
    }
}