const db = require('../config/db');

const PengaduanModel = {
  // Ambil semua pengaduan milik 1 user (untuk dashboard penghuni)
  async findByUserId(user_id) {
    const [rows] = await db.query(
      'SELECT * FROM pengaduan WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    return rows;
  },

  // Ambil beberapa pengaduan terbaru milik 1 user (untuk overview di dashboard)
  async findRecentByUserId(user_id, limit = 3) {
    const [rows] = await db.query(
      'SELECT * FROM pengaduan WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [user_id, limit]
    );
    return rows;
  },

  // Hitung jumlah pengaduan per status milik 1 user (untuk kartu statistik dashboard)
  async countByStatusForUser(user_id) {
    const [rows] = await db.query(
      `SELECT status, COUNT(*) AS total
       FROM pengaduan
       WHERE user_id = ?
       GROUP BY status`,
      [user_id]
    );
    const hasil = { menunggu: 0, diproses: 0, selesai: 0, total: 0 };
    rows.forEach((r) => {
      hasil[r.status] = r.total;
      hasil.total += r.total;
    });
    return hasil;
  },

  // Ambil semua pengaduan (untuk dashboard admin), join dengan tabel users
  // supaya tahu nama pelapor & nomor kamarnya
  async findAll(statusFilter) {
    let sql = `
      SELECT pengaduan.*, users.nama AS nama_pelapor, users.no_kamar
      FROM pengaduan
      JOIN users ON pengaduan.user_id = users.id
    `;
    const params = [];

    if (statusFilter && statusFilter !== 'semua') {
      sql += ' WHERE pengaduan.status = ?';
      params.push(statusFilter);
    }

    sql += ' ORDER BY pengaduan.created_at DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  },

  // Ambil 1 pengaduan berdasarkan id (untuk halaman detail)
  async findById(id) {
    const [rows] = await db.query(
      `SELECT pengaduan.*, users.nama AS nama_pelapor, users.no_kamar, users.no_hp
       FROM pengaduan
       JOIN users ON pengaduan.user_id = users.id
       WHERE pengaduan.id = ?`,
      [id]
    );
    return rows[0];
  },

  // Membuat pengaduan baru
  async create({ user_id, kategori, judul, deskripsi, foto, prioritas }) {
    const [result] = await db.query(
      'INSERT INTO pengaduan (user_id, kategori, judul, deskripsi, foto, prioritas) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, kategori, judul, deskripsi, foto, prioritas || 'Sedang']
    );
    return result.insertId;
  },

  // Update status & tanggapan admin (dipakai admin di halaman detail)
  async updateStatus(id, { status, tanggapan_admin }) {
    await db.query(
      'UPDATE pengaduan SET status = ?, tanggapan_admin = ? WHERE id = ?',
      [status, tanggapan_admin, id]
    );
  },

  // Hitung jumlah pengaduan per status (untuk statistik di dashboard admin)
  async countByStatus() {
    const [rows] = await db.query(
      `SELECT status, COUNT(*) AS total
       FROM pengaduan
       GROUP BY status`
    );
    // Ubah array hasil query menjadi object { menunggu: x, diproses: y, selesai: z }
    const hasil = { menunggu: 0, diproses: 0, selesai: 0, total: 0 };
    rows.forEach((r) => {
      hasil[r.status] = r.total;
      hasil.total += r.total;
    });
    return hasil;
  }
};

module.exports = PengaduanModel;
