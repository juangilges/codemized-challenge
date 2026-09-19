package com.codemized.backend.service;

import com.codemized.backend.dto.CreateTaskRequest;
import com.codemized.backend.dto.TaskResponse;
import com.codemized.backend.dto.UpdateTaskRequest;
import com.codemized.backend.dto.UpdateTaskStatusRequest;

import com.codemized.backend.exception.BadRequestException;
import com.codemized.backend.exception.ForbiddenException;
import com.codemized.backend.exception.ResourceNotFoundException;

import com.codemized.backend.model.Project;
import com.codemized.backend.model.Task;
import com.codemized.backend.model.User;

import com.codemized.backend.repository.ProjectRepository;
import com.codemized.backend.repository.TaskRepository;
import com.codemized.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskService(
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository) {

        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    // Crear tarea
    // Solo el creador del proyecto
    public TaskResponse createTask(
            UUID projectId,
            UUID userId,
            CreateTaskRequest request) {

        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Proyecto no encontrado"
                        )
                );

        if (!project.getCreator().getId().equals(userId)) {
            throw new ForbiddenException(
                    "No tienes permiso para crear tareas en este proyecto"
            );
        }

        Task task = new Task();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setProject(project);

        Task savedTask = taskRepository.save(task);

        return toResponse(savedTask);
    }

    // Listar tareas
    // Creador o participante del proyecto
    public List<TaskResponse> listTasks(
            UUID projectId,
            UUID userId) {

        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Proyecto no encontrado"
                        )
                );

        boolean isCreator =
                project.getCreator().getId().equals(userId);

        boolean isParticipant =
                taskRepository.existsByProject_IdAndAssignee_Id(
                        projectId,
                        userId
                );

        if (!isCreator && !isParticipant) {
            throw new ForbiddenException(
                    "No tienes acceso a este proyecto"
            );
        }

        return taskRepository
                .findByProject_Id(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Asignar, cambiar o quitar responsable
    // Solo el creador del proyecto
    public TaskResponse assignTask(
            UUID taskId,
            UUID userId,
            UUID assigneeId) {

        Task task = findTask(taskId);

        validateProjectCreator(task, userId);

        if (assigneeId == null) {

            task.setAssignee(null);

        } else {

            User assignee = userRepository
                    .findById(assigneeId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Usuario responsable no encontrado"
                            )
                    );

            task.setAssignee(assignee);
        }

        Task updatedTask = taskRepository.save(task);

        return toResponse(updatedTask);
    }

    // Cambiar estado
    // Creador del proyecto o responsable de esa tarea
    public TaskResponse updateStatus(
            UUID taskId,
            UUID userId,
            UpdateTaskStatusRequest request) {

        Task task = findTask(taskId);

        boolean isCreator =
                task.getProject()
                        .getCreator()
                        .getId()
                        .equals(userId);

        boolean isAssignee =
                task.getAssignee() != null
                        && task.getAssignee()
                        .getId()
                        .equals(userId);

        if (!isCreator && !isAssignee) {
            throw new ForbiddenException(
                    "No tienes permiso para cambiar el estado de esta tarea"
            );
        }

        if (request.getStatus() == null) {
            throw new BadRequestException(
                    "El estado de la tarea es obligatorio"
            );
        }

        task.setStatus(request.getStatus());

        Task updatedTask = taskRepository.save(task);

        return toResponse(updatedTask);
    }

    // Editar título y descripción
    // Solo el creador del proyecto
    public TaskResponse updateTask(
            UUID taskId,
            UUID userId,
            UpdateTaskRequest request) {

        Task task = findTask(taskId);

        validateProjectCreator(task, userId);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());

        Task updatedTask = taskRepository.save(task);

        return toResponse(updatedTask);
    }

    // Eliminar tarea
    // Solo el creador del proyecto
    public void deleteTask(
            UUID taskId,
            UUID userId) {

        Task task = findTask(taskId);

        validateProjectCreator(task, userId);

        taskRepository.delete(task);
    }

    // Busca una tarea o devuelve 404
    private Task findTask(UUID taskId) {

        return taskRepository
                .findById(taskId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tarea no encontrada"
                        )
                );
    }

    // Comprueba que el usuario sea creador del proyecto
    private void validateProjectCreator(
            Task task,
            UUID userId) {

        boolean isCreator =
                task.getProject()
                        .getCreator()
                        .getId()
                        .equals(userId);

        if (!isCreator) {
            throw new ForbiddenException(
                    "No tienes permiso para realizar esta operación"
            );
        }
    }

    // Convierte Task en TaskResponse
    private TaskResponse toResponse(Task task) {

        UUID assigneeId = null;

        if (task.getAssignee() != null) {
            assigneeId = task.getAssignee().getId();
        }

        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getProject().getId(),
                assigneeId,
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }

    public List<TaskResponse> listAssignedTasks(UUID userId) {

        return taskRepository.findByAssignee_Id(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

}