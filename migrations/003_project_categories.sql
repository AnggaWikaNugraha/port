-- ============================================================
-- Project categories: pengelompokkan project berdasarkan jenis
-- produknya (E-commerce, LMS, CMS, ...) untuk section
-- "Project types" di halaman About.
--
-- Migration ini MURNI ADITIF: hanya membuat dua tabel baru.
-- Tabel `projects` yang sudah ada tidak diubah sama sekali —
-- relasinya disimpan terpisah, mengikuti pola `project_skills`.
--
-- Sengaja TIDAK ada seed: kategori diisi manual lewat
-- admin > Projects > Project Types.
-- ============================================================

-- 1. Master kategori
CREATE TABLE IF NOT EXISTS `project_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Relasi project ke kategori.
--    UNIQUE pada project_id = satu project hanya punya satu kategori.
--    Project yang tidak punya baris di sini = tanpa kategori, dan
--    otomatis tidak muncul di section "Project types".
CREATE TABLE IF NOT EXISTS `project_category_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` varchar(50) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_category_unique` (`project_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `project_category_map_project_fk`
    FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_category_map_category_fk`
    FOREIGN KEY (`category_id`) REFERENCES `project_categories` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
