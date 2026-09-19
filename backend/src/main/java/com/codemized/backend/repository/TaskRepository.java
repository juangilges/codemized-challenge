package com.codemized.backend.repository;

import com.codemized.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByProject_Id(UUID projectId);

    Optional<Task> findByIdAndProject_Creator_Id(
            UUID taskId,
            UUID creatorId
    );

    boolean existsByProject_IdAndAssignee_Id(
            UUID projectId,
            UUID assigneeId
    );

    List<Task> findByAssignee_Id(UUID assigneeId);
}
