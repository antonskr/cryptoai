"use client";

import { useState, useEffect } from "react";
import styles from './register.module.scss';  // Импортируем стили через CSS Modules

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) window.location.href = "/";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, nickname }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage("User registered successfully!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerPage__container}>
        <h1 className={styles.registerPage__title}>Register</h1>
        <form onSubmit={handleSubmit} className={styles.registerPage__form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.registerPage__input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.registerPage__input}
          />
          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={styles.registerPage__input}
          />
          <button type="submit" className={styles.registerPage__button}>
            Register
          </button>
        </form>
        {message && (
          <p className={message.includes("Error") ? styles.registerPage__errorMessage : styles.registerPage__successMessage}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
