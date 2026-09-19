package com.codemized.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class CommentResponse {

    private UUID id;
    private String content;
    private UUID taskId;
    private UUID authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CommentResponse(
            UUID id,
            String content,
            UUID taskId,
            UUID authorId,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.content = content;
        this.taskId = taskId;
        this.authorId = authorId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public UUID getAuthorId() {
        return authorId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}