"use client";

import Script from "next/script";
import { FormEvent, useMemo, useState } from "react";

type Product = { id: string; name: string; category: "Croissants" | "Rollos de hojaldre" };

const products: Product[] = [
  { id: "croissant", name: "Croissant", category: "Croissants" },
  { id: "croissant-chocolate", name: "Croissant chocolate", category: "Croissants" },
  { id: "croissant-almendra", name: "Croissant almendra", category: "Croissants" },
  { id: "croissant-pistacho", name: "Croissant pistacho", category: "Croissants" },
  { id: "rollo-canela", name: "Rollo de canela", category: "Rollos de hojaldre" },
  { id: "rollo-pistacho", name: "Rollo de pistacho", category: "Rollos de hojaldre" },
  { id: "rollo-nutella", name: "Rollo de Nutella", category: "Rollos de hojaldre" },
  { id: "rollo-almendra", name: "Rollo de almendra", category: "Rollos de hojaldre" },
];

const rmCommunes = [
  "Alhué","Buin","Calera de Tango","Cerrillos","Cerro Navia","Colina","Conchalí","Curacaví",
  "El Bosque","El Monte","Estación Central","Huechuraba","Independencia","Isla de Maipo",
  "La Cisterna","La Florida","La Granja","La Pintana","La Reina","Lampa","Las Condes",
  "Lo Barnechea","Lo Espejo","Lo Prado","Macul","Maipú","María Pinto","Melipilla","Ñuñoa",
  "Padre Hurtado","Paine","Pedro Aguirre Cerda","Peñaflor","Peñalolén","Pirque","Providencia",
  "Pudahuel","Puente Alto","Quilicura","Quinta Normal","Recoleta","Renca","San Bernardo",
  "San Joaquín","San José de Maipo","San Miguel","San Pedro","San Ramón","Santiago","Talagante",
  "Tiltil","Vitacura"
];

const dispatchCommunes = new Set(["Ñuñoa","Providencia","Las Condes","Vitacura","Lo Barnechea","La Reina"]);
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function normalizeRut(value: string) {
  return value.replace(/\./g, "").replace(/\s/g, "").toUpperCase();
}

function validRut(value: string) {
  const rut = normalizeRut(value);
  if (!/^\d{7,8}-[\dK]$/.test(rut)) return false;
  const [body, dv] = rut.split("-");
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const remainder = 11 - (sum % 11);
  const expected = remainder === 11 ? "0" : remainder === 10 ? "K" : String(remainder);
  return expected === dv;
}

function minDate() {
  const d = new Date();
  d.setHours(d.getHours() + 72);
  return d.toISOString().slice(0, 10);
}

