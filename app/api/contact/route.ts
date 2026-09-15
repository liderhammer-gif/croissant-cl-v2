import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { mailer } from "@/lib/mail";
import { uploadR2Object } from "@/lib/r2";

const allowedTypes = new Set(["application/pdf","image/jpeg","image/png","image/webp"]);

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const form = new URLSearchParams({ secret, response: token, remoteip: ip });
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method:"POST", body:form });
  if (!res.ok) return false;
  const data = await res.json() as { success?: boolean };
  return data.success === true;
}

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) return NextResponse.json({error:"Formulario aún no conectado a la base de datos."},{status:503});
    const data = await request.formData();
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim().toLowerCase();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();
    const privacy = data.get("privacy") === "on";
    const token = String(data.get("turnstileToken") || "");
    const ip = (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "").split(",")[0].trim();
    if (!name || !email || !subject || !message || !privacy) return NextResponse.json({error:"Completa los campos obligatorios y acepta la política de privacidad."},{status:400});
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({error:"Correo inválido."},{status:400});
    if (!(await verifyTurnstile(token, ip))) return NextResponse.json({error:"No pudimos validar la protección anti-spam."},{status:400});

    let attachmentKey: string | null = null;
    const attachment = data.get("attachment");
    if (attachment instanceof File && attachment.size > 0) {
      if (attachment.size > 10 * 1024 * 1024) return NextResponse.json({error:"El archivo no puede superar 10 MB."},{status:400});
      if (!allowedTypes.has(attachment.type)) return NextResponse.json({error:"Formato de archivo no permitido."},{status:400});
      const ext = attachment.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
      attachmentKey = `contact/${new Date().getUTCFullYear()}/${crypto.randomUUID()}.${ext}`;
      const buffer = Buffer.from(await attachment.arrayBuffer());
      await uploadR2Object(attachmentKey, buffer, attachment.type);
    }

    const inserted = await pool.query(
      `INSERT INTO contact_messages(name,email,subject,message,attachment_url,status)
       VALUES ($1,$2,$3,$4,$5,'new') RETURNING id`,
      [name,email,subject,message,attachmentKey]
    );

    const transport = mailer();
    if (transport) {
      const from = process.env.CONTACT_FROM || "Croissant.cl <contacto@croissant.cl>";
      await Promise.allSettled([
        transport.sendMail({from,to:process.env.CONTACT_TO || "contacto@croissant.cl",replyTo:email,subject:`Contacto web · ${subject}`,text:`${name}\n${email}\n\n${message}\n\nID: ${inserted.rows[0].id}${attachmentKey ? `\nAdjunto guardado: ${attachmentKey}` : ""}`}),
        transport.sendMail({from,to:email,subject:"Recibimos tu mensaje · Croissant.cl",text:`Hola ${name},\n\nRecibimos tu mensaje y te responderemos a la brevedad.\n\nCroissant.cl`})
      ]);
    }
    return NextResponse.json({ok:true});
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json({error:"No fue posible procesar el mensaje. Inténtalo nuevamente."},{status:500});
  }
}
