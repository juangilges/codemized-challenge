"use client";

export default function CreateProjectForm({
                                              projectName,
                                              setProjectName,
                                              projectDescription,
                                              setProjectDescription,
                                              creating,
                                              handleCreateProject,
                                          }) {
    return (
        <section>
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
                            setProjectName(
                                event.target.value
                            )
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
                            setProjectDescription(
                                event.target.value
                            )
                        }
                    />
                </div>

                <br />

                <button
                    type="submit"
                    disabled={creating}
                >
                    {creating
                        ? "Creando..."
                        : "Crear proyecto"}
                </button>
            </form>
        </section>
    );
}