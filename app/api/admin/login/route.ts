import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { createAdminSession, setAdminCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Base de datos no configurada." }, { status: 503 });
    }
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const otp = String(body.otp || "").replace(/\s/g, "");

    const result = await pool.query(
      `SELECT id, email, password_hash, totp_secret FROM admin_users WHERE email=$1 AND is_active=true LIMIT 1`,
      [email]
    );
    if (!result.rowCount) return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
    const user = result.rows[0];
    const passwordOk = await bcrypt.compare(password, user.password_hash);
    if (!passwordOk) return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
    if (user.totp_secret && (!otp || !authenticator.check(otp, user.totp_secret))) {
      return NextResponse.json({ error: "Código de verificación inválido." }, { status: 401 });
    }

    await pool.query(`DELETE FROM admin_sessions WHERE expires_at<=NOW()`);
    const token = await createAdminSession(user.id);
    await setAdminCookie(token);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin login error", error);
    return NextResponse.json({ error: "No fue posible iniciar sesión." }, { status: 500 });
  }
}
