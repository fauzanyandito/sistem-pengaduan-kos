const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file foto pengaduan
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    // Nama file: timestamp + ekstensi asli, contoh: 1718000000000.jpg
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

// Hanya izinkan file gambar
function fileFilter(req, file, cb) {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (jpg, jpeg, png, webp) yang diizinkan.'));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // maksimal 2MB
});

module.exports = upload;
