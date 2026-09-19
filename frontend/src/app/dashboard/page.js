"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const loadProjects = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/");
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/projects`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    setMessage("No se pudieron cargar los proyectos");
                    return;
                }

                const data = await response.json();

                setProjects(data);
            } catch (error) {
                setMessage("No se pudo conectar con el servidor");
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, [router]);

    const handleCreateProject = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/");
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
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: projectName,
                        description: projectDescription,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "No se pudo crear el proyecto");
                return;
            }

            setProjects((currentProjects) => [
                ...currentProjects,
                data,
            ]);

            setProjectName("");
            setProjectDescription("");

            setMessage("Proyecto creado correctamente");
        } catch (error) {
            setMessage("No se pudo conectar con el servidor");
        } finally {
            setCreating(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    if (loading) {
        return <p>Cargando proyectos...</p>;
    }

    return (
        <main>
            <h1>Dashboard</h1>

            <button onClick={handleLogout}>
                Cerrar sesión
            </button>

            <hr />

            <h2>Crear proyecto</h2>

            <form onSubmit={handleCreateProject}>
                <div>
                    <label htmlFor="projectName">
                        Nombre del proyecto
                    </label>

                    <br />

                    <input
                        id="projectName"
                        type="text"
                        value={projectName}
                        onChange={(event) =>
                            setProjectName(event.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="projectDescription">
                        Descripción
                    </label>

                    <br />

                    <textarea
                        id="projectDescription"
                        value={projectDescription}
                        onChange={(event) =>
                            setProjectDescription(event.target.value)
                        }
                    />
                </div>

                <br />

                <button type="submit" disabled={creating}>
                    {creating ? "Creando..." : "Crear proyecto"}
                </button>
            </form>

            {message && <p>{message}</p>}

            <hr />

            <h2>Mis proyectos</h2>

            {projects.length === 0 ? (
                <p>No tenés proyectos creados.</p>
            ) : (
                projects.map((project) => (
                    <div key={project.id}>
                        <h3>{project.name}</h3>

                        <p>
                            {project.description || "Sin descripción"}
                        </p>

                        <button
                            onClick={() =>
                                router.push(`/projects/${project.id}`)
                            }
                        >
                            Ver proyecto
                        </button>

                        <hr />
                    </div>
                ))
            )}
        </main>
    );
}