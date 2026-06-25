const mysql = require('mysql2');
require('dotenv').config();

let pool;

// Jika di Render ada DATABASE_URL, pakai itu langsung. Jika tidak, pakai konfigurasi lokal.
if (process.env.DATABASE_URL) {
  pool = mysql.createPool(process.env.DATABASE_URL);
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pengaduan_kos',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

const db = pool.promise();

module.exports = db;