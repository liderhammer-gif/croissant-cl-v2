"use client";

import { FormEvent, useState } from "react";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        otp: form.get("otp")
      })
    });
    const data = await res.json();
    if (!res.ok) {
      setSending(false);
      setError(data?.error || "No fue posible iniciar sesión.");
      return;
    }
    window.location.href = "/atelier-prive";
  }

  return (
    <form className="adminLoginForm" onSubmit={submit}>
      <label>Correo<input required type="email" name="email" autoComplete="username" /></label>
      <label>Contraseña<input required type="password" name="password" autoComplete="current-password" /></label>
      <label>Código 2FA<input required name="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" /></label>
      <button className="button gold" disabled={sending}>{sending ? "Verificando…" : "Entrar →"}</button>
      {error && <p className="formStatus error">{error}</p>}
    </form>
  );
}
