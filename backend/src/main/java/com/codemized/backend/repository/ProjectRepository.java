package com.codemized.backend.repository;

import com.codemized.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByCreator_Id(UUID creatorId);

    Optional<Project> findByIdAndCreator_Id(
            UUID projectId,
            UUID creatorId
    );
}