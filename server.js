const express = require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const penghuniRoutes = require('./routes/penghuniRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// ============ KONFIGURASI VIEW ENGINE (EJS) ============
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============ MIDDLEWARE BAWAAN ============
app.use(express.urlencoded({ extended: true })); // membaca data dari form HTML
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // folder untuk CSS, gambar, dll
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============ MIDDLEWARE SESSION (untuk login) ============
app.use(session({
  secret: process.env.SESSION_SECRET || 'rahasia-default',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // sesi aktif selama 2 jam
}));

// Middleware untuk membuat variabel "user" otomatis tersedia di semua view EJS
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ============ ROUTES ============
app.use('/', authRoutes);
app.use('/', penghuniRoutes);
app.use('/', adminRoutes);

// Halaman utama: redirect berdasarkan status login
app.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  if (req.session.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  return res.redirect('/dashboard');
});

// ============ HANDLER ERROR UPLOAD FILE ============
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.send(`
      <script>
        alert("Ukuran file terlalu besar. Maksimal 2MB.");
        window.history.back();
      </script>
    `);
  }

  console.error(err);
  res.status(500).send('Terjadi kesalahan server.');
});

// ============ HANDLER 404 ============
app.use((req, res) => {
  res.status(404).send('Halaman tidak ditemukan.');
});

// ============ JALANKAN SERVER ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});