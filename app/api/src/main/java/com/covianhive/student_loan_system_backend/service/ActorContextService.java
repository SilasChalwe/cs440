package com.covianhive.student_loan_system_backend.service;

import com.covianhive.student_loan_system_backend.domain.AuthenticatedActor;
import com.covianhive.student_loan_system_backend.security.AppUserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ActorContextService {

    public AuthenticatedActor currentActor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUserPrincipal principal)) {
            throw new IllegalStateException("No authenticated actor found.");
        }

        return new AuthenticatedActor(
                principal.getUsername(),
                principal.getRole(),
                principal.getBankId(),
                principal.getStudentId()
        );
    }
}
