import crypto from "node:crypto";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

const COOKIE_NAME = "croissant_admin";
const SESSION_HOURS = 8;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createAdminSession(adminUserId: string) {
  const token = crypto.randomBytes(48).toString("base64url");
  const tokenHash = hashToken(token);
  await pool.query(
    `INSERT INTO admin_sessions(admin_user_id, token_hash, expires_at)
     VALUES ($1,$2,NOW() + ($3 || ' hours')::interval)`,
    [adminUserId, tokenHash, SESSION_HOURS]
  );
  return token;
}

export async function setAdminCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60
  });
}

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token || !process.env.DATABASE_URL) return null;
  const tokenHash = hashToken(token);
  const result = await pool.query(
    `SELECT u.id, u.email
       FROM admin_sessions s
       JOIN admin_users u ON u.id=s.admin_user_id
      WHERE s.token_hash=$1 AND s.expires_at>NOW() AND u.is_active=true
      LIMIT 1`,
    [tokenHash]
  );
  if (!result.rowCount) return null;
  await pool.query(`UPDATE admin_sessions SET last_seen_at=NOW() WHERE token_hash=$1`, [tokenHash]);
  return result.rows[0] as { id: string; email: string };
}

export async function destroyAdminSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token && process.env.DATABASE_URL) {
    await pool.query(`DELETE FROM admin_sessions WHERE token_hash=$1`, [hashToken(token)]);
  }
  store.delete(COOKIE_NAME);
}
