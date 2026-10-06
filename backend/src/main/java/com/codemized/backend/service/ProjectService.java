package com.codemized.backend.service;

import com.codemized.backend.dto.CreateProjectRequest;
import com.codemized.backend.dto.CreateProjectResponse;
import com.codemized.backend.dto.ProjectMemberResponse;
import com.codemized.backend.dto.ProjectResponse;
import com.codemized.backend.dto.UpdateProjectRequest;

import com.codemized.backend.exception.BadRequestException;
import com.codemized.backend.exception.ForbiddenException;
import com.codemized.backend.exception.ResourceNotFoundException;

import com.codemized.backend.model.Project;
import com.codemized.backend.model.ProjectMember;
import com.codemized.backend.model.Task;
import com.codemized.backend.model.User;

import com.codemized.backend.repository.CommentRepository;
import com.codemized.backend.repository.ProjectMemberRepository;
import com.codemized.backend.repository.ProjectRepository;
import com.codemized.backend.repository.TaskRepository;
import com.codemized.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;

    public ProjectService(
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            UserRepository userRepository,
            TaskRepository taskRepository,
            CommentRepository commentRepository) {

        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.commentRepository = commentRepository;
    }

    // Crear proyecto
    @Transactional
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

        ProjectMember creatorMember =
                new ProjectMember();

        creatorMember.setProject(savedProject);
        creatorMember.setUser(creator);

        projectMemberRepository.save(
                creatorMember
        );

        return new CreateProjectResponse(
                savedProject.getId(),
                savedProject.getName(),
                savedProject.getDescription(),
                savedProject.getCreator().getId(),
                savedProject.getCreatedAt()
        );
    }

    // Listar proyectos a los que pertenece el usuario
    public List<ProjectResponse> listProjects(
            UUID userId) {

        return projectMemberRepository
                .findByUser_Id(userId)
                .stream()
                .map(ProjectMember::getProject)
                .map(this::toResponse)
                .toList();
    }

    // Agregar miembro
    @Transactional
    public ProjectMemberResponse addMember(
            UUID projectId,
            UUID authenticatedUserId,
            String emailToAdd) {

        Project project =
                findProject(projectId);

        validateProjectCreator(
                project,
                authenticatedUserId
        );

        if (emailToAdd == null
                || emailToAdd.isBlank()) {

            throw new BadRequestException(
                    "El email es obligatorio"
            );
        }

        String normalizedEmail =
                emailToAdd
                        .trim()
                        .toLowerCase();

        User userToAdd =
                userRepository
                        .findByEmail(normalizedEmail)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Usuario no encontrado"
                                )
                        );

        boolean alreadyMember =
                projectMemberRepository
                        .existsByProject_IdAndUser_Id(
                                projectId,
                                userToAdd.getId()
                        );

        if (alreadyMember) {
            throw new BadRequestException(
                    "El usuario ya pertenece al proyecto"
            );
        }

        ProjectMember projectMember =
                new ProjectMember();

        projectMember.setProject(project);
        projectMember.setUser(userToAdd);

        projectMemberRepository.save(
                projectMember
        );

        return toMemberResponse(
                userToAdd
        );
    }

    // Listar miembros
    public List<ProjectMemberResponse> listMembers(
            UUID projectId,
            UUID authenticatedUserId) {

        Project project =
                findProject(projectId);

        boolean isCreator =
                project.getCreator()
                        .getId()
                        .equals(authenticatedUserId);

        boolean isMember =
                projectMemberRepository
                        .existsByProject_IdAndUser_Id(
                                projectId,
                                authenticatedUserId
                        );

        if (!isCreator && !isMember) {
            throw new ForbiddenException(
                    "No tienes acceso a los miembros de este proyecto"
            );
        }

        return projectMemberRepository
                .findByProject_Id(projectId)
                .stream()
                .map(ProjectMember::getUser)
                .map(this::toMemberResponse)
                .toList();
    }

    // Quitar miembro
    @Transactional
    public void removeMember(
            UUID projectId,
            UUID authenticatedUserId,
            UUID userIdToRemove) {

        Project project =
                findProject(projectId);

        validateProjectCreator(
                project,
                authenticatedUserId
        );

        if (project.getCreator()
                .getId()
                .equals(userIdToRemove)) {

            throw new BadRequestException(
                    "El creador no puede ser eliminado del proyecto"
            );
        }

        ProjectMember member =
                projectMemberRepository
                        .findByProject_IdAndUser_Id(
                                projectId,
                                userIdToRemove
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "El usuario no pertenece al proyecto"
                                )
                        );

        boolean hasAssignedTasks =
                taskRepository
                        .existsByProject_IdAndAssignee_Id(
                                projectId,
                                userIdToRemove
                        );

        if (hasAssignedTasks) {
            throw new BadRequestException(
                    "No puedes eliminar este miembro porque tiene tareas asignadas"
            );
        }

        projectMemberRepository.delete(
                member
        );
    }

    // Obtener proyecto
    public ProjectResponse getProject(
            UUID projectId,
            UUID userId) {

        Project project =
                findProject(projectId);

        boolean isCreator =
                project.getCreator()
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

        return toResponse(project);
    }

    // Editar proyecto
    public ProjectResponse updateProject(
            UUID projectId,
            UUID userId,
            UpdateProjectRequest request) {

        Project project =
                findProject(projectId);

        validateProjectCreator(
                project,
                userId
        );

        if (request.getName() == null
                || request.getName().isBlank()) {

            throw new BadRequestException(
                    "El nombre del proyecto es obligatorio"
            );
        }

        project.setName(
                request.getName()
        );

        project.setDescription(
                request.getDescription()
        );

        Project updatedProject =
                projectRepository.save(project);

        return toResponse(
                updatedProject
        );
    }

    // Eliminar proyecto completo
    // Solo el creador
    @Transactional
    public void deleteProject(
            UUID projectId,
            UUID userId) {

        Project project =
                findProject(projectId);

        validateProjectCreator(
                project,
                userId
        );

        List<Task> projectTasks =
                taskRepository.findByProject_Id(
                        projectId
                );

        // Primero eliminamos comentarios
        for (Task task : projectTasks) {

            commentRepository
                    .deleteByTask_Id(
                            task.getId()
                    );
        }

        // Después eliminamos tareas
        taskRepository.deleteAll(
                projectTasks
        );

        // Después eliminamos miembros
        List<ProjectMember> projectMembers =
                projectMemberRepository
                        .findByProject_Id(
                                projectId
                        );

        projectMemberRepository.deleteAll(
                projectMembers
        );

        // Finalmente eliminamos el proyecto
        projectRepository.delete(
                project
        );
    }

    private Project findProject(
            UUID projectId) {

        return projectRepository
                .findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Proyecto no encontrado"
                        )
                );
    }

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

    private ProjectMemberResponse toMemberResponse(
            User user) {

        return new ProjectMemberResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }

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