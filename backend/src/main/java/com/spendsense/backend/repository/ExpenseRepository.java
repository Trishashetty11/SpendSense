package com.spendsense.backend.repository;

import com.spendsense.backend.model.Expense;
import com.spendsense.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser(User user);
    List<Expense> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);
    List<Expense> findByUserAndCategoryId(User user, Long categoryId);
}