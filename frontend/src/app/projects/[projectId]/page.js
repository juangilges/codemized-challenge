"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectPage() {
    const router = useRouter();
    const params = useParams();

    const projectId = params.projectId;

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadTasks = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/");
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    setMessage("No se pudieron cargar las tareas");
                    return;
                }

                const data = await response.json();

                setTasks(data);
            } catch (error) {
                setMessage("No se pudo conectar con el servidor");
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, [projectId, router]);

    if (loading) {
        return <p>Cargando tareas...</p>;
    }

    return (
        <main>
            <button onClick={() => router.push("/dashboard")}>
                Volver al dashboard
            </button>

            <h1>Tareas del proyecto</h1>

            {message && <p>{message}</p>}

            {tasks.length === 0 ? (
                <p>Este proyecto todavía no tiene tareas.</p>
            ) : (
                tasks.map((task) => (
                    <div key={task.id}>
                        <h2>{task.title}</h2>

                        <p>
                            {task.description || "Sin descripción"}
                        </p>

                        <p>Estado: {task.status}</p>

                        <hr />
                    </div>
                ))
            )}
        </main>
    );
}