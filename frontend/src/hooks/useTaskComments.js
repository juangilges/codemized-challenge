"use client";

import { useState } from "react";

export default function useTaskComments({
                                            router,
                                            setMessage,
                                        }) {
    const [commentsByTask, setCommentsByTask] =
        useState({});

    const [commentInputs, setCommentInputs] =
        useState({});

    const setInitialComments = (comments) => {
        setCommentsByTask(comments);
    };

    const initializeTaskComments = (taskId) => {
        setCommentsByTask((current) => ({
            ...current,
            [taskId]: [],
        }));
    };

    const removeTaskComments = (taskId) => {
        setCommentsByTask((current) => {
            const updated = { ...current };

            delete updated[taskId];

            return updated;
        });

        setCommentInputs((current) => {
            const updated = { ...current };

            delete updated[taskId];

            return updated;
        });
    };

    const setCommentValue = (
        taskId,
        value
    ) => {
        setCommentInputs((current) => ({
            ...current,
            [taskId]: value,
        }));
    };

    const handleCreateComment = async (
        event,
        taskId
    ) => {
        event.preventDefault();

        const token =
            localStorage.getItem("token");

        if (!token) {
            router.push("/");
            return;
        }

        const content =
            commentInputs[taskId]?.trim();

        if (!content) {
            setMessage(
                "El comentario no puede estar vacío"
            );

            return;
        }

        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        content,
                    }),
                }
            );

            if (!response.ok) {
                setMessage(
                    "No se pudo crear el comentario"
                );

                return;
            }

            const newComment =
                await response.json();

            setCommentsByTask(
                (current) => ({
                    ...current,
                    [taskId]: [
                        ...(current[taskId] || []),
                        newComment,
                    ],
                })
            );

            setCommentInputs(
                (current) => ({
                    ...current,
                    [taskId]: "",
                })
            );

            setMessage(
                "Comentario agregado correctamente"
            );

        } catch (error) {
            setMessage(
                "No se pudo conectar con el servidor"
            );
        }
    };

    const handleEditComment = async (
        comment
    ) => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            router.push("/");
            return;
        }

        const newContent =
            window.prompt(
                "Editar comentario",
                comment.content
            );

        if (newContent === null) {
            return;
        }

        if (!newContent.trim()) {
            setMessage(
                "El comentario no puede estar vacío"
            );

            return;
        }

        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/comments/${comment.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        content: newContent,
                    }),
                }
            );

            if (!response.ok) {
                setMessage(
                    "No se pudo editar el comentario"
                );

                return;
            }

            const updatedComment =
                await response.json();

            setCommentsByTask(
                (current) => ({
                    ...current,
                    [comment.taskId]:
                        current[
                            comment.taskId
                            ].map((item) =>
                            item.id ===
                            comment.id
                                ? updatedComment
                                : item
                        ),
                })
            );

            setMessage(
                "Comentario editado correctamente"
            );

        } catch (error) {
            setMessage(
                "No se pudo conectar con el servidor"
            );
        }
    };

    const handleDeleteComment = async (
        comment
    ) => {
        const confirmed =
            window.confirm(
                "¿Querés eliminar este comentario?"
            );

        if (!confirmed) {
            return;
        }

        const token =
            localStorage.getItem("token");

        if (!token) {
            router.push("/");
            return;
        }

        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/comments/${comment.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                setMessage(
                    "No se pudo eliminar el comentario"
                );

                return;
            }

            setCommentsByTask(
                (current) => ({
                    ...current,
                    [comment.taskId]:
                        current[
                            comment.taskId
                            ].filter(
                            (item) =>
                                item.id !==
                                comment.id
                        ),
                })
            );

            setMessage(
                "Comentario eliminado correctamente"
            );

        } catch (error) {
            setMessage(
                "No se pudo conectar con el servidor"
            );
        }
    };

    return {
        commentsByTask,
        commentInputs,
        setInitialComments,
        initializeTaskComments,
        removeTaskComments,
        setCommentValue,
        handleCreateComment,
        handleEditComment,
        handleDeleteComment,
    };
}