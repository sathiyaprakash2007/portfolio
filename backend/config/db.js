const mysql = require("mysql2/promise");
const fs = require("fs");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),

  ssl: {
    ca: fs.readFileSync("/etc/secrets/ca.pem"),
    rejectUnauthorized: true,
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function connectDatabase() {
  try {
    const connection = await pool.getConnection();

    console.log("✅ MySQL database connected successfully!");

    connection.release();
  } catch (error) {
    console.error("❌ MySQL connection failed:");
    console.error(error.message);
  }
}

module.exports = {
  pool,
  connectDatabase,
};