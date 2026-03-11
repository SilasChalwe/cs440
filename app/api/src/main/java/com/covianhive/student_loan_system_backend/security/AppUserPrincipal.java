package com.covianhive.student_loan_system_backend.security;

import com.covianhive.student_loan_system_backend.domain.RoleType;
import com.covianhive.student_loan_system_backend.persistence.entity.AppUserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class AppUserPrincipal implements UserDetails {

    private final String username;
    private final String password;
    private final RoleType role;
    private final Long bankId;
    private final Long studentId;
    private final boolean enabled;

    public AppUserPrincipal(AppUserEntity user) {
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.role = user.getRole();
        this.bankId = user.getBankId();
        this.studentId = user.getStudentId();
        this.enabled = Boolean.TRUE.equals(user.getEnabled());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String authority = switch (role) {
            case UNIVERSITY_ADMIN -> "ROLE_ADMIN";
            case BANK -> "ROLE_BANK";
            case STUDENT -> "ROLE_STUDENT";
        };
        return List.of(new SimpleGrantedAuthority(authority));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public RoleType getRole() {
        return role;
    }

    public Long getBankId() {
        return bankId;
    }

    public Long getStudentId() {
        return studentId;
    }
}
