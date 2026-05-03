-- ============================================================
--  PORTFOLIO DATABASE SCHEMA
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id            INT             NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)    DEFAULT NULL,
  username      VARCHAR(100)    DEFAULT NULL,
  bio           TEXT            DEFAULT NULL,
  email         VARCHAR(150)    NOT NULL UNIQUE,
  password      VARCHAR(255)    DEFAULT NULL,
  phone         VARCHAR(20)     DEFAULT NULL,
  location      VARCHAR(100)    DEFAULT NULL,
  avatar_url    VARCHAR(500)    DEFAULT NULL,
  job_title     VARCHAR(100)    DEFAULT NULL,
  company       VARCHAR(100)    DEFAULT NULL,
  website       VARCHAR(255)    DEFAULT NULL,
  github        VARCHAR(255)    DEFAULT NULL,
  linkedin      VARCHAR(255)    DEFAULT NULL,
  twitter       VARCHAR(255)    DEFAULT NULL,
  instagram     VARCHAR(255)    DEFAULT NULL,
  created_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_skills (
  id            INT             NOT NULL AUTO_INCREMENT,
  user_id       INT             NOT NULL,
  skill         VARCHAR(100)    NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_interests (
  id            VARCHAR(50)     NOT NULL,
  user_id       INT             NOT NULL,
  interest      VARCHAR(100)    NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS experience (
  id                VARCHAR(50)     NOT NULL,
  user_id           INT             NOT NULL,
  company           VARCHAR(150)    NOT NULL,
  company_logo_url  VARCHAR(500)    DEFAULT NULL,
  location          VARCHAR(100)    DEFAULT NULL,
  created_at        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS roles (
  id                VARCHAR(50)     NOT NULL,
  experience_id     VARCHAR(50)     NOT NULL,
  title             VARCHAR(150)    NOT NULL,
  employment_type   VARCHAR(50)     DEFAULT NULL,
  start_date        VARCHAR(20)     DEFAULT NULL,
  end_date          VARCHAR(20)     DEFAULT NULL,
  duration          VARCHAR(50)     DEFAULT NULL,
  description       TEXT            DEFAULT NULL,
  product_link      VARCHAR(500)    DEFAULT NULL,
  product_title     VARCHAR(150)    DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (experience_id) REFERENCES experience(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS certificates (
  id                CHAR(36)        NOT NULL DEFAULT (UUID()),
  user_id           INT             NOT NULL,
  title             VARCHAR(200)    NOT NULL,
  issuer            VARCHAR(150)    DEFAULT NULL,
  issue_date        DATE            DEFAULT NULL,
  expiration_date   DATE            DEFAULT NULL,
  credential_url    VARCHAR(500)    DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
--  SEED: Admin user
--  email    : angga@admin
--  password : Ciamis1998.
-- ============================================================

INSERT INTO users (name, email, password) VALUES (
  'Angga Wika',
  'angga@admin',
  '$2b$10$uU0Xo/Q6dAEMTI8TkGZxzuugcCt/ZVvBELgQx.p3na9O4/KUtkQ4.'
);
