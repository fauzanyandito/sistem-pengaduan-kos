const mysql = require('mysql2');
require('dotenv').config();

// Membuat connection pool agar koneksi ke database lebih efisien
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pengaduan_kos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Gunakan versi promise agar bisa pakai async/await
const db = pool.promise();

module.exports = db;
