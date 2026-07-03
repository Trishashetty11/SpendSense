package com.spendsense.backend.service;

import com.spendsense.backend.dto.ExpenseRequest;
import com.spendsense.backend.dto.ExpenseResponse;
import com.spendsense.backend.model.Category;
import com.spendsense.backend.model.Expense;
import com.spendsense.backend.model.User;
import com.spendsense.backend.repository.CategoryRepository;
import com.spendsense.backend.repository.ExpenseRepository;
import com.spendsense.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ExpenseResponse toResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .amount(expense.getAmount())
                .description(expense.getDescription())
                .date(expense.getDate())
                .categoryName(expense.getCategory() != null ? expense.getCategory().getName() : null)
                .categoryIcon(expense.getCategory() != null ? expense.getCategory().getIcon() : null)
                .categoryColor(expense.getCategory() != null ? expense.getCategory().getColor() : null)
                .recurring(expense.isRecurring())
                .recurrenceFrequency(expense.getRecurrenceFrequency())
                .build();
    }

    public ExpenseResponse createExpense(ExpenseRequest request, String email) {
        User user = getUser(email);
        Category category = request.getCategoryId() != null
                ? categoryRepository.findById(request.getCategoryId()).orElse(null)
                : null;

        Expense expense = Expense.builder()
                .title(request.getTitle())
                .amount(request.getAmount())
                .description(request.getDescription())
                .date(request.getDate())
                .category(category)
                .user(user)
                .recurring(request.isRecurring())
                .recurrenceFrequency(request.getRecurrenceFrequency())
                .build();

        return toResponse(expenseRepository.save(expense));
    }

    public List<ExpenseResponse> getAllExpenses(String email) {
        User user = getUser(email);
        return expenseRepository.findByUser(user)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request, String email) {
        User user = getUser(email);
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        Category category = request.getCategoryId() != null
                ? categoryRepository.findById(request.getCategoryId()).orElse(null)
                : null;

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setDate(request.getDate());
        expense.setCategory(category);
        expense.setRecurring(request.isRecurring());
        expense.setRecurrenceFrequency(request.getRecurrenceFrequency());

        return toResponse(expenseRepository.save(expense));
    }

    public void deleteExpense(Long id, String email) {
        User user = getUser(email);
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        expenseRepository.delete(expense);
    }

    public List<ExpenseResponse> getExpensesByDateRange(String email, LocalDate start, LocalDate end) {
        User user = getUser(email);
        return expenseRepository.findByUserAndDateBetween(user, start, end)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }
}