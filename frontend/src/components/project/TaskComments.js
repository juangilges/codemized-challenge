"use client";

import styles from "./project.module.css";

export default function TaskComments({
                                         task,
                                         comments,
                                         currentUser,
                                         commentValue,
                                         setCommentValue,
                                         handleCreateComment,
                                         handleEditComment,
                                         handleDeleteComment,
                                     }) {
    return (
        <section className={styles.commentBox}>

            <h4>
                Comentarios
            </h4>

            {comments.length === 0 ? (
                <p>
                    Todavía no hay comentarios.
                </p>
            ) : (
                comments.map((comment) => (
                    <div
                        key={comment.id}
                        className={styles.commentItem}
                    >

                        <p>
                            <span
                                className={
                                    styles.commentAuthor
                                }
                            >
                                {comment.authorName}
                            </span>

                            : {comment.content}
                        </p>

                        {comment.authorId ===
                            currentUser?.id && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEditComment(
                                                comment
                                            )
                                        }
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            styles.dangerButton
                                        }
                                        onClick={() =>
                                            handleDeleteComment(
                                                comment
                                            )
                                        }
                                    >
                                        Eliminar
                                    </button>
                                </>
                            )}

                    </div>
                ))
            )}

            <form
                className={styles.commentForm}
                onSubmit={(event) =>
                    handleCreateComment(
                        event,
                        task.id
                    )
                }
            >
                <input
                    type="text"
                    value={commentValue}
                    onChange={(event) =>
                        setCommentValue(
                            event.target.value
                        )
                    }
                    placeholder="Escribir comentario"
                />

                <button type="submit">
                    Comentar
                </button>
            </form>

        </section>
    );
}