package com.covianhive.student_loan_system_backend.controller.auth;

import com.covianhive.student_loan_system_backend.dto.auth.LoginRequest;
import com.covianhive.student_loan_system_backend.dto.auth.LoginResponse;
import com.covianhive.student_loan_system_backend.security.AppUserPrincipal;
import com.covianhive.student_loan_system_backend.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.same;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    @Test
    void loginShouldAuthenticateAndReturnJwtToken() {
        AuthenticationManager authenticationManager = mock(AuthenticationManager.class);
        JwtService jwtService = mock(JwtService.class);
        Authentication authentication = mock(Authentication.class);
        AppUserPrincipal principal = mock(AppUserPrincipal.class);

        AuthController controller = new AuthController(authenticationManager, jwtService);

        when(authenticationManager.authenticate(argThat(auth ->
                auth instanceof UsernamePasswordAuthenticationToken
                        && "student_user".equals(auth.getPrincipal())
                        && "password123".equals(auth.getCredentials())
        ))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(principal);
        when(jwtService.generateToken(principal)).thenReturn("jwt-token");

        LoginResponse response = controller.login(new LoginRequest("student_user", "password123"));

        assertEquals("jwt-token", response.token());
        verify(authenticationManager).authenticate(argThat(auth ->
                auth instanceof UsernamePasswordAuthenticationToken
                        && "student_user".equals(auth.getPrincipal())
                        && "password123".equals(auth.getCredentials())
        ));
        verify(jwtService).generateToken(same(principal));
    }
}
