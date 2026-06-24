// Script ini digunakan untuk membuat akun ADMIN default secara otomatis.
// Cara menjalankan: npm run seed   (atau: node seed.js)

const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function seed() {
  try {
    const email = 'admin@koskita.com';
    const passwordPolos = 'admin123';

    // Cek apakah admin sudah ada agar tidak dobel
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      console.log('Akun admin sudah ada. Tidak perlu seed ulang.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(passwordPolos, 10);

    await db.query(
      'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin Kos', email, hashedPassword, 'admin']
    );

    console.log('======================================');
    console.log('Akun admin berhasil dibuat!');
    console.log('Email   :', email);
    console.log('Password:', passwordPolos);
    console.log('======================================');
    process.exit(0);
  } catch (err) {
    console.error('Gagal membuat akun admin:', err);
    process.exit(1);
  }
}

seed();
