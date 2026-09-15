import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { mailer } from "@/lib/mail";
import { isValidRut, validateHorecaDate, type HorecaItem } from "@/lib/validation";

const dispatchCommunes = new Set(["Ñuñoa","Providencia","Las Condes","Vitacura","Lo Barnechea","La Reina"]);
const allowedProductIds = new Set([
  "croissant","croissant-chocolate","croissant-almendra","croissant-pistacho",
  "rollo-canela","rollo-pistacho","rollo-nutella","rollo-almendra"
]);

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const form = new URLSearchParams({ secret, response: token, remoteip: ip });
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  if (!res.ok) return false;
  const data = await res.json() as { success?: boolean };
  return data.success === true;
}

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "El sistema HORECA aún no está conectado a la base de datos." }, { status: 503 });
    }

    const body = await request.json();
    const items: HorecaItem[] = Array.isArray(body.items) ? body.items : [];
    const totalUnits = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const ip = (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "").split(",")[0].trim();

    if (!body.name || !body.company || !body.email || !body.phone || !body.commune || !body.rut) {
      return NextResponse.json({ error: "Completa los datos obligatorios." }, { status: 400 });
    }
    if (!isValidRut(String(body.rut))) {
      return NextResponse.json({ error: "RUT inválido." }, { status: 400 });
    }
    if (!body.acceptedTerms) {
      return NextResponse.json({ error: "Debes aceptar las condiciones HORECA y privacidad." }, { status: 400 });
    }
    if (!validateHorecaDate(String(body.date || ""))) {
      return NextResponse.json({ error: "La fecha debe ser jueves, viernes o sábado y respetar 72 horas de anticipación." }, { status: 400 });
    }
    if (!["09:00-13:00","14:00-18:00"].includes(String(body.slot))) {
      return NextResponse.json({ error: "Franja horaria inválida." }, { status: 400 });
    }
    if (!["fresco","congelado","ambos"].includes(String(body.format))) {
      return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
    }
    if (!["retiro","despacho"].includes(String(body.mode))) {
      return NextResponse.json({ error: "Modalidad inválida." }, { status: 400 });
    }
    if (body.mode === "despacho" && !dispatchCommunes.has(String(body.commune))) {
      return NextResponse.json({ error: "El despacho está disponible solo en el sector oriente." }, { status: 400 });
    }
    if (totalUnits < 36 || totalUnits > 96 || totalUnits % 6 !== 0) {
      return NextResponse.json({ error: "El pedido debe sumar entre 36 y 96 unidades, en múltiplos de 6." }, { status: 400 });
    }
    for (const item of items) {
      if (!allowedProductIds.has(item.id) || item.quantity < 6 || item.quantity % 6 !== 0) {
        return NextResponse.json({ error: "Hay cantidades o productos inválidos." }, { status: 400 });
      }
    }
    if (!(await verifyTurnstile(String(body.turnstileToken || ""), ip))) {
      return NextResponse.json({ error: "No pudimos validar la protección anti-spam. Inténtalo nuevamente." }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const requestResult = await client.query(
        `INSERT INTO horeca_requests
          (name, company, rut, email, phone, commune, product_format, delivery_mode, requested_date, time_slot,
           message, total_units, shipping_amount, status, accepted_terms_at, accepted_terms_ip, terms_version)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'new',NOW(),$14,'2026-09-15')
         RETURNING id, public_code`,
        [
          body.name, body.company, body.rut, body.email, body.phone, body.commune, body.format, body.mode,
          body.date, body.slot, body.message || "", totalUnits, body.mode === "despacho" ? 2500 : 0, ip || null
        ]
      );
      const created = requestResult.rows[0];
      for (const item of items) {
        await client.query(
          `INSERT INTO horeca_request_items (request_id, product_key, product_name, quantity)
           VALUES ($1,$2,$3,$4)`,
          [created.id, item.id, item.name, item.quantity]
        );
      }
      await client.query("COMMIT");

      const transport = mailer();
      if (transport) {
        const list = items.map((i) => `• ${i.name}: ${i.quantity}`).join("\n");
        const from = process.env.SMTP_FROM || "Croissant.cl <horeca@croissant.cl>";
        await Promise.allSettled([
          transport.sendMail({
            from,
            to: process.env.HORECA_TO || "horeca@croissant.cl",
            replyTo: body.email,
            subject: `Nueva solicitud HORECA ${created.public_code} · ${body.company}`,
            text: `Nueva solicitud ${created.public_code}\n\n${body.name}\n${body.company}\nRUT: ${body.rut}\nCorreo: ${body.email}\nTeléfono: ${body.phone}\nComuna: ${body.commune}\nModalidad: ${body.mode}\nFormato: ${body.format}\nFecha: ${body.date} · ${body.slot}\n\n${list}\n\nTotal unidades: ${totalUnits}\nObservaciones: ${body.message || "-"}`
          }),
          transport.sendMail({
            from,
            to: body.email,
            subject: `Recibimos tu solicitud HORECA ${created.public_code}`,
            text: `Hola ${body.name},\n\nRecibimos tu solicitud HORECA ${created.public_code}. Revisaremos disponibilidad y te contactaremos a la brevedad.\n\nCroissant.cl`
          })
        ]);
      }

      return NextResponse.json({ ok: true, code: created.public_code });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("HORECA request error", error);
    return NextResponse.json({ error: "No fue posible procesar la solicitud. Inténtalo nuevamente." }, { status: 500 });
  }
}
