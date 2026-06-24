const db = require('../config/db');

const UserModel = {
  // Cari user berdasarkan email (dipakai saat login & cek duplikat saat register)
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0]; // ambil 1 data saja, atau undefined jika tidak ada
  },

  // Cari user berdasarkan id
  async findById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  // Cari data admin/pemilik kos pertama (untuk kontak darurat di dashboard penghuni)
  async findOwner() {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1"
    );
    return rows[0];
  },

  // Membuat user baru (untuk register penghuni baru)
  async create({ nama, email, password, no_kamar, no_hp, role = 'penghuni' }) {
    const [result] = await db.query(
      'INSERT INTO users (nama, email, password, no_kamar, no_hp, role) VALUES (?, ?, ?, ?, ?, ?)',
      [nama, email, password, no_kamar, no_hp, role]
    );
    return result.insertId;
  }
};

module.exports = UserModel;
