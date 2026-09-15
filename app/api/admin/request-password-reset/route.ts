import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { mailer } from "@/lib/mail";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) return NextResponse.json({ok:true});
    const { email: rawEmail } = await request.json();
    const email = String(rawEmail || "").trim().toLowerCase();
    const result = await pool.query(`SELECT id,email FROM admin_users WHERE email=$1 AND is_active=true LIMIT 1`, [email]);
    if (result.rowCount) {
      const user = result.rows[0];
      const token = crypto.randomBytes(40).toString("base64url");
      await pool.query(`DELETE FROM admin_password_resets WHERE admin_user_id=$1 OR expires_at<=NOW()`, [user.id]);
      await pool.query(
        `INSERT INTO admin_password_resets(admin_user_id,token_hash,expires_at) VALUES ($1,$2,NOW()+interval '30 minutes')`,
        [user.id, hashToken(token)]
      );
      const transport = mailer();
      if (transport) {
        const base = process.env.NEXT_PUBLIC_SITE_URL || "https://croissant.cl";
        await transport.sendMail({
          from: process.env.ADMIN_FROM || "Croissant.cl <admin@croissant.cl>",
          to: user.email,
          subject: "Recuperar acceso · Croissant.cl Atelier Privé",
          text: `Solicitaste restablecer tu contraseña. Este enlace vence en 30 minutos:\n\n${base}/atelier-prive/restablecer?token=${encodeURIComponent(token)}\n\nSi no realizaste esta solicitud, ignora este correo.`
        });
      }
    }
    return NextResponse.json({ok:true,message:"Si el correo existe, enviaremos instrucciones para recuperar el acceso."});
  } catch (error) {
    console.error("Password reset request error", error);
    return NextResponse.json({ok:true,message:"Si el correo existe, enviaremos instrucciones para recuperar el acceso."});
  }
}
