"use client";

import TaskComments from "./TaskComments";
import styles from "./project.module.css";

export default function TaskCard({
                                     task,
                                     isCreator,
                                     currentUser,
                                     members,
                                     selectedUser,
                                     setSelectedUser,
                                     handleAssignUser,
                                     handleStatusChange,
                                     handleEditTask,
                                     handleDeleteTask,
                                     comments,
                                     commentValue,
                                     setCommentValue,
                                     handleCreateComment,
                                     handleEditComment,
                                     handleDeleteComment,
                                 }) {
    const getAssigneeName = () => {
        if (!task.assigneeId) {
            return "Sin responsable";
        }

        const member = members.find(
            (member) =>
                member.id === task.assigneeId
        );

        return member
            ? member.name
            : "Usuario no encontrado";
    };

    const canChangeStatus =
        isCreator ||
        task.assigneeId === currentUser?.id;

    return (
        <article className={styles.taskCard}>

            <div className={styles.taskTop}>

                <div>
                    <h3 className={styles.taskTitle}>
                        {task.title}
                    </h3>

                    <p className={styles.taskDescription}>
                        {task.description ||
                            "Sin descripción"}
                    </p>
                </div>

            </div>

            <div className={styles.taskMeta}>

                {canChangeStatus ? (
                    <div>
                        <label>
                            Estado
                        </label>

                        <select
                            value={task.status}
                            onChange={(event) =>
                                handleStatusChange(
                                    task.id,
                                    event.target.value
                                )
                            }
                        >
                            <option value="PENDIENTE">
                                PENDIENTE
                            </option>

                            <option value="EN_PROGRESO">
                                EN PROGRESO
                            </option>

                            <option value="COMPLETADA">
                                COMPLETADA
                            </option>
                        </select>
                    </div>
                ) : (
                    <p>
                        Estado: {task.status}
                    </p>
                )}

                <p>
                    Responsable:{" "}
                    <strong>
                        {getAssigneeName()}
                    </strong>
                </p>

            </div>

            {isCreator && (
                <div className={styles.taskActions}>

                    <select
                        value={selectedUser || ""}
                        onChange={(event) =>
                            setSelectedUser(
                                event.target.value
                            )
                        }
                    >
                        <option value="">
                            Sin responsable
                        </option>

                        {members.map((member) => (
                            <option
                                key={member.id}
                                value={member.id}
                            >
                                {member.name} - {member.email}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() =>
                            handleAssignUser(task.id)
                        }
                    >
                        Asignar responsable
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleEditTask(task)
                        }
                    >
                        Editar tarea
                    </button>

                    <button
                        type="button"
                        className={styles.dangerButton}
                        onClick={() =>
                            handleDeleteTask(task)
                        }
                    >
                        Eliminar tarea
                    </button>

                </div>
            )}

            <TaskComments
                task={task}
                comments={comments}
                currentUser={currentUser}
                commentValue={commentValue}
                setCommentValue={setCommentValue}
                handleCreateComment={
                    handleCreateComment
                }
                handleEditComment={
                    handleEditComment
                }
                handleDeleteComment={
                    handleDeleteComment
                }
            />

        </article>
    );
}