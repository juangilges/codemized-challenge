package com.codemized.backend.repository;

import com.codemized.backend.model.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectMemberRepository
        extends JpaRepository<ProjectMember, UUID> {

    List<ProjectMember> findByProject_Id(UUID projectId);

    List<ProjectMember> findByUser_Id(UUID userId);

    boolean existsByProject_IdAndUser_Id(
            UUID projectId,
            UUID userId
    );

    Optional<ProjectMember> findByProject_IdAndUser_Id(
            UUID projectId,
            UUID userId
    );
}