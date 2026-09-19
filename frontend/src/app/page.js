"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "No se pudo iniciar sesión");
        return;
      }

      localStorage.setItem("token", data.token);

      router.push("/dashboard");

    } catch (error) {
      setMessage("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
      <main>
        <h1>Codemized</h1>
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Correo electrónico</label>
            <br />

            <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
            />
          </div>

          <br />

          <div>
            <label htmlFor="password">Contraseña</label>
            <br />

            <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
            />
          </div>

          <br />

          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {message && <p>{message}</p>}
      </main>
  );
}