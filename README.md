# Sistem Pengaduan Kos

Aplikasi web sederhana untuk mencatat dan menindaklanjuti pengaduan penghuni kos
(misalnya: atap bocor, ada serangga, fasilitas rusak, dll) tanpa harus
menghubungi pemilik kos lewat WhatsApp.

**Stack:** Node.js, Express.js, MySQL (mysql2), EJS, express-session, bcryptjs, multer.

---

## 0. Anggota Kelompok
- Andhika Maulana Dyas S (202451161)
- Ahmad Fauzan (202451168)
- Noverdo Rizqi (202451169)
- M. Rizki Fatur Rohman (202451173)

## 1. Struktur Folder

```
sistem-pengaduan-kos/
├── config/
│   └── db.js              # koneksi ke database MySQL
├── middleware/
│   ├── auth.js            # cek login & cek role (penghuni/admin)
│   └── upload.js          # konfigurasi upload foto (multer)
├── models/
│   ├── userModel.js        # query terkait tabel users
│   └── pengaduanModel.js   # query terkait tabel pengaduan
├── routes/
│   ├── authRoutes.js       # login, register, logout
│   ├── penghuniRoutes.js   # dashboard penghuni, buat pengaduan, detail
│   └── adminRoutes.js      # dashboard admin, update status pengaduan
├── views/
│   ├── partials/           # header & footer (dipakai semua halaman)
│   ├── auth/                # login, register
│   ├── penghuni/            # dashboard, form, detail (penghuni)
│   └── admin/                # dashboard, detail (admin)
├── public/
│   ├── css/style.css
│   └── uploads/             # tempat foto pengaduan disimpan
├── database.sql            # struktur tabel database
├── seed.js                  # buat akun admin default
├── server.js                # entry point aplikasi
└── .env.example
```

---

## 2. Cara Menjalankan (Step by Step)

### a. Install dependencies
```bash
npm install
```

### b. Siapkan database
1. Buka MySQL (XAMPP/Laragon/dll, pastikan service MySQL aktif).
2. Import file `database.sql`, contoh lewat phpMyAdmin (tab "Import"),
   atau lewat terminal:
   ```bash
   mysql -u root -p < database.sql
   ```
   Ini akan membuat database `pengaduan_kos` beserta tabel `users` dan `pengaduan`.

### c. Konfigurasi environment
1. Copy file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
2. Sesuaikan isi `.env` dengan konfigurasi MySQL kamu (host, user, password).

### d. Buat akun admin default
```bash
npm run seed
```
Ini akan membuat akun admin dengan:
- Email: `admin@koskita.com`
- Password: `admin123`

### e. Jalankan server
```bash
npm run dev
```
atau
```bash
npm start
```
Lalu buka browser ke: **http://localhost:3000**

---

## 3. Alur Penggunaan

### Sebagai Penghuni
1. Buka `/register` untuk membuat akun (isi nama, email, password, nomor kamar).
2. Login di `/login`.
3. Klik **"Buat Pengaduan"** untuk melapor masalah (pilih kategori, judul,
   deskripsi, dan opsional upload foto).
4. Pengaduan akan muncul di dashboard dengan status **Menunggu**.
5. Klik pengaduan untuk melihat detail dan tanggapan dari admin.

### Sebagai Admin / Pemilik Kos
1. Login dengan akun admin (`admin@koskita.com` / `admin123`).
2. Dashboard admin menampilkan semua pengaduan dari seluruh penghuni,
   beserta statistik (total, menunggu, diproses, selesai).
3. Klik salah satu pengaduan untuk melihat detail, lalu:
   - Ubah **status** (Menunggu → Diproses → Selesai)
   - Tulis **tanggapan** untuk penghuni (misalnya: "Sudah dijadwalkan
     perbaikan besok pagi")
4. Penghuni bisa melihat update status dan tanggapan ini di halaman
   detail pengaduan miliknya.

---

## 4. Troubleshooting

- **Error `ER_ACCESS_DENIED_ERROR` / koneksi database gagal**
  Cek kembali `DB_USER` dan `DB_PASSWORD` di file `.env`, sesuaikan
  dengan konfigurasi MySQL di komputer kamu.

- **Error `ER_BAD_DB_ERROR: Unknown database 'pengaduan_kos'`**
  Pastikan sudah import `database.sql` terlebih dahulu.

- **Foto tidak muncul**
  Pastikan folder `public/uploads` ada dan aplikasi punya izin tulis ke folder tersebut. Dan itu harus berjalan
