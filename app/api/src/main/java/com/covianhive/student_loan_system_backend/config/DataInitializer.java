package com.covianhive.student_loan_system_backend.config;

import com.covianhive.student_loan_system_backend.persistence.entity.*;
import com.covianhive.student_loan_system_backend.domain.RoleType;
import com.covianhive.student_loan_system_backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            AppUserRepository userRepository,
            BankRepository bankRepository,
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // ==========================
            // Initialize Banks
            // ==========================
            BankEntity zanaco;
            BankEntity fnb;
            if (bankRepository.count() == 0) {
                zanaco = new BankEntity();
                zanaco.setId(1L); // manually assigned
                zanaco.setCode("ZANACO");
                zanaco.setName("Zanaco");
                bankRepository.save(zanaco);

                fnb = new BankEntity();
                fnb.setId(2L); // manually assigned
                fnb.setCode("FNB");
                fnb.setName("FNB");
                bankRepository.save(fnb);
            } else {
                zanaco = bankRepository.findByCodeIgnoreCase("ZANACO").orElseThrow();
                fnb = bankRepository.findByCodeIgnoreCase("FNB").orElseThrow();
            }

            // ==========================
            // Initialize Admin User
            // ==========================
            if (userRepository.findByUsername("admin").isEmpty()) {
                AppUserEntity admin = new AppUserEntity();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(RoleType.UNIVERSITY_ADMIN);
                admin.setEnabled(true);
                userRepository.save(admin);
            }

            // ==========================
            // Create Bank Users
            // ==========================
            createBankUser(userRepository, "zanaco", zanaco, passwordEncoder);
            createBankUser(userRepository, "fnb", fnb, passwordEncoder);

            // ==========================
            // Initialize Students
            // ==========================
            if (studentRepository.count() == 0) {
                List<Map<String, Object>> studentData = List.of(
                        Map.of("name", "Alice John", "num", "22177001", "bank", zanaco),
                        Map.of("name", "Silas Chalwe", "num", "22177002", "bank", fnb),
                        Map.of("name", "Eric Sakala", "num", "22177003", "bank", zanaco),
                        Map.of("name", "Gift Phiri", "num", "22177004", "bank", fnb),
                        Map.of("name", "Mary Zulu", "num", "22177005", "bank", zanaco),
                        Map.of("name", "Peter Mwansa", "num", "22177006", "bank", fnb),
                        Map.of("name", "Grace Tembo", "num", "22177007", "bank", zanaco),
                        Map.of("name", "Joseph Banda", "num", "22177008", "bank", fnb),
                        Map.of("name", "Ruth Chileshe", "num", "22177009", "bank", zanaco),
                        Map.of("name", "David Mumba", "num", "22177010", "bank", fnb)
                );

                long studentIdCounter = 1L; // manually generate IDs
                for (Map<String, Object> data : studentData) {
                    // Create Student
                    StudentEntity student = new StudentEntity();
                    student.setId(studentIdCounter++); // assign manual ID
                    student.setName((String) data.get("name"));
                    student.setStudentNumber((String) data.get("num"));
                    student.setAllowanceAmount(BigDecimal.valueOf(1000.00));
                    student.setLoanLimit(BigDecimal.valueOf(15000.00));
                    student.setBankAccount("00000000000000" + data.get("num").toString().substring(6));
                    student.setBankId(((BankEntity) data.get("bank")).getId());

                    studentRepository.save(student);

                    // Create corresponding AppUser for Student
                    AppUserEntity sUser = new AppUserEntity();
                    sUser.setUsername(student.getStudentNumber());
                    sUser.setPassword(passwordEncoder.encode("test1234"));
                    sUser.setRole(RoleType.STUDENT);
                    sUser.setStudentId(student.getId());
                    sUser.setEnabled(true);
                    userRepository.save(sUser);
                }
            }

            System.out.println("Database seeding complete.");
        };
    }

    private void createBankUser(AppUserRepository repo, String username, BankEntity bank, PasswordEncoder encoder) {
        if (repo.findByUsername(username).isEmpty()) {
            AppUserEntity user = new AppUserEntity();
            user.setUsername(username);
            user.setPassword(encoder.encode("bank123"));
            user.setRole(RoleType.BANK);
            user.setBankId(bank.getId());
            user.setEnabled(true);
            repo.save(user);
        }
    }
}