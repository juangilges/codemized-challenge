package com.codemized.backend.dto;

import java.util.UUID;

public class LoginResponse {

    private String token;
    private UUID id;
    private String name;
    private String email;

    public LoginResponse(String token, UUID id, String name, String email) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}