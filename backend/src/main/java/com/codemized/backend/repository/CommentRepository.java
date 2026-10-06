package com.codemized.backend.repository;

import com.codemized.backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

    List<Comment> findByTask_Id(UUID taskId);

    Optional<Comment> findByIdAndAuthor_Id(
            UUID commentId,
            UUID authorId
    );

    void deleteByTask_Id(UUID taskId);
}