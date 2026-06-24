const express = require('express');
const router = express.Router();
const { isLoggedIn, isPenghuni } = require('../middleware/auth');
const upload = require('../middleware/upload');
const PengaduanModel = require('../models/pengaduanModel');
const PengumumanModel = require('../models/pengumumanModel');
const UserModel = require('../models/userModel');

// ============ DASHBOARD PENGHUNI ============
// Menampilkan ringkasan statistik, laporan terbaru, dan info kos
router.get('/dashboard', isLoggedIn, isPenghuni, async (req, res) => {
  try {
    const statistik = await PengaduanModel.countByStatusForUser(req.session.user.id);
    const laporanTerbaru = await PengaduanModel.findRecentByUserId(req.session.user.id, 5);
    const pengumuman = await PengumumanModel.findLatest(3);
    const ownerContact = await UserModel.findOwner();

    res.render('penghuni/dashboard', {
      user: req.session.user,
      activePage: 'dashboard',
      statistik,
      laporanTerbaru,
      pengumuman,
      ownerContact
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan server.');
  }
});

// ============ RIWAYAT & STATUS (semua pengaduan milik penghuni) ============
router.get('/riwayat', isLoggedIn, isPenghuni, async (req, res) => {
  try {
    const daftarPengaduan = await PengaduanModel.findByUserId(req.session.user.id);
    const ownerContact = await UserModel.findOwner();
    res.render('penghuni/riwayat', {
      user: req.session.user,
      activePage: 'riwayat',
      daftarPengaduan,
      ownerContact
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan server.');
  }
});

// ============ FORM BUAT PENGADUAN BARU ============
router.get('/pengaduan/baru', isLoggedIn, isPenghuni, async (req, res) => {
  const ownerContact = await UserModel.findOwner();
  res.render('penghuni/form', { user: req.session.user, activePage: 'lapor', ownerContact, error: null });
});

router.post('/pengaduan', isLoggedIn, isPenghuni, upload.single('foto'), async (req, res) => {
  try {
    const { kategori, judul, deskripsi, prioritas } = req.body;
    const ownerContact = await UserModel.findOwner();

    if (!kategori || !judul || !deskripsi) {
      return res.render('penghuni/form', {
        user: req.session.user,
        activePage: 'lapor',
        ownerContact,
        error: 'Semua field wajib diisi.'
      });
    }

    // Jika ada file foto yang diupload, simpan nama filenya saja
    const foto = req.file ? req.file.filename : null;

    await PengaduanModel.create({
      user_id: req.session.user.id,
      kategori,
      judul,
      deskripsi,
      foto,
      prioritas
    });

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    const ownerContact = await UserModel.findOwner();
    res.render('penghuni/form', {
      user: req.session.user,
      activePage: 'lapor',
      ownerContact,
      error: 'Terjadi kesalahan saat mengirim pengaduan. Coba lagi.'
    });
  }
});

// ============ DETAIL PENGADUAN (milik sendiri) ============
router.get('/pengaduan/:id', isLoggedIn, isPenghuni, async (req, res) => {
  try {
    const pengaduan = await PengaduanModel.findById(req.params.id);

    // Pastikan pengaduan ada dan memang milik user yang login
    if (!pengaduan || pengaduan.user_id !== req.session.user.id) {
      return res.status(404).send('Pengaduan tidak ditemukan.');
    }

    const ownerContact = await UserModel.findOwner();
    res.render('penghuni/detail', { user: req.session.user, activePage: 'riwayat', ownerContact, pengaduan });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan server.');
  }
});

module.exports = router;
