import bcrypt from "bcryptjs";
import pg from "pg";
import { authenticator } from "otplib";

const { Pool } = pg;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || !email || !password) {
  console.error("Faltan DATABASE_URL, ADMIN_EMAIL o ADMIN_PASSWORD.");
  process.exit(1);
}

if (password.length < 12) {
  console.error("La contraseña debe tener al menos 12 caracteres.");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });
const passwordHash = await bcrypt.hash(password, 12);
const secret = authenticator.generateSecret();
const uri = authenticator.keyuri(email, "Croissant.cl", secret);

try {
  const result = await pool.query(
    `INSERT INTO admin_users(email, password_hash, totp_secret)
     VALUES ($1,$2,$3)
     ON CONFLICT (email) DO UPDATE SET password_hash=EXCLUDED.password_hash, totp_secret=EXCLUDED.totp_secret, is_active=true, updated_at=NOW()
     RETURNING id, email`,
    [email.toLowerCase(), passwordHash, secret]
  );
  console.log(`Administrador preparado: ${result.rows[0].email}`);
  console.log(`TOTP secret: ${secret}`);
  console.log(`Authenticator URI: ${uri}`);
  console.log("Guarda el secreto TOTP en un lugar seguro y elimina ADMIN_PASSWORD del entorno del shell cuando termines.");
} finally {
  await pool.end();
}
