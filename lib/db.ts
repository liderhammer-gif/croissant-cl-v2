import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __croissantPool: Pool | undefined;
}

export const pool =
  global.__croissantPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined
  });

if (process.env.NODE_ENV !== "production") global.__croissantPool = pool;
