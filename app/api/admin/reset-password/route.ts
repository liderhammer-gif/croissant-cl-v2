import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) return NextResponse.json({error:"Base de datos no configurada."},{status:503});
    const body = await request.json();
    const token = String(body.token || "");
    const password = String(body.password || "");
    const otp = String(body.otp || "").replace(/\s/g, "");
    if (!token || password.length < 12) return NextResponse.json({error:"La contraseña debe tener al menos 12 caracteres."},{status:400});

    const result = await pool.query(
      `SELECT r.id AS reset_id, u.id AS user_id, u.totp_secret
         FROM admin_password_resets r JOIN admin_users u ON u.id=r.admin_user_id
        WHERE r.token_hash=$1 AND r.used_at IS NULL AND r.expires_at>NOW() AND u.is_active=true LIMIT 1`,
      [hashToken(token)]
    );
    if (!result.rowCount) return NextResponse.json({error:"El enlace es inválido o expiró."},{status:400});
    const row = result.rows[0];
    if (row.totp_secret && (!otp || !authenticator.check(otp,row.totp_secret))) {
      return NextResponse.json({error:"Código 2FA inválido."},{status:401});
    }
    const passwordHash = await bcrypt.hash(password,12);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`UPDATE admin_users SET password_hash=$1,updated_at=NOW() WHERE id=$2`,[passwordHash,row.user_id]);
      await client.query(`UPDATE admin_password_resets SET used_at=NOW() WHERE id=$1`,[row.reset_id]);
      await client.query(`DELETE FROM admin_sessions WHERE admin_user_id=$1`,[row.user_id]);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
    return NextResponse.json({ok:true});
  } catch (error) {
    console.error("Password reset error",error);
    return NextResponse.json({error:"No fue posible restablecer la contraseña."},{status:500});
  }
}
