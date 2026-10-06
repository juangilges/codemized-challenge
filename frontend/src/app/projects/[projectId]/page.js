"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProjectMembers from "../../../components/project/ProjectMembers";
import TaskCard from "../../../components/project/TaskCard";
import CreateTaskForm from "../../../components/project/CreateTaskForm";

import useTaskComments from "../../../hooks/useTaskComments";
import useTasks from "../../../hooks/useTasks";
import useProjectMembers from "../../../hooks/useProjectMembers";
import useProject from "../../../hooks/useProject";

import styles from "../../../components/project/project.module.css";

export default function ProjectPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.projectId;

    const [message, setMessage] = useState("");

    const {
        commentsByTask,
        commentInputs,
        setInitialComments,
        initializeTaskComments,
        removeTaskComments,
        setCommentValue,
        handleCreateComment,
        handleEditComment,
        handleDeleteComment,
    } = useTaskComments({
        router,
        setMessage,
    });

    const {
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
    } = useTasks({
        projectId,
        router,
        setMessage,
        initializeTaskComments,
        removeTaskComments,
    });

    const {
        members,
        memberEmail,
        setMemberEmail,
        addingMember,
        setInitialMembers,
        handleAddMember,
        handleRemoveMember,
    } = useProjectMembers({
        projectId,
        router,
        setMessage,
    });

    const {
        project,
        currentUser,
        loading,
        isCreator,
        handleEditProject,
        handleDeleteProject,
    } = useProject({
        projectId,
        router,
        setMessage,
        setInitialTasks,
        setInitialMembers,
        setInitialComments,
    });

    if (loading) {
        return <p>Cargando proyecto...</p>;
    }

    return (
        <main className={styles.projectPage}>

            <button
                type="button"
                className={styles.backButton}
                onClick={() =>
                    router.push("/dashboard")
                }
            >
                ← Volver al dashboard
            </button>

            <header className={styles.projectHeader}>

                <div>
                    <h1>
                        {project
                            ? project.name
                            : "Proyecto"}
                    </h1>

                    {project?.description && (
                        <p>
                            {project.description}
                        </p>
                    )}
                </div>

                {isCreator && (
                    <div className={styles.projectActions}>

                        <button
                            type="button"
                            onClick={handleEditProject}
                        >
                            Editar proyecto
                        </button>

                        <button
                            type="button"
                            className={styles.dangerButton}
                            onClick={handleDeleteProject}
                        >
                            Eliminar proyecto
                        </button>

                    </div>
                )}

            </header>

            {message && (
                <p className={styles.message}>
                    {message}
                </p>
            )}

            <div className={styles.topGrid}>

                {isCreator && (
                    <CreateTaskForm
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        creating={creating}
                        handleCreateTask={
                            handleCreateTask
                        }
                    />
                )}

                <ProjectMembers
                    members={members}
                    project={project}
                    isCreator={isCreator}
                    memberEmail={memberEmail}
                    setMemberEmail={setMemberEmail}
                    addingMember={addingMember}
                    handleAddMember={
                        handleAddMember
                    }
                    handleRemoveMember={
                        handleRemoveMember
                    }
                />

            </div>

            <section className={styles.tasksSection}>

                <div className={styles.tasksHeader}>
                    <h2>
                        Tareas
                    </h2>

                    <p>
                        Tareas asociadas a este proyecto.
                    </p>
                </div>

                {tasks.length === 0 ? (

                    <div className={styles.emptyState}>
                        <p>
                            Este proyecto todavía no tiene tareas.
                        </p>
                    </div>

                ) : (

                    <div className={styles.taskGrid}>

                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                isCreator={isCreator}
                                currentUser={currentUser}
                                members={members}

                                selectedUser={
                                    selectedUsers[
                                        task.id
                                        ] || ""
                                }

                                setSelectedUser={(value) =>
                                    setSelectedUser(
                                        task.id,
                                        value
                                    )
                                }

                                handleAssignUser={
                                    handleAssignUser
                                }

                                handleStatusChange={
                                    handleStatusChange
                                }

                                handleEditTask={
                                    handleEditTask
                                }

                                handleDeleteTask={
                                    handleDeleteTask
                                }

                                comments={
                                    commentsByTask[
                                        task.id
                                        ] || []
                                }

                                commentValue={
                                    commentInputs[
                                        task.id
                                        ] || ""
                                }

                                setCommentValue={(value) =>
                                    setCommentValue(
                                        task.id,
                                        value
                                    )
                                }

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
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}