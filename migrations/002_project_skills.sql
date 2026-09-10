-- ============================================================
-- Project skills: relasi project ke master user_skills
-- Menggantikan kolom projects.tech_stack (free text JSON).
--
-- Kolom tech_stack SENGAJA tidak di-drop: datanya dibiarkan
-- sebagai cadangan dan sudah tidak dibaca kode mana pun.
-- Salinan bacanya ada di migrations/tech-stack-lama.md
-- ============================================================

CREATE TABLE IF NOT EXISTS `project_skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` varchar(50) NOT NULL,
  `skill_id` int(11) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_skill_unique` (`project_id`, `skill_id`),
  KEY `project_id` (`project_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `project_skills_project_fk`
    FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_skills_skill_fk`
    FOREIGN KEY (`skill_id`) REFERENCES `user_skills` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
