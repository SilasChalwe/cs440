package com.covianhive.student_loan_system_backend.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MonthlyAllowanceScheduler {

    private final MonthlyAllowanceService monthlyAllowanceService;

    public MonthlyAllowanceScheduler(MonthlyAllowanceService monthlyAllowanceService) {
        this.monthlyAllowanceService = monthlyAllowanceService;
    }

    @Scheduled(cron = "${app.allowance.monthly-cron:0 0 8 1 * *}")
    public void runScheduledMonthlyDisbursement() {
        monthlyAllowanceService.runCurrentMonthDisbursement("system_scheduler");
    }
}
