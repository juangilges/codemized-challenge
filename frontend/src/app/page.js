"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
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
              "Content-Type":
                  "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
      );

      const data =
          await response.json();

      if (!response.ok) {
        setMessage(
            data.message ||
            "No se pudo iniciar sesión"
        );

        return;
      }

      localStorage.setItem(
          "token",
          data.token
      );

      router.push("/dashboard");

    } catch (error) {
      setMessage(
          "No se pudo conectar con el servidor"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    if (password.length < 6) {
      setMessage(
          "La contraseña debe tener al menos 6 caracteres"
      );

      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                  "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
      );

      const data =
          await response.json();

      if (!response.ok) {
        setMessage(
            data.message ||
            "No se pudo crear la cuenta"
        );

        return;
      }

      setName("");
      setPassword("");
      setMode("login");

      setMessage(
          "Cuenta creada correctamente. Ya podés iniciar sesión."
      );

    } catch (error) {
      setMessage(
          "No se pudo conectar con el servidor"
      );

    } finally {
      setLoading(false);
    }
  };

  const showLogin = () => {
    setMode("login");
    setMessage("");
    setPassword("");
  };

  const showRegister = () => {
    setMode("register");
    setMessage("");
    setPassword("");
  };

  return (
      <main className={styles.authPage}>

        <header className={styles.authHeader}>
          <h1 className={styles.authTitle}>
            Codemized
          </h1>

          <p className={styles.authSubtitle}>
            Gestión de proyectos y tareas
          </p>
        </header>

        {mode === "login" ? (
            <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
                handleLogin={handleLogin}
                showRegister={showRegister}
            />
        ) : (
            <RegisterForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
                handleRegister={
                  handleRegister
                }
                showLogin={showLogin}
            />
        )}

        {message && (
            <p className={styles.message}>
              {message}
            </p>
        )}

      </main>
  );
}