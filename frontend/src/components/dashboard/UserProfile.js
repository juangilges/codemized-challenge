"use client";

export default function UserProfile({
                                        currentUser,
                                        handleEditProfile,
                                    }) {
    return (
        <section>
            <h2>Mi perfil</h2>

            {currentUser ? (
                <>
                    <p>
                        Nombre: {currentUser.name}
                    </p>

                    <p>
                        Email: {currentUser.email}
                    </p>

                    <button
                        type="button"
                        onClick={handleEditProfile}
                    >
                        Editar perfil
                    </button>
                </>
            ) : (
                <p>
                    No se pudo cargar el usuario.
                </p>
            )}
        </section>
    );
}