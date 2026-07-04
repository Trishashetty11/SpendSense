package com.spendsense.backend;

import com.spendsense.backend.model.Category;
import com.spendsense.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            categoryRepository.saveAll(List.of(
                    Category.builder().name("Food").icon("🍔").color("#FF6B6B").build(),
                    Category.builder().name("Transport").icon("🚗").color("#3B82F6").build(),
                    Category.builder().name("Shopping").icon("🛍️").color("#8B5CF6").build(),
                    Category.builder().name("Entertainment").icon("🎬").color("#F59E0B").build(),
                    Category.builder().name("Health").icon("💊").color("#EF4444").build(),
                    Category.builder().name("Bills").icon("📄").color("#6B7280").build(),
                    Category.builder().name("Education").icon("📚").color("#10B981").build(),
                    Category.builder().name("Other").icon("💸").color("#9CA3AF").build()
            ));
            System.out.println("✅ Default categories created!");
        }
    }
}