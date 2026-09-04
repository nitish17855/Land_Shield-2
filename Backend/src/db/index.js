const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

const isProduction = process.env.NODE_ENV === "production";
const isRemoteDb = connectionString && (
  connectionString.includes("render.com") ||
  connectionString.includes("neon.tech") ||
  connectionString.includes("supabase.co") ||
  connectionString.includes("aivencloud.com") ||
  connectionString.includes("sslmode=require")
);

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ...(isRemoteDb ? { ssl: { rejectUnauthorized: false } } : {}),
      }
    : {
        host: process.env.PGHOST || "localhost",
        port: parseInt(process.env.PGPORT, 10) || 5432,
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD || "",
        database: process.env.PGDATABASE || "landshield",
      }
);

/**
 * Initializes database schema (creates users table if not exists)
 */
async function initDb() {
  if (!process.env.DATABASE_URL && !process.env.PGHOST && !process.env.PGDATABASE) {
    console.warn("[PostgreSQL] No DATABASE_URL or PG configuration provided in .env. Database connection skipped.");
    return false;
  }

  try {
    const client = await pool.connect();
    console.log("[PostgreSQL] Connected to database successfully.");

    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        google_id VARCHAR(255) UNIQUE,
        avatar_url TEXT,
        auth_provider VARCHAR(50) DEFAULT 'local',
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
    `;

    await client.query(createUsersTableQuery);
    console.log("[PostgreSQL] Database schema verified & initialized (users table ready).");
    client.release();
    return true;
  } catch (error) {
    console.error("[PostgreSQL] Connection/Initialization failed:", error.message);
    return false;
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  initDb,
};
