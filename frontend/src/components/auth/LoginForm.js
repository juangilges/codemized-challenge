"use client";

export default function LoginForm({
                                      email,
                                      setEmail,
                                      password,
                                      setPassword,
                                      loading,
                                      handleLogin,
                                      showRegister,
                                  }) {
    return (
        <section>
            <h2>Iniciar sesión</h2>

            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="login-email">
                        Correo electrónico
                    </label>

                    <br />

                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="login-password">
                        Contraseña
                    </label>

                    <br />

                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Ingresando..."
                        : "Ingresar"}
                </button>
            </form>

            <br />

            <p>¿No tenés cuenta?</p>

            <button
                type="button"
                onClick={showRegister}
            >
                Registrarse
            </button>
        </section>
    );
}