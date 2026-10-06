package com.codemized.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AddProjectMemberRequest {

    @NotBlank
    @Email
    private String email;

    public AddProjectMemberRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}