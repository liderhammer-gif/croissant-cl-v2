"use client";

import Script from "next/script";
import { FormEvent, useState } from "react";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const allowedTypes = ["application/pdf","image/jpeg","image/png","image/webp"];

export default function ContactForm() {
  const [status, setStatus] = useState<{type:"idle"|"sending"|"success"|"error"; message:string}>({type:"idle",message:""});

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const file = form.get("attachment");
    if (file instanceof File && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) return setStatus({type:"error",message:"El archivo no puede superar 10 MB."});
      if (!allowedTypes.includes(file.type)) return setStatus({type:"error",message:"El adjunto debe ser PDF, JPG, PNG o WebP."});
    }
    const token = (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value || "";
    form.set("turnstileToken", token);
    setStatus({type:"sending",message:"Enviando mensaje…"});
    try {
      const res = await fetch("/api/contact", { method:"POST", body:form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No fue posible enviar el mensaje.");
      e.currentTarget.reset();
      setStatus({type:"success",message:"Mensaje recibido. Te responderemos a la brevedad."});
    } catch (error) {
      setStatus({type:"error",message:error instanceof Error ? error.message : "No fue posible enviar el mensaje."});
    }
  }

  return (
    <form className="contactForm" onSubmit={submit}>
      {siteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}
      <div className="contactFormGrid">
        <label>Nombre<input required name="name" autoComplete="name" /></label>
        <label>Correo<input required type="email" name="email" autoComplete="email" /></label>
      </div>
      <label>Asunto<input required name="subject" /></label>
      <label>Mensaje<textarea required name="message" rows={5} /></label>
      <label>Adjunto opcional <span>PDF, JPG, PNG o WebP · máximo 10 MB</span><input type="file" name="attachment" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" /></label>
      <label className="contactTerms"><input required type="checkbox" name="privacy"/><span>Acepto el tratamiento de mis datos según la <a href="/privacidad" target="_blank">política de privacidad</a>.</span></label>
      {siteKey && <div className="cf-turnstile" data-sitekey={siteKey}></div>}
      <button className="button gold" disabled={status.type === "sending"}>{status.type === "sending" ? "Enviando…" : "Enviar mensaje →"}</button>
      {status.type !== "idle" && <p className={`formStatus ${status.type}`}>{status.message}</p>}
    </form>
  );
}
