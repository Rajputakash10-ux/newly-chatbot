import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

export const getSQL = () => {
  if (!_sql) {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL || DATABASE_URL.includes("<your-")) {
      throw new Error("DATABASE_URL not configured. Please set it in your environment variables.");
    }
    _sql = neon(DATABASE_URL);
  }
  return _sql;
};

export const initDB = async () => {
  const sql = getSQL();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id VARCHAR(255) PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) REFERENCES chat_sessions(id) ON DELETE CASCADE,
      role VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS watchlists (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      symbol VARCHAR(20) NOT NULL,
      added_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, symbol)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS price_alerts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      symbol VARCHAR(20) NOT NULL,
      target_price DECIMAL(10, 2) NOT NULL,
      condition VARCHAR(10) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  console.log("✅ Database initialized");
};
