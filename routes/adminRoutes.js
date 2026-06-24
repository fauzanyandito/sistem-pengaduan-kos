const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware/auth');
const PengaduanModel = require('../models/pengaduanModel');
const PengumumanModel = require('../models/pengumumanModel');

// ============ DASHBOARD ADMIN ============
// Menampilkan semua pengaduan dari seluruh penghuni, bisa difilter berdasarkan status
router.get('/admin/dashboard', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const statusFilter = req.query.status || 'semua';
    const daftarPengaduan = await PengaduanModel.findAll(statusFilter);
    const statistik = await PengaduanModel.countByStatus();

    res.render('admin/dashboard', {
      user: req.session.user,
      activePage: 'dashboard',
      daftarPengaduan,
      statistik,
      statusFilter
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan server.');
  }
});

// ============ DETAIL PENGADUAN + FORM UPDATE STATUS ============
router.get('/admin/pengaduan/:id', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const pengaduan = await PengaduanModel.findById(req.params.id);
    if (!pengaduan) {
      return res.status(404).send('Pengaduan tidak ditemukan.');
    }
    res.render('admin/detail', { user: req.session.user, activePage: 'dashboard', pengaduan });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan server.');
  }
});

// ============ UPDATE STATUS & TANGGAPAN ============
router.post('/admin/pengaduan/:id', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const { status, tanggapan_admin } = req.body;
    await PengaduanModel.updateStatus(req.params.id, { status, tanggapan_admin });
    res.redirect('/admin/pengaduan/' + req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan server.');
  }
});

// ============ KELOLA BERITA & INFORMASI KOS (PENGUMUMAN) ============
router.get('/admin/pengumuman', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const daftarPengumuman = await PengumumanModel.findAll();
    res.render('admin/pengumuman', {
      user: req.session.user,
      activePage: 'pengumuman',
      daftarPengumuman,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan server.');
  }
});

router.post('/admin/pengumuman', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const { judul, isi, tipe } = req.body;
    if (!judul || !isi) {
      const daftarPengumuman = await PengumumanModel.findAll();
      return res.render('admin/pengumuman', {
        user: req.session.user,
        activePage: 'pengumuman',
        daftarPengumuman,
        error: 'Judul dan isi pengumuman wajib diisi.'
      });
    }
    await PengumumanModel.create({ judul, isi, tipe });
    res.redirect('/admin/pengumuman');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan server.');
  }
});

router.post('/admin/pengumuman/:id/hapus', isLoggedIn, isAdmin, async (req, res) => {
  try {
    await PengumumanModel.delete(req.params.id);
    res.redirect('/admin/pengumuman');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan server.');
  }
});

module.exports = router;
