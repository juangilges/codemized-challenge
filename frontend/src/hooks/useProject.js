"use client";

import { useEffect, useState } from "react";

export default function useProject({
                                       projectId,
                                       router,
                                       setMessage,
                                       setInitialTasks,
                                       setInitialMembers,
                                       setInitialComments,
                                   }) {
    const [project, setProject] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProject = async () => {
            const token =
                localStorage.getItem("token");

            if (!token) {
                router.push("/");
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            setLoading(true);

            try {
                const [
                    tasksResponse,
                    membersResponse,
                    userResponse,
                    projectResponse,
                ] = await Promise.all([
                    fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`,
                        {
                            method: "GET",
                            headers,
                        }
                    ),

                    fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/members`,
                        {
                            method: "GET",
                            headers,
                        }
                    ),

                    fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
                        {
                            method: "GET",
                            headers,
                        }
                    ),

                    fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
                        {
                            method: "GET",
                            headers,
                        }
                    ),
                ]);

                if (
                    !tasksResponse.ok ||
                    !membersResponse.ok ||
                    !userResponse.ok ||
                    !projectResponse.ok
                ) {
                    setMessage(
                        "No se pudo cargar el proyecto"
                    );

                    return;
                }

                const tasksData =
                    await tasksResponse.json();

                const membersData =
                    await membersResponse.json();

                const userData =
                    await userResponse.json();

                const projectData =
                    await projectResponse.json();

                setInitialTasks(tasksData);
                setInitialMembers(membersData);

                setCurrentUser(userData);
                setProject(projectData);

                const commentsEntries =
                    await Promise.all(
                        tasksData.map(
                            async (task) => {
                                const response =
                                    await fetch(
                                        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}/comments`,
                                        {
                                            method: "GET",
                                            headers,
                                        }
                                    );

                                if (!response.ok) {
                                    return [
                                        task.id,
                                        [],
                                    ];
                                }

                                const comments =
                                    await response.json();

                                return [
                                    task.id,
                                    comments,
                                ];
                            }
                        )
                    );

                setInitialComments(
                    Object.fromEntries(
                        commentsEntries
                    )
                );

            } catch (error) {
                setMessage(
                    "No se pudo conectar con el servidor"
                );

            } finally {
                setLoading(false);
            }
        };

        loadProject();

    }, [projectId, router]);

    const isCreator =
        currentUser &&
        project &&
        currentUser.id === project.creatorId;

    const handleEditProject = async () => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            router.push("/");
            return;
        }

        const newName =
            window.prompt(
                "Nuevo nombre del proyecto",
                project.name
            );

        if (newName === null) {
            return;
        }

        if (!newName.trim()) {
            setMessage(
                "El nombre del proyecto es obligatorio"
            );

            return;
        }

        const newDescription =
            window.prompt(
                "Nueva descripción del proyecto",
                project.description || ""
            );

        if (newDescription === null) {
            return;
        }

        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: newName,
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
                    "No se pudo editar el proyecto"
                );

                return;
            }

            const updatedProject =
                await response.json();

            setProject(updatedProject);

            setMessage(
                "Proyecto editado correctamente"
            );

        } catch (error) {
            setMessage(
                "No se pudo conectar con el servidor"
            );
        }
    };

    const handleDeleteProject = async () => {
        const confirmed =
            window.confirm(
                `¿Querés eliminar el proyecto "${project.name}"? Esta acción eliminará también sus tareas, comentarios y membresías.`
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
                `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
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
                    "No se pudo eliminar el proyecto"
                );

                return;
            }

            router.push("/dashboard");

        } catch (error) {
            setMessage(
                "No se pudo conectar con el servidor"
            );
        }
    };

    return {
        project,
        currentUser,
        loading,
        isCreator,
        handleEditProject,
        handleDeleteProject,
    };
}