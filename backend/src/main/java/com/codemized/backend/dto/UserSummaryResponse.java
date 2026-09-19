package com.codemized.backend.dto;

import java.util.UUID;

public class UserSummaryResponse {

    private UUID id;
    private String name;
    private String email;

    public UserSummaryResponse(UUID id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
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
