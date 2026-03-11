package com.covianhive.student_loan_system_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StudentLoanSystemBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudentLoanSystemBackendApplication.class, args);
	}

}
