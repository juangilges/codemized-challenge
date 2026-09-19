package com.codemized.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class CreateProjectResponse {

    private UUID id;
    private String name;
    private String description;
    private UUID creatorId;
    private LocalDateTime createdAt;

    public CreateProjectResponse(
            UUID id,
            String name,
            String description,
            UUID creatorId,
            LocalDateTime createdAt) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.creatorId = creatorId;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public UUID getCreatorId() {
        return creatorId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}