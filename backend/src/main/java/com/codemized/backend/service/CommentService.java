package com.codemized.backend.service;

import com.codemized.backend.dto.CommentResponse;
import com.codemized.backend.dto.CreateCommentRequest;
import com.codemized.backend.dto.UpdateCommentRequest;

import com.codemized.backend.exception.BadRequestException;
import com.codemized.backend.exception.ForbiddenException;
import com.codemized.backend.exception.ResourceNotFoundException;

import com.codemized.backend.model.Comment;
import com.codemized.backend.model.Task;
import com.codemized.backend.model.User;

import com.codemized.backend.repository.CommentRepository;
import com.codemized.backend.repository.ProjectMemberRepository;
import com.codemized.backend.repository.TaskRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public CommentService(
            CommentRepository commentRepository,
            TaskRepository taskRepository,
            ProjectMemberRepository projectMemberRepository) {

        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    // Crear comentario
    // Creador o miembro del proyecto
    public CommentResponse createComment(
            UUID taskId,
            User author,
            CreateCommentRequest request) {

        Task task = findTask(taskId);

        validateProjectAccess(
                task,
                author.getId()
        );

        if (request.getContent() == null
                || request.getContent().isBlank()) {

            throw new BadRequestException(
                    "El contenido del comentario es obligatorio"
            );
        }

        Comment comment = new Comment();

        comment.setContent(request.getContent());
        comment.setTask(task);
        comment.setAuthor(author);

        Comment savedComment =
                commentRepository.save(comment);

        return toResponse(savedComment);
    }

    // Listar comentarios
    // Creador o miembro del proyecto
    public List<CommentResponse> listComments(
            UUID taskId,
            UUID userId) {

        Task task = findTask(taskId);

        validateProjectAccess(
                task,
                userId
        );

        return commentRepository
                .findByTask_Id(taskId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Editar comentario
    // Solo el autor
    public CommentResponse updateComment(
            UUID commentId,
            UUID userId,
            UpdateCommentRequest request) {

        Comment comment =
                findComment(commentId);

        validateAuthor(
                comment,
                userId
        );

        if (request.getContent() == null
                || request.getContent().isBlank()) {

            throw new BadRequestException(
                    "El contenido del comentario es obligatorio"
            );
        }

        comment.setContent(
                request.getContent()
        );

        Comment updatedComment =
                commentRepository.save(comment);

        return toResponse(updatedComment);
    }

    // Eliminar comentario
    // Solo el autor
    public void deleteComment(
            UUID commentId,
            UUID userId) {

        Comment comment =
                findComment(commentId);

        validateAuthor(
                comment,
                userId
        );

        commentRepository.delete(comment);
    }

    // Buscar tarea o devolver 404
    private Task findTask(UUID taskId) {

        return taskRepository
                .findById(taskId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tarea no encontrada"
                        )
                );
    }

    // Buscar comentario o devolver 404
    private Comment findComment(
            UUID commentId) {

        return commentRepository
                .findById(commentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Comentario no encontrado"
                        )
                );
    }

    // Verificar acceso al proyecto
    // Debe ser creador o miembro
    private void validateProjectAccess(
            Task task,
            UUID userId) {

        UUID projectId =
                task.getProject()
                        .getId();

        boolean isCreator =
                task.getProject()
                        .getCreator()
                        .getId()
                        .equals(userId);

        boolean isMember =
                projectMemberRepository
                        .existsByProject_IdAndUser_Id(
                                projectId,
                                userId
                        );

        if (!isCreator && !isMember) {
            throw new ForbiddenException(
                    "No tienes acceso a este proyecto"
            );
        }
    }

    // Verificar que sea autor del comentario
    private void validateAuthor(
            Comment comment,
            UUID userId) {

        boolean isAuthor =
                comment.getAuthor()
                        .getId()
                        .equals(userId);

        if (!isAuthor) {
            throw new ForbiddenException(
                    "No tienes permiso para modificar este comentario"
            );
        }
    }

    // Convertir Comment a CommentResponse
    private CommentResponse toResponse(
            Comment comment) {

        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getTask().getId(),
                comment.getAuthor().getId(),
                comment.getAuthor().getName(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}