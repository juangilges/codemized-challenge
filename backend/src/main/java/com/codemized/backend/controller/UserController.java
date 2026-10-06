package com.codemized.backend.controller;

import com.codemized.backend.dto.EditUserRequest;
import com.codemized.backend.dto.EditUserResponse;
import com.codemized.backend.dto.UserSummaryResponse;
import com.codemized.backend.model.User;
import com.codemized.backend.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Listar usuarios
    @GetMapping
    public ResponseEntity<List<UserSummaryResponse>> listUsers() {

        return ResponseEntity.ok(
                userService.listUsers()
        );
    }

    // Obtener usuario actualmente autenticado
    @GetMapping("/me")
    public ResponseEntity<UserSummaryResponse> getCurrentUser(
            Authentication authentication) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        UserSummaryResponse response =
                new UserSummaryResponse(
                        authenticatedUser.getId(),
                        authenticatedUser.getName(),
                        authenticatedUser.getEmail()
                );

        return ResponseEntity.ok(response);
    }

    // Editar usuario actualmente autenticado
    @PutMapping("/me")
    public ResponseEntity<EditUserResponse> editCurrentUser(
            Authentication authentication,
            @Valid @RequestBody EditUserRequest request) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        User updatedUser =
                userService.editUser(
                        authenticatedUser.getId(),
                        request.getName(),
                        request.getEmail()
                );

        EditUserResponse response =
                new EditUserResponse(
                        updatedUser.getId(),
                        updatedUser.getName(),
                        updatedUser.getEmail()
                );

        return ResponseEntity.ok(response);
    }
}