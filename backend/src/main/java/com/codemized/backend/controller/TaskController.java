package com.codemized.backend.controller;

import com.codemized.backend.dto.AssignTaskRequest;
import com.codemized.backend.dto.CreateTaskRequest;
import com.codemized.backend.dto.TaskResponse;
import com.codemized.backend.dto.UpdateTaskRequest;
import com.codemized.backend.dto.UpdateTaskStatusRequest;
import com.codemized.backend.model.User;
import com.codemized.backend.service.TaskService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Crear tarea
    // Solo el creador del proyecto
    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable UUID projectId,
            Authentication authentication,
            @Valid @RequestBody CreateTaskRequest request) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        TaskResponse response =
                taskService.createTask(
                        projectId,
                        authenticatedUser.getId(),
                        request
                );

        return ResponseEntity.ok(response);
    }

    // Listar tareas del proyecto
    // Creador o participante del proyecto
    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskResponse>> listTasks(
            @PathVariable UUID projectId,
            Authentication authentication) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        List<TaskResponse> response =
                taskService.listTasks(
                        projectId,
                        authenticatedUser.getId()
                );

        return ResponseEntity.ok(response);
    }

    // Asignar, cambiar o quitar responsable
    // Solo el creador del proyecto
    @PatchMapping("/tasks/{taskId}/assignee")
    public ResponseEntity<TaskResponse> assignTask(
            @PathVariable UUID taskId,
            Authentication authentication,
            @Valid @RequestBody AssignTaskRequest request) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        TaskResponse response =
                taskService.assignTask(
                        taskId,
                        authenticatedUser.getId(),
                        request.getAssigneeId()
                );

        return ResponseEntity.ok(response);
    }

    // Cambiar estado
    // Creador del proyecto o responsable de esa tarea
    @PatchMapping("/tasks/{taskId}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable UUID taskId,
            Authentication authentication,
            @Valid @RequestBody UpdateTaskStatusRequest request) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        TaskResponse response =
                taskService.updateStatus(
                        taskId,
                        authenticatedUser.getId(),
                        request
                );

        return ResponseEntity.ok(response);
    }

    // Editar título y descripción
    // Solo el creador del proyecto
    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable UUID taskId,
            Authentication authentication,
            @Valid @RequestBody UpdateTaskRequest request) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        TaskResponse response =
                taskService.updateTask(
                        taskId,
                        authenticatedUser.getId(),
                        request
                );

        return ResponseEntity.ok(response);
    }

    // Eliminar tarea
    // Solo el creador del proyecto
    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable UUID taskId,
            Authentication authentication) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        taskService.deleteTask(
                taskId,
                authenticatedUser.getId()
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tasks/assigned-to-me")
    public ResponseEntity<List<TaskResponse>> listAssignedTasks(
            Authentication authentication) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                taskService.listAssignedTasks(
                        authenticatedUser.getId()
                )
        );
    }

}