package com.codemized.backend.dto;

import java.util.UUID;

public class AssignTaskRequest {

    private UUID assigneeId;

    public AssignTaskRequest() {
    }

    public UUID getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(UUID assigneeId) {
        this.assigneeId = assigneeId;
    }
}