export default function HorecaForm() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<"retiro" | "despacho">("retiro");
  const [commune, setCommune] = useState("Ñuñoa");
  const [rut, setRut] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<{type:"idle"|"error"|"success"|"sending"; message:string}>({type:"idle", message:""});

  const totalUnits = useMemo(() => Object.values(quantities).reduce((a, b) => a + b, 0), [quantities]);
  const dispatchAllowed = dispatchCommunes.has(commune);

  const dateError = useMemo(() => {
    if (!date) return "";
    const selected = new Date(`${date}T12:00:00`);
    const day = selected.getDay();
    if (![4,5,6].includes(day)) return "Las entregas y retiros están disponibles de jueves a sábado.";
    const limit = new Date();
    limit.setHours(limit.getHours() + 72);
    if (selected < limit) return "La fecha debe respetar al menos 72 horas de anticipación.";
    return "";
  }, [date]);

  function updateQty(id: string, value: number) {
    const safe = Math.max(0, Math.min(96, value));
    setQuantities((prev) => ({ ...prev, [id]: safe }));
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    if (!validRut(rut)) {
      setStatus({type:"error", message:"Revisa el RUT y su dígito verificador."});
      return;
    }
    if (totalUnits < 36 || totalUnits > 96 || totalUnits % 6 !== 0) {
      setStatus({type:"error", message:"El pedido debe sumar entre 36 y 96 unidades, siempre en múltiplos de 6."});
      return;
    }
    if (dateError) {
      setStatus({type:"error", message:dateError});
      return;
    }
    if (mode === "despacho" && !dispatchAllowed) {
      setStatus({type:"error", message:"El despacho está disponible solo en el sector oriente. Puedes seleccionar retiro en Ñuñoa."});
      return;
    }

    const items = products
      .map((p) => ({ id: p.id, name: p.name, quantity: quantities[p.id] || 0 }))
      .filter((p) => p.quantity > 0);

    const token = (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value || "";

    const payload = {
      name: String(form.get("name") || ""),
      company: String(form.get("company") || ""),
      rut,
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      commune,
      format: String(form.get("format") || ""),
      mode,
      date,
      slot: String(form.get("slot") || ""),
      message: String(form.get("message") || ""),
      acceptedTerms: form.get("terms") === "on",
      items,
      turnstileToken: token
    };

    setStatus({type:"sending", message:"Enviando solicitud…"});
    try {
      const res = await fetch("/api/horeca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No fue posible enviar la solicitud.");
      setStatus({type:"success", message:`Solicitud recibida${data.code ? ` · ${data.code}` : ""}. Revisaremos disponibilidad y te contactaremos a la brevedad.`});
      e.currentTarget.reset();
      setQuantities({});
      setDate("");
    } catch (error) {
      setStatus({type:"error", message:error instanceof Error ? error.message : "No fue posible enviar la solicitud."});
    }
  }

  return (
    <form className="horecaForm" onSubmit={submit}>
      {siteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}
      <div className="formHeader">
        <div><p className="eyebrow">SOLICITUD HORECA</p><h3>Cotiza tu pedido</h3></div>
        <span className="unitBadge">{totalUnits} / 96 unidades</span>
      </div>

      <div className="formGrid">
        <label>Nombre completo<input required name="name" autoComplete="name" /></label>
        <label>Empresa<input required name="company" autoComplete="organization" /></label>
        <label>RUT<input required name="rut" value={rut} onChange={(e) => setRut(e.target.value)} placeholder="12.345.678-5" /></label>
        <label>Correo<input required type="email" name="email" autoComplete="email" /></label>
        <label>Teléfono<input required name="phone" autoComplete="tel" /></label>
        <label>Comuna
          <select required name="commune" value={commune} onChange={(e) => {
            const next = e.target.value;
            setCommune(next);
            if (!dispatchCommunes.has(next)) setMode("retiro");
          }}>
            {rmCommunes.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Formato
          <select required name="format" defaultValue="ambos">
            <option value="fresco">Fresco</option>
            <option value="congelado">Congelado</option>
            <option value="ambos">Ambos</option>
          </select>
        </label>
        <label>Modalidad
          <select required name="mode" value={mode} onChange={(e) => setMode(e.target.value as "retiro"|"despacho")}>
            <option value="retiro">Retiro en producción</option>
            <option value="despacho" disabled={!dispatchAllowed}>Despacho sector oriente</option>
          </select>
        </label>
        <label>Fecha estimada<input required type="date" name="date" min={minDate()} value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <label>Franja horaria
          <select required name="slot">
            <option value="09:00-13:00">09:00–13:00</option>
            <option value="14:00-18:00">14:00–18:00</option>
          </select>
        </label>
      </div>

      {dateError && <p className="formWarning">{dateError}</p>}
      {!dispatchAllowed && <p className="formNotice">Para {commune}, por ahora está disponible únicamente el retiro en Lo Encalada 17, Ñuñoa.</p>}

      <div className="productSelector">
        {(["Croissants","Rollos de hojaldre"] as const).map((category) => (
          <div className="productCategory" key={category}>
            <h4>{category}</h4>
            {products.filter((p) => p.category === category).map((p) => (
              <div className="productRow" key={p.id}>
                <span>{p.name}</span>
                <div className="qtyControl">
                  <button type="button" onClick={() => updateQty(p.id, (quantities[p.id] || 0) - 6)} aria-label={`Quitar 6 ${p.name}`}>−</button>
                  <output>{quantities[p.id] || 0}</output>
                  <button type="button" onClick={() => updateQty(p.id, (quantities[p.id] || 0) + 6)} aria-label={`Agregar 6 ${p.name}`}>+</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="summaryBox">
        <div><span>Total unidades</span><strong>{totalUnits}</strong></div>
        <div><span>Productos</span><strong>Cotización personalizada</strong></div>
        <div><span>Despacho</span><strong>{mode === "despacho" ? "$2.500" : "$0"}</strong></div>
        <small>Los precios HORECA y el desglose de IVA se informan en la cotización formal. El despacho tiene tarifa fija de $2.500 cuando corresponde.</small>
      </div>

      <label className="wideLabel">Mensaje u observaciones<textarea name="message" rows={4} /></label>

      <label className="terms">
        <input required type="checkbox" name="terms" />
        <span>He leído y acepto las <a href="/condiciones-horeca" target="_blank">condiciones HORECA</a> y la <a href="/privacidad" target="_blank">política de privacidad</a>.</span>
      </label>

      {siteKey && <div className="cf-turnstile" data-sitekey={siteKey}></div>}

      <div className="submitRow">
        <button className="button gold submitButton" disabled={status.type === "sending"} type="submit">
          {status.type === "sending" ? "Enviando…" : "Enviar solicitud →"}
        </button>
        <span className="formMicro">Mínimo 36 · múltiplos de 6 · máximo 96 · 72 h de anticipación</span>
      </div>
      {status.type !== "idle" && <p className={`formStatus ${status.type}`}>{status.message}</p>}
    </form>
  );
}
