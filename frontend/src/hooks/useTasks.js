"use client";

import { useState } from "react";

export default function useTasks({
                                     projectId,
                                     router,
                                     setMessage,
                                     initializeTaskComments,
                                     removeTaskComments,
                                 }) {
    const [tasks, setTasks] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState({});

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [creating, setCreating] = useState(false);

    const setInitialTasks = (tasksData) => {
        setTasks(tasksData);

        const initialSelections = {};

        tasksData.forEach((task) => {
            initialSelections[task.id] =
                task.assigneeId || "";
        });

        setSelectedUsers(initialSelections);
    };

    const setSelectedUser = (
        taskId,
        userId
    ) => {
        setSelectedUsers((current) => ({
            ...current,
            [taskId]: userId,
        }));
    };

    const handleCreateTask = async (event) => {
        event.preventDefault();

        const token =
            localStorage.getItem("token");

        if (!token) {
            router.push("/");
            return;
        }

        if (!title.trim()) {
            setMessage(
                "El título de la tarea es obligatorio"
            );
            return;
        }

        setCreating(true);
        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title,
                        description,
                    }),
                }
            );

            if (!response.ok) {
                const errorData =
                    await response
                        .json()
                        .catch(() => null);

                setMessage(
                    errorData?.message ||
                    "No se pudo crear la tarea"
                );

                return;
            }

            const newTask =
                await response.json();

            setTasks((currentTasks) => [
                ...currentTasks,
                newTask,
            ]);

            setSelectedUsers((current) => ({
                ...current,
                [newTask.id]: "",
            }));

            initializeTaskComments(
                newTask.id
            );

            setTitle("");
            setDescription("");

            setMessage(
                "Tarea creada correctamente"
            );

        } catch (error) {
            setMessage(
                "No se pudo conectar con el servidor"
            );

        } finally {
            setCreating(false);
        }
    };

    const handleEditTask = async (task) => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            router.push("/");
            return;
        }

        const newTitle =
            window.prompt(
                "Nuevo título de la tarea",
                task.title
            );

        if (newTitle === null) {
            return;
        }

        if (!newTitle.trim()) {
            setMessage(
                "El título de la tarea es obligatorio"
            );
            return;
        }

        const newDescription =
            window.prompt(
                "Nueva descripción de la tarea",
                task.description || ""
            );

        if (newDescription === null) {
            return;
        }

        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: newTitle,
                        description:
                        newDescription,
                    }),
                }
            );

            if (!response.ok) {
                const errorData =
                    await response
                        .json()
                        .catch(() => null);

                setMessage(
                    errorData?.message ||
                    "No se pudo editar la tarea"
                );

                return;
            }

            const updatedTask =
                await response.json();

            setTasks((currentTasks) =>
                currentTasks.map(
                    (currentTask) =>
                        currentTask.id ===
                        task.id
                            ? updatedTask
                            : currentTask
                )
            );

            setMessage(
                "Tarea editada correctamente"
            );

        } catch (error) {
            setMessage(
                "No se pudo conectar con el servidor"
            );
        }
    };

    const handleDeleteTask = async (task) => {
        const confirmed =
            window.confirm(
                `¿Querés eliminar la tarea "${task.title}"?`
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
                `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData =
                    await response
                        .json()
                        .catch(() => null);

                setMessage(
                    errorData?.message ||
                    "No se pudo eliminar la tarea"
                );

                return;
            }

            setTasks((currentTasks) =>
                currentTasks.filter(
                    (currentTask) =>
                        currentTask.id !== task.id
                )
            );

            setSelectedUsers((current) => {
                const updated = {
                    ...current,
                };

                delete updated[task.id];

                return updated;
            });

            removeTaskComments(task.id);

            setMessage(
                "Tarea eliminada correctamente"
            );

        } catch (error) {
            setMessage(
                "No se pudo conectar con el servidor"
            );
        }
    };

    const handleAssignUser = async (taskId) => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            router.push("/");
            return;
        }

        const assigneeId =
            selectedUsers[taskId] || null;

        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/assignee`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        assigneeId,
                    }),
                }
            );

            if (!response.ok) {
                const errorData =
                    await response
                        .json()
                        .catch(() => null);

                setMessage(
                    errorData?.message ||
                    "No se pudo asignar el responsable"
                );

                return;
            }

            const updatedTask =
                await response.json();

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === taskId
                        ? updatedTask
                        : task
                )
            );

            setMessage(
                "Responsable actualizado correctamente"
            );

        } catch (error) {
            setMessage(
                "No se pudo conectar con el servidor"
            );
        }
    };

    const handleStatusChange = async (
        taskId,
        newStatus
    ) => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            router.push("/");
            return;
        }

        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            if (!response.ok) {
                const errorData =
                    await response
                        .json()
                        .catch(() => null);

                setMessage(
                    errorData?.message ||
                    "No se pudo cambiar el estado de la tarea"
                );

                return;
            }

            const updatedTask =
                await response.json();

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === taskId
                        ? updatedTask
                        : task
                )
            );

            setMessage(
                "Estado actualizado correctamente"
            );

        } catch (error) {
            setMessage(
                "No se pudo conectar con el servidor"
            );
        }
    };

    return {
        tasks,
        selectedUsers,
        title,
        setTitle,
        description,
        setDescription,
        creating,
        setInitialTasks,
        setSelectedUser,
        handleCreateTask,
        handleEditTask,
        handleDeleteTask,
        handleAssignUser,
        handleStatusChange,
    };
}