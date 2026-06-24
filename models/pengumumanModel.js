const db = require('../config/db');

const PengumumanModel = {
  // Ambil pengumuman terbaru (untuk panel "Berita & Informasi Kos")
  async findLatest(limit = 3) {
    const [rows] = await db.query(
      'SELECT * FROM pengumuman ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    return rows;
  },

  // Ambil semua pengumuman (untuk halaman kelola admin)
  async findAll() {
    const [rows] = await db.query('SELECT * FROM pengumuman ORDER BY created_at DESC');
    return rows;
  },

  // Buat pengumuman baru
  async create({ judul, isi, tipe }) {
    const [result] = await db.query(
      'INSERT INTO pengumuman (judul, isi, tipe) VALUES (?, ?, ?)',
      [judul, isi, tipe || 'info']
    );
    return result.insertId;
  },

  // Hapus pengumuman
  async delete(id) {
    await db.query('DELETE FROM pengumuman WHERE id = ?', [id]);
  }
};

module.exports = PengumumanModel;
