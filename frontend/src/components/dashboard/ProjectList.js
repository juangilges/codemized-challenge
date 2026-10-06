"use client";

import styles from "./dashboard.module.css";

export default function ProjectList({
                                        projects,
                                        router,
                                    }) {
    return (
        <div>

            <div className={styles.projectsHeader}>
                <h2>Mis proyectos</h2>

                <p>
                    Proyectos que creaste o de los que sos miembro.
                </p>
            </div>

            {projects.length === 0 ? (

                <div className={styles.emptyState}>
                    <p>
                        No pertenecés a ningún proyecto todavía.
                    </p>
                </div>

            ) : (

                <div className={styles.projectGrid}>

                    {projects.map((project) => (

                        <article
                            key={project.id}
                            className={styles.projectCard}
                        >

                            <h3>
                                {project.name}
                            </h3>

                            <p
                                className={
                                    styles.projectDescription
                                }
                            >
                                {project.description ||
                                    "Sin descripción"}
                            </p>

                            <button
                                type="button"
                                className={
                                    styles.projectButton
                                }
                                onClick={() =>
                                    router.push(
                                        `/projects/${project.id}`
                                    )
                                }
                            >
                                Ver proyecto
                            </button>

                        </article>

                    ))}

                </div>
            )}

        </div>
    );
}