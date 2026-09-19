package com.codemized.backend.controller;

import com.codemized.backend.dto.CreateProjectRequest;
import com.codemized.backend.dto.CreateProjectResponse;
import com.codemized.backend.dto.ProjectResponse;
import com.codemized.backend.dto.UpdateProjectRequest;
import com.codemized.backend.model.User;
import com.codemized.backend.service.ProjectService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // Crear proyecto
    @PostMapping
    public ResponseEntity<CreateProjectResponse> createProject(
            Authentication authentication,
            @Valid @RequestBody CreateProjectRequest request) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        CreateProjectResponse response =
                projectService.createProject(
                        authenticatedUser,
                        request
                );

        return ResponseEntity.ok(response);
    }

    // Listar proyectos del usuario autenticado
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> listProjects(
            Authentication authentication) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        List<ProjectResponse> response =
                projectService.listProjects(
                        authenticatedUser.getId()
                );

        return ResponseEntity.ok(response);
    }

    // Editar proyecto
    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable UUID projectId,
            Authentication authentication,
            @Valid @RequestBody UpdateProjectRequest request) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        ProjectResponse response =
                projectService.updateProject(
                        projectId,
                        authenticatedUser.getId(),
                        request
                );

        return ResponseEntity.ok(response);
    }

    // Eliminar proyecto
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable UUID projectId,
            Authentication authentication) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        projectService.deleteProject(
                projectId,
                authenticatedUser.getId()
        );

        return ResponseEntity.noContent().build();
    }
}