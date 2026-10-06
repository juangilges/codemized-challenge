"use client";

export default function RegisterForm({
                                         name,
                                         setName,
                                         email,
                                         setEmail,
                                         password,
                                         setPassword,
                                         loading,
                                         handleRegister,
                                         showLogin,
                                     }) {
    return (
        <section>
            <h2>Crear cuenta</h2>

            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="register-name">
                        Nombre
                    </label>

                    <br />

                    <input
                        id="register-name"
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        maxLength={100}
                        required
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="register-email">
                        Correo electrónico
                    </label>

                    <br />

                    <input
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        maxLength={255}
                        required
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="register-password">
                        Contraseña
                    </label>

                    <br />

                    <input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        minLength={6}
                        required
                    />

                    <p>
                        Mínimo 6 caracteres
                    </p>
                </div>

                <br />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creando cuenta..."
                        : "Crear cuenta"}
                </button>
            </form>

            <br />

            <p>
                ¿Ya tenés cuenta?
            </p>

            <button
                type="button"
                onClick={showLogin}
            >
                Volver al login
            </button>
        </section>
    );
}