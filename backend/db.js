// db.js (PostgreSQL version)
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("❌ PostgreSQL connection error:", err.stack);
  }
  console.log("🐘 PostgreSQL DB connected");
  release();
});

module.exports = pool;
