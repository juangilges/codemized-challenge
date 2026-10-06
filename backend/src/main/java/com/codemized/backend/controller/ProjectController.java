package com.codemized.backend.controller;

import com.codemized.backend.dto.AddProjectMemberRequest;
import com.codemized.backend.dto.CreateProjectRequest;
import com.codemized.backend.dto.CreateProjectResponse;
import com.codemized.backend.dto.ProjectMemberResponse;
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

    public ProjectController(
            ProjectService projectService) {

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

    // Obtener un proyecto específico
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(
            @PathVariable UUID projectId,
            Authentication authentication) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        ProjectResponse response =
                projectService.getProject(
                        projectId,
                        authenticatedUser.getId()
                );

        return ResponseEntity.ok(response);
    }

    // Agregar miembro al proyecto
    @PostMapping("/{projectId}/members")
    public ResponseEntity<ProjectMemberResponse> addMember(
            @PathVariable UUID projectId,
            Authentication authentication,
            @Valid @RequestBody AddProjectMemberRequest request) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        ProjectMemberResponse response =
                projectService.addMember(
                        projectId,
                        authenticatedUser.getId(),
                        request.getEmail()
                );

        return ResponseEntity.ok(response);
    }

    // Listar miembros del proyecto
    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<ProjectMemberResponse>> listMembers(
            @PathVariable UUID projectId,
            Authentication authentication) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        List<ProjectMemberResponse> response =
                projectService.listMembers(
                        projectId,
                        authenticatedUser.getId()
                );

        return ResponseEntity.ok(response);
    }

    // Eliminar miembro del proyecto
    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            Authentication authentication) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        projectService.removeMember(
                projectId,
                authenticatedUser.getId(),
                userId
        );

        return ResponseEntity.noContent().build();
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