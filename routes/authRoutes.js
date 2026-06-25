const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

// ============ HALAMAN LOGIN ============
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect(
      req.session.user.role === 'admin'
        ? '/admin/dashboard'
        : '/dashboard'
    );
  }

  res.render('auth/login', { error: null });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);

    if (!user) {
      return res.render('auth/login', {
        error: 'Email atau password salah.'
      });
    }

    const cocok = await bcrypt.compare(password, user.password);

    if (!cocok) {
      return res.render('auth/login', {
        error: 'Email atau password salah.'
      });
    }

    req.session.user = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      no_kamar: user.no_kamar
    };

    if (user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    }

    return res.redirect('/dashboard');
  } catch (err) {
    console.error(err);

    return res.render('auth/login', {
      error: 'Terjadi kesalahan server. Coba lagi.'
    });
  }
});

// ============ HALAMAN REGISTER ============
router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }

  res.render('auth/register', { error: null });
});

router.post('/register', async (req, res) => {
  try {
    const {
      nama,
      email,
      password,
      konfirmasi_password,
      no_kamar,
      no_hp
    } = req.body;

    if (!nama || !email || !password) {
      return res.render('auth/register', {
        error: 'Nama, email, dan password wajib diisi.'
      });
    }

    if (password !== konfirmasi_password) {
      return res.render('auth/register', {
        error: 'Konfirmasi password tidak cocok.'
      });
    }

    const userAda = await UserModel.findByEmail(email);

    if (userAda) {
      return res.render('auth/register', {
        error: 'Email sudah terdaftar, silakan login.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      nama,
      email,
      password: hashedPassword,
      no_kamar,
      no_hp,
      role: 'penghuni'
    });

    res.redirect('/login');
  } catch (err) {
    console.error(err);

    res.render('auth/register', {
      error: 'Terjadi kesalahan server. Coba lagi.'
    });
  }
});

// ============ LOGOUT ============
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;