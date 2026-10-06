"use client";

import styles from "./project.module.css";

export default function ProjectMembers({
                                           members,
                                           project,
                                           isCreator,
                                           memberEmail,
                                           setMemberEmail,
                                           addingMember,
                                           handleAddMember,
                                           handleRemoveMember,
                                       }) {
    return (
        <section className={styles.card}>

            <div className={styles.sectionHeader}>
                <h2>Miembros del proyecto</h2>
            </div>

            {members.length === 0 ? (
                <p>
                    Este proyecto todavía no tiene miembros.
                </p>
            ) : (
                members.map((member) => (
                    <div
                        key={member.id}
                        className={styles.memberRow}
                    >
                        <p className={styles.memberInfo}>
                            <strong>
                                {member.name}
                            </strong>
                            <br />
                            {member.email}
                        </p>

                        {isCreator &&
                            member.id !== project.creatorId && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveMember(member)
                                    }
                                >
                                    Quitar miembro
                                </button>
                            )}
                    </div>
                ))
            )}

            {isCreator && (
                <>
                    <h3>
                        Agregar miembro
                    </h3>

                    <form onSubmit={handleAddMember}>
                        <input
                            type="email"
                            value={memberEmail}
                            onChange={(event) =>
                                setMemberEmail(
                                    event.target.value
                                )
                            }
                            placeholder="Email del usuario"
                            required
                        />

                        <br />
                        <br />

                        <button
                            type="submit"
                            disabled={addingMember}
                        >
                            {addingMember
                                ? "Agregando..."
                                : "Agregar miembro"}
                        </button>
                    </form>
                </>
            )}

        </section>
    );
}