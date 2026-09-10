-- ============================================================
-- Skill categories: pengelompokkan user_skills
-- Jalankan sekali terhadap database portfolio.
-- ============================================================

-- 1. Tabel kategori
CREATE TABLE IF NOT EXISTS `skill_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Kolom kategori di user_skills (idempotent-ish: abaikan error kalau sudah ada)
ALTER TABLE `user_skills`
  ADD COLUMN `category_id` int(11) DEFAULT NULL AFTER `skill`,
  ADD KEY `category_id` (`category_id`);

-- 3. Skill ikut terhapus dari kategori tanpa ikut hilang datanya
ALTER TABLE `user_skills`
  ADD CONSTRAINT `user_skills_category_fk`
  FOREIGN KEY (`category_id`) REFERENCES `skill_categories` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 4. Seed kategori awal untuk user 1
INSERT INTO `skill_categories` (`user_id`, `name`, `sort_order`) VALUES
  (1, 'Frontend', 0),
  (1, 'Styling', 1),
  (1, 'Backend', 2),
  (1, 'Database', 3),
  (1, 'Infrastructure', 4);

-- 5. Petakan skill lama ke kategori (sesuaikan bila perlu)
UPDATE `user_skills` s
JOIN `skill_categories` c ON c.user_id = s.user_id AND c.name = 'Frontend'
SET s.category_id = c.id
WHERE s.user_id = 1 AND s.skill IN ('TypeScript','ssr','csr','React.js','Next.js','React Native','Redux','swr');

UPDATE `user_skills` s
JOIN `skill_categories` c ON c.user_id = s.user_id AND c.name = 'Styling'
SET s.category_id = c.id
WHERE s.user_id = 1 AND s.skill IN ('css','Tailwinds');

UPDATE `user_skills` s
JOIN `skill_categories` c ON c.user_id = s.user_id AND c.name = 'Backend'
SET s.category_id = c.id
WHERE s.user_id = 1 AND s.skill IN ('MERN','Express.js','laravel','JWT');

UPDATE `user_skills` s
JOIN `skill_categories` c ON c.user_id = s.user_id AND c.name = 'Database'
SET s.category_id = c.id
WHERE s.user_id = 1 AND s.skill IN ('moongodb','moongose','sql','MySql','orm','eloquen orm');

UPDATE `user_skills` s
JOIN `skill_categories` c ON c.user_id = s.user_id AND c.name = 'Infrastructure'
SET s.category_id = c.id
WHERE s.user_id = 1 AND s.skill IN ('vercel');
