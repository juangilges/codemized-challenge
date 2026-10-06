"use client";

export default function CreateTaskForm({
                                           title,
                                           setTitle,
                                           description,
                                           setDescription,
                                           creating,
                                           handleCreateTask,
                                       }) {
    return (
        <section>

            <h2>Crear nueva tarea</h2>

            <form onSubmit={handleCreateTask}>

                <div>
                    <label htmlFor="title">
                        Título
                    </label>

                    <br />

                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                        placeholder="Título de la tarea"
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="description">
                        Descripción
                    </label>

                    <br />

                    <textarea
                        id="description"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        placeholder="Descripción de la tarea"
                    />
                </div>

                <br />

                <button
                    type="submit"
                    disabled={creating}
                >
                    {creating
                        ? "Creando..."
                        : "Crear tarea"}
                </button>

            </form>

        </section>
    );
}