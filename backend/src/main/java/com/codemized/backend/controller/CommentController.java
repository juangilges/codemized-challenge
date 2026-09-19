package com.codemized.backend.controller;

import com.codemized.backend.dto.CommentResponse;
import com.codemized.backend.dto.CreateCommentRequest;
import com.codemized.backend.dto.UpdateCommentRequest;
import com.codemized.backend.model.User;
import com.codemized.backend.service.CommentService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // Crear comentario
    // Puede hacerlo el creador o un participante del proyecto
    @PostMapping("/tasks/{taskId}/comments")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable UUID taskId,
            Authentication authentication,
            @Valid @RequestBody CreateCommentRequest request) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        CommentResponse response =
                commentService.createComment(
                        taskId,
                        authenticatedUser,
                        request
                );

        return ResponseEntity.ok(response);
    }

    // Listar comentarios de una tarea
    // Puede hacerlo el creador o un participante del proyecto
    @GetMapping("/tasks/{taskId}/comments")
    public ResponseEntity<List<CommentResponse>> listComments(
            @PathVariable UUID taskId,
            Authentication authentication) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        List<CommentResponse> response =
                commentService.listComments(
                        taskId,
                        authenticatedUser.getId()
                );

        return ResponseEntity.ok(response);
    }

    // Editar comentario
    // Solo puede hacerlo el autor
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable UUID commentId,
            Authentication authentication,
            @Valid @RequestBody UpdateCommentRequest request) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        CommentResponse response =
                commentService.updateComment(
                        commentId,
                        authenticatedUser.getId(),
                        request
                );

        return ResponseEntity.ok(response);
    }

    // Eliminar comentario
    // Solo puede hacerlo el autor
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable UUID commentId,
            Authentication authentication) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        commentService.deleteComment(
                commentId,
                authenticatedUser.getId()
        );

        return ResponseEntity.noContent().build();
    }
}