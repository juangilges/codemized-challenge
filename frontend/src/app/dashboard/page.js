"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import UserProfile from "../../components/dashboard/UserProfile";
import CreateProjectForm from "../../components/dashboard/CreateProjectForm";
import ProjectList from "../../components/dashboard/ProjectList";

import styles from "../../components/dashboard/dashboard.module.css";

export default function DashboardPage() {
    const router = useRouter();

    const [currentUser, setCurrentUser] = useState(null);
    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const loadDashboard = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/");
                return;
            }

            try {
                const [
                    projectsResponse,
                    userResponse,
                ] = await Promise.all([
                    fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/projects`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    ),

                    fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    ),
                ]);

                if (
                    !projectsResponse.ok ||
                    !userResponse.ok
                ) {
                    setMessage(
                        "No se pudo cargar el dashboard"
                    );

                    return;
                }

                const projectsData =
                    await projectsResponse.json();

                const userData =
                    await userResponse.json();

                setProjects(projectsData);
                setCurrentUser(userData);

            } catch (error) {
                setMessage(
                    "No se pudo conectar con el servidor"
                );

            } finally {
                setLoading(false);
            }
        };

        loadDashboard();

    }, [router]);

    const handleEditProfile = async () => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            router.push("/");
            return;
        }

        const newName = window.prompt(
            "Nuevo nombre",
            currentUser.name
        );

        if (newName === null) {
            return;
        }

        if (!newName.trim()) {
            setMessage(
                "El nombre es obligatorio"
            );

            return;
        }

        const newEmail = window.prompt(
            "Nuevo correo electrónico",
            currentUser.email
        );

        if (newEmail === null) {
            return;
        }

        if (!newEmail.trim()) {
            setMessage(
                "El correo electrónico es obligatorio"
            );

            return;
        }

        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
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
                        email: newEmail,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "No se pudo editar el perfil"
                );

                return;
            }

            const emailChanged =
                data.email !== currentUser.email;

            setCurrentUser(data);

            if (emailChanged) {
                localStorage.removeItem("token");

                window.alert(
                    "Perfil actualizado correctamente. Como cambiaste tu email, iniciá sesión nuevamente."
                );

                router.push("/");

                return;
            }

            setMessage(
                "Perfil actualizado correctamente"
            );

        } catch (error) {
            setMessage(
                "No se pudo conectar con el servidor"
            );
        }
    };

    const handleCreateProject = async (event) => {
        event.preventDefault();

        const token =
            localStorage.getItem("token");

        if (!token) {
            router.push("/");
            return;
        }

        if (!projectName.trim()) {
            setMessage(
                "El nombre del proyecto es obligatorio"
            );

            return;
        }

        setCreating(true);
        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/projects`,
                {
                    method: "POST",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        name: projectName,
                        description:
                        projectDescription,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "No se pudo crear el proyecto"
                );

                return;
            }

            setProjects((currentProjects) => [
                ...currentProjects,
                data,
            ]);

            setProjectName("");
            setProjectDescription("");

            setMessage(
                "Proyecto creado correctamente"
            );

        } catch (error) {
            setMessage(
                "No se pudo conectar con el servidor"
            );

        } finally {
            setCreating(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");

        router.push("/");
    };

    if (loading) {
        return (
            <p>
                Cargando dashboard...
            </p>
        );
    }

    return (
        <main className={styles.dashboard}>

            <header className={styles.header}>

                <div className={styles.headerText}>
                    <h1>
                        Dashboard
                    </h1>

                    <p className={styles.welcome}>
                        Hola, {currentUser?.name}
                    </p>
                </div>

                <button
                    type="button"
                    className={styles.logoutButton}
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </button>

            </header>

            <div className={styles.topGrid}>

                <UserProfile
                    currentUser={currentUser}
                    handleEditProfile={
                        handleEditProfile
                    }
                />

                <CreateProjectForm
                    projectName={projectName}
                    setProjectName={setProjectName}
                    projectDescription={
                        projectDescription
                    }
                    setProjectDescription={
                        setProjectDescription
                    }
                    creating={creating}
                    handleCreateProject={
                        handleCreateProject
                    }
                />

            </div>

            {message && (
                <p className={styles.message}>
                    {message}
                </p>
            )}

            <div className={styles.projectsSection}>
                <ProjectList
                    projects={projects}
                    router={router}
                />
            </div>

        </main>
    );
}