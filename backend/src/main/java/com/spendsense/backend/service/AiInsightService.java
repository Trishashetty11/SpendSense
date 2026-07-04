package com.spendsense.backend.service;

import com.spendsense.backend.dto.ExpenseResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiInsightService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String generateInsights(List<ExpenseResponse> expenses) {
        if (expenses.isEmpty()) {
            return "No expenses found. Start adding expenses to get AI insights!";
        }

        StringBuilder summary = new StringBuilder();
        summary.append("Here are my expenses:\n");
        for (ExpenseResponse e : expenses) {
            summary.append("- ").append(e.getTitle())
                    .append(": ₹").append(e.getAmount())
                    .append(" (").append(e.getCategoryName()).append(")")
                    .append(" on ").append(e.getDate()).append("\n");
        }
        summary.append("\nPlease analyze my spending and give me 3-4 short, practical insights and tips to save money. Keep it friendly and concise.");

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

            Map<String, Object> part = Map.of("text", summary.toString());
            Map<String, Object> content = Map.of("parts", List.of(part));
            Map<String, Object> body = Map.of("contents", List.of(content));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            List<Map> candidates = (List<Map>) response.getBody().get("candidates");
            Map firstCandidate = candidates.get(0);
            Map contentMap = (Map) firstCandidate.get("content");
            List<Map> parts = (List<Map>) contentMap.get("parts");
            return (String) parts.get(0).get("text");

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}