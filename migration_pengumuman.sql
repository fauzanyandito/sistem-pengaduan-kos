-- ============================================
-- MIGRASI: Tabel pengumuman (Berita & Informasi Kos)
-- Jalankan file ini di database "pengaduan_kos" yang sudah ada
-- ============================================

USE pengaduan_kos;

CREATE TABLE IF NOT EXISTS pengumuman (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(150) NOT NULL,
  isi TEXT NOT NULL,
  tipe ENUM('info', 'peringatan') NOT NULL DEFAULT 'info',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contoh data awal (boleh dihapus/diganti lewat halaman admin)
INSERT INTO pengumuman (judul, isi, tipe) VALUES
('Perbaikan Pipa Tandon Air', 'Pompa air pendorong tandon atas akan diservis hari ini. Air harap ditampung terlebih dahulu di kamar mandi masing-masing.', 'info'),
('Kerja Bakti Minggu Ini', 'Untuk meminimalisir perkembangbiakan nyamuk demam berdarah di lingkungan kos, diharapkan seluruh penghuni turut menjaga kebersihan kamar dan lingkungan sekitar pada hari Minggu.', 'peringatan');
