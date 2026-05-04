-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 04, 2026 at 05:33 AM
-- Server version: 11.8.6-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u858890408_portfolio`
--

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `issuer` varchar(150) DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `credential_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `certificates`
--

INSERT INTO `certificates` (`id`, `user_id`, `title`, `issuer`, `issue_date`, `expiration_date`, `credential_url`) VALUES
('9339601e-475c-11f1-8a3e-a578669acf42', 1, 'BNSP', 'Programmer', '2022-01-01', '2024-01-01', '');

-- --------------------------------------------------------

--
-- Table structure for table `experience`
--

CREATE TABLE `experience` (
  `id` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `company` varchar(150) NOT NULL,
  `company_logo_url` varchar(500) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `experience`
--

INSERT INTO `experience` (`id`, `user_id`, `company`, `company_logo_url`, `location`, `created_at`) VALUES
('exp_1777858480868', 1, 'PT Bank Rakyat Indonesia (Persero) Tbk', 'https://media.licdn.com/dms/image/v2/D560BAQEcIL69s1MLPg/company-logo_100_100/B56Zvfz8tXJ8AU-/0/1768986497873/pt_bank_rakyat_indonesia_persero_tbk_logo?e=1779321600&v=beta&t=rO9wCT6IIcTv3YozDNeANY961y2Mo0VxIbzHBZ0BsJ4', 'Jakarta Selatan', '2026-05-04 01:34:41'),
('exp_1777859032646', 1, 'Telkom Indonesia', 'https://media.licdn.com/dms/image/v2/C4D0BAQGVLh28SyAv-g/company-logo_100_100/company-logo_100_100/0/1631315215307?e=1779321600&v=beta&t=bESEu_vAabYC9nau5cdFsFIa_gl_rmvhHoenOPwMH10', 'remote, (wfh)', '2026-05-04 01:43:52');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `tech_stack` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tech_stack`)),
  `year` varchar(10) DEFAULT NULL,
  `status` enum('completed','in-progress','archived') DEFAULT 'completed',
  `featured` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `is_private` tinyint(1) DEFAULT 0,
  `demo_url` varchar(500) DEFAULT NULL,
  `repo_url` varchar(500) DEFAULT NULL,
  `cover_image` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `user_id`, `title`, `description`, `role`, `company`, `tech_stack`, `year`, `status`, `featured`, `sort_order`, `is_private`, `demo_url`, `repo_url`, `cover_image`, `created_at`, `updated_at`) VALUES
('proj_1777863955323', 1, 'AI Sales Page Generator', 'AI Sales Page Generator is a web application that allows users to create complete and persuasive sales pages simply by providing basic information about their product or service.\n\nThis application is built using a decoupled architecture — the React frontend is deployed on Vercel, the Laravel API backend is deployed on Hostinger, and the MySQL database is hosted online. The frontend and backend communicate via REST APIs with token-based authentication using Laravel Sanctum.\n', 'Fullstack Developer', 'Own Project', '[\"Laravel\",\"Sanctum\",\"MySql\",\"React\",\"Axios\",\"Tailwinds\",\"Vercel\",\"Cpanel\"]', '2026', 'completed', 1, 0, 0, 'https://sales-ai-page-generator.vercel.app', 'https://github.com/AnggaWikaNugraha/sales-ai-page-generator', 'https://res.cloudinary.com/djjzev9mv/image/upload/v1777865133/portfolio/cw8hsqebbiq1wyntxk8h.png', '2026-05-04 03:05:55', '2026-05-04 05:26:55');

-- --------------------------------------------------------

--
-- Table structure for table `project_flows`
--

CREATE TABLE `project_flows` (
  `id` varchar(50) NOT NULL,
  `project_id` varchar(50) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_flows`
--

INSERT INTO `project_flows` (`id`, `project_id`, `title`, `description`, `image_url`, `sort_order`) VALUES
('flow_1777865594860', 'proj_1777863955323', 'Login', 'This form calls the POST `/api/auth/register` endpoint in Laravel. The password is hashed using bcrypt before being stored in the database.\n\nAfter a successful registration, Laravel Sanctum generates a unique token for the user. This token is stored in the browser’s localStorage and will be sent with every subsequent request as an `Authorization: Bearer` token.\n', 'https://res.cloudinary.com/djjzev9mv/image/upload/v1777865557/portfolio/k52zbuxio0kgtzzdciqm.png', 0),
('flow_1777865920120', 'proj_1777863955323', 'Generates Pages', 'This is the main page. Users can choose a design template first — there are three options: Modern, Bold, and Minimal. Each has a different visual style but uses the same content structure.\n\nThen, users fill in the product information: product name, description, features, target audience, price, and unique selling point.\n\nWhen clicking Generate, React sends a POST request to `/api/sales-pages` to the backend, including the token in the header. Laravel validates the input, then generates the sales page content — currently using structured content generation, and it is ready to be integrated with AI APIs such as OpenAI or Anthropic.\n\nThe result is saved to the database, and the user is immediately redirected to the preview page.\n', 'https://res.cloudinary.com/djjzev9mv/image/upload/v1777865824/portfolio/ql4rjxyeda1tu12titu9.png', 0),
('flow_1777866624123', 'proj_1777863955323', 'Result Ai Pages', 'This is the generated result — a complete sales page with a headline, sub-headline, product description, benefits, features, testimonials, pricing, and a call-to-action.\n\nUsers can switch templates here without needing to regenerate — simply click the desired template and the appearance will update instantly.\n\nOne bonus feature I implemented is section-by-section regeneration. Users can regenerate only specific parts — for example, just the headline or only the CTA — without affecting other sections. This calls the POST `/api/sales-pages/{id}/regenerate-section` endpoint with a parameter specifying which section to update.\n', 'https://res.cloudinary.com/djjzev9mv/image/upload/v1777866613/portfolio/knxehvdttmfyk8ilglrv.png', 0),
('flow_1777866705863', 'proj_1777863955323', 'History', 'history generates', 'https://res.cloudinary.com/djjzev9mv/image/upload/v1777866687/portfolio/sx83mlxurmxosry0hj52.png', 0),
('flow_1777866971317', 'proj_1777863955323', 'Tools ', 'tools:\n\nIn the preview, users can switch between Modern, Bold, and Minimal designs, and also generate from the start.\nExport functionality is available in PDF and text formats.\nSupports generation per section.', 'https://res.cloudinary.com/djjzev9mv/image/upload/v1777867049/portfolio/oauwwbkwxk69xycbi9oe.png', 0);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` varchar(50) NOT NULL,
  `experience_id` varchar(50) NOT NULL,
  `title` varchar(150) NOT NULL,
  `employment_type` varchar(50) DEFAULT NULL,
  `start_date` varchar(20) DEFAULT NULL,
  `end_date` varchar(20) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `product_link` varchar(500) DEFAULT NULL,
  `product_title` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `experience_id`, `title`, `employment_type`, `start_date`, `end_date`, `duration`, `description`, `product_link`, `product_title`) VALUES
('role_1777858636831', 'exp_1777858480868', ' Frontend Developer', 'kontrak', '2025-02-01', '2025-07-31', NULL, '\nDeveloping Web and Mobile Squad Senyum using Next.js dan React Native', NULL, NULL),
('role_1777858801973', 'exp_1777858480868', 'Frontend Developer', 'Kontrak', '2025-07-01', NULL, NULL, 'At qlola squad Serena as a Frontend dev create global components based on atomic design principles for MFE architecture, and develop QR transaction approval', NULL, NULL),
('role_1777859158279', 'exp_1777859032646', 'Frontend Developer ', 'Kontrak', '2022-01-04', NULL, NULL, 'Frontend Developer at Talent Engine by Telkom as Currently working on a project-based remote job.', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `job_title` varchar(100) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `bio`, `email`, `password`, `phone`, `location`, `avatar_url`, `job_title`, `company`, `website`, `github`, `linkedin`, `twitter`, `instagram`, `created_at`, `updated_at`) VALUES
(1, 'Angga Wika Nugraha', 'Angga Wika', 'Frontend Engineer with 5+ years of professional experience in developing and maintaining web and mobile applications. ', 'anggawika18@gmail.com', '$2b$10$uU0Xo/Q6dAEMTI8TkGZxzuugcCt/ZVvBELgQx.p3na9O4/KUtkQ4.', '088228925868', 'Jakarta selatan', 'https://media.licdn.com/dms/image/v2/D5603AQFx0LkAHjx-3w/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1716261567983?e=1779321600&v=beta&t=jlLC__TZopRkA6Mip3F_b7kuld2ekSfHrYHxiod0OZE', 'Frontend Developer', 'PT Bank Rakyat Indonesia', 'https://port-tau-azure.vercel.app/', NULL, NULL, NULL, NULL, '2026-05-03 10:25:27', '2026-05-04 01:02:28');

-- --------------------------------------------------------

--
-- Table structure for table `user_interests`
--

CREATE TABLE `user_interests` (
  `id` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `interest` varchar(100) NOT NULL,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_interests`
--

INSERT INTO `user_interests` (`id`, `user_id`, `interest`, `sort_order`) VALUES
('int_1777856767170', 1, 'Micro Frontend', 0),
('int_1777856776116', 1, 'Backend', 2),
('int_1777856804280', 1, 'Module Federations', 1),
('int_1777857099234', 1, 'Micro Services', 3);

-- --------------------------------------------------------

--
-- Table structure for table `user_skills`
--

CREATE TABLE `user_skills` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `skill` varchar(100) NOT NULL,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_skills`
--

INSERT INTO `user_skills` (`id`, `user_id`, `skill`, `sort_order`) VALUES
(1, 1, 'TypeScript', 0),
(2, 1, 'ssr', 1),
(3, 1, 'csr', 2),
(4, 1, 'React.js', 3),
(5, 1, 'Next.js', 4),
(6, 1, 'React Native', 5),
(7, 1, 'Redux', 6),
(8, 1, 'swr', 7),
(9, 1, 'laravel', 10),
(10, 1, 'sql', 11),
(11, 1, 'orm', 12),
(12, 1, 'JWT', 13),
(13, 1, 'css', 8),
(14, 1, 'Tailwinds', 9);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `experience`
--
ALTER TABLE `experience`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `project_flows`
--
ALTER TABLE `project_flows`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `experience_id` (`experience_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_interests`
--
ALTER TABLE `user_interests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_skills`
--
ALTER TABLE `user_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_skills`
--
ALTER TABLE `user_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `experience`
--
ALTER TABLE `experience`
  ADD CONSTRAINT `experience_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_flows`
--
ALTER TABLE `project_flows`
  ADD CONSTRAINT `project_flows_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`experience_id`) REFERENCES `experience` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_interests`
--
ALTER TABLE `user_interests`
  ADD CONSTRAINT `user_interests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_skills`
--
ALTER TABLE `user_skills`
  ADD CONSTRAINT `user_skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
