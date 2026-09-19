package com.codemized.backend.service;

import com.codemized.backend.dto.CreateProjectRequest;
import com.codemized.backend.dto.CreateProjectResponse;
import com.codemized.backend.dto.ProjectResponse;
import com.codemized.backend.dto.UpdateProjectRequest;

import com.codemized.backend.exception.BadRequestException;
import com.codemized.backend.exception.ForbiddenException;
import com.codemized.backend.exception.ResourceNotFoundException;

import com.codemized.backend.model.Project;
import com.codemized.backend.model.User;

import com.codemized.backend.repository.ProjectRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // Crear proyecto
    public CreateProjectResponse createProject(
            User creator,
            CreateProjectRequest request) {

        if (request.getName() == null
                || request.getName().isBlank()) {

            throw new BadRequestException(
                    "El nombre del proyecto es obligatorio"
            );
        }

        Project project = new Project();

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setCreator(creator);

        Project savedProject =
                projectRepository.save(project);

        return new CreateProjectResponse(
                savedProject.getId(),
                savedProject.getName(),
                savedProject.getDescription(),
                savedProject.getCreator().getId(),
                savedProject.getCreatedAt()
        );
    }

    // Listar los proyectos creados por el usuario
    public List<ProjectResponse> listProjects(
            UUID creatorId) {

        return projectRepository
                .findByCreator_Id(creatorId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Editar proyecto
    // Solo el creador
    public ProjectResponse updateProject(
            UUID projectId,
            UUID userId,
            UpdateProjectRequest request) {

        Project project = findProject(projectId);

        validateProjectCreator(project, userId);

        if (request.getName() == null
                || request.getName().isBlank()) {

            throw new BadRequestException(
                    "El nombre del proyecto es obligatorio"
            );
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project updatedProject =
                projectRepository.save(project);

        return toResponse(updatedProject);
    }

    // Eliminar proyecto
    // Solo el creador
    public void deleteProject(
            UUID projectId,
            UUID userId) {

        Project project = findProject(projectId);

        validateProjectCreator(project, userId);

        projectRepository.delete(project);
    }

    // Buscar proyecto o devolver 404
    private Project findProject(UUID projectId) {

        return projectRepository
                .findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Proyecto no encontrado"
                        )
                );
    }

    // Comprobar que el usuario sea el creador
    private void validateProjectCreator(
            Project project,
            UUID userId) {

        boolean isCreator =
                project.getCreator()
                        .getId()
                        .equals(userId);

        if (!isCreator) {
            throw new ForbiddenException(
                    "No tienes permiso para modificar este proyecto"
            );
        }
    }

    // Convertir Project en ProjectResponse
    private ProjectResponse toResponse(
            Project project) {

        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getCreator().getId(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}