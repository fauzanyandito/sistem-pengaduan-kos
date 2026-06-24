-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 24 Jun 2026 pada 17.53
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pengaduan_kos`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengaduan`
--

CREATE TABLE `pengaduan` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `kategori` varchar(50) NOT NULL,
  `judul` varchar(150) NOT NULL,
  `deskripsi` text NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `status` enum('menunggu','diproses','selesai') NOT NULL DEFAULT 'menunggu',
  `tanggapan_admin` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `prioritas` enum('Rendah','Sedang','Tinggi') DEFAULT 'Sedang'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `pengaduan`
--

INSERT INTO `pengaduan` (`id`, `user_id`, `kategori`, `judul`, `deskripsi`, `foto`, `status`, `tanggapan_admin`, `created_at`, `updated_at`, `prioritas`) VALUES
(1, 2, 'Kebersihan', 'atap-A14', 'bocor', NULL, 'selesai', 'sudah diperbaiki ya', '2026-06-13 07:22:10', '2026-06-13 07:22:55', 'Sedang'),
(2, 3, 'Hama/Serangga', 'Dikamar B-12 ada serangga', 'ada kecoa dibawah tempat tidurku, aing takut', '1781341027177.jpg', 'selesai', 'Tolong tenang donature kami akan datang', '2026-06-13 08:57:07', '2026-06-24 14:01:50', 'Sedang'),
(3, 4, 'Kerusakan Fasilitas', 'Atap Bocor', 'Atap Bagian Tempat Tidur bocor', '1782315294464.jpg', 'selesai', '', '2026-06-24 15:34:54', '2026-06-24 15:35:58', ''),
(4, 4, 'Kerusakan Fasilitas', 'Atap Bocor', 'a', '1782315322669.jpg', 'selesai', '', '2026-06-24 15:35:22', '2026-06-24 15:35:52', 'Sedang');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengumuman`
--

CREATE TABLE `pengumuman` (
  `id` int(11) NOT NULL,
  `judul` varchar(150) NOT NULL,
  `isi` text NOT NULL,
  `tipe` enum('info','peringatan') NOT NULL DEFAULT 'info',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `pengumuman`
--

INSERT INTO `pengumuman` (`id`, `judul`, `isi`, `tipe`, `created_at`) VALUES
(1, 'Perbaikan Pipa Tandon Air', 'Pompa air pendorong tandon atas akan diservis hari ini. Air harap ditampung terlebih dahulu di kamar mandi masing-masing.', 'info', '2026-06-13 06:34:58'),
(2, 'Kerja Bakti Minggu Ini', 'Untuk meminimalisir perkembangbiakan nyamuk demam berdarah di lingkungan kos, diharapkan seluruh penghuni turut menjaga kebersihan kamar dan lingkungan sekitar pada hari Minggu.', 'peringatan', '2026-06-13 06:34:58');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `no_kamar` varchar(20) DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `role` enum('penghuni','admin') NOT NULL DEFAULT 'penghuni',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `no_kamar`, `no_hp`, `role`, `created_at`) VALUES
(1, 'Admin Kos', 'admin@koskita.com', '$2a$10$Pvi8A8YTpeIjaLAgeTkGVeFsBIX8MuHLpqtL6uNiUXbtWaUI6d2am', NULL, '0812-3456-7890', 'admin', '2026-06-13 06:36:24'),
(2, 'fauzan', 'fauzan123@gmail.com', '$2a$10$dhKcRMWJt9L0UIqDy.MNqekm.1v27cuLhqhRFUHyCaAFPGfqIdhB6', 'A-14', '0812-3456-7890', 'penghuni', '2026-06-13 06:37:27'),
(3, 'Rizki Fathur', 'Fathur@gmail.com', '$2a$10$td66esw7MoKNFPbs6.rdMe6PwX.k3hs0BTIO4Iab0wV9j9vlAd0u.', 'B-12', '085871486307', 'penghuni', '2026-06-13 08:53:12'),
(4, 'NoamSagala', 'Noam@gmail.com', '$2a$10$Uos/UY0dTy5DpCCcNO0oBelLNvjnXeqBlsmhGP21ycYafR6zlDptS', 'C - 12', '087777777777', 'penghuni', '2026-06-24 14:20:25');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `pengaduan`
--
ALTER TABLE `pengaduan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `pengumuman`
--
ALTER TABLE `pengumuman`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `pengaduan`
--
ALTER TABLE `pengaduan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `pengumuman`
--
ALTER TABLE `pengumuman`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `pengaduan`
--
ALTER TABLE `pengaduan`
  ADD CONSTRAINT `pengaduan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
