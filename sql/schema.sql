-- ============================================================
-- Scholarship Portal — database schema
-- Run this whole file in MySQL Workbench (as one script)
-- ============================================================

CREATE DATABASE IF NOT EXISTS scholarship_portal;
USE scholarship_portal;

-- Every registered student / awardee
CREATE TABLE students (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(120) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    university      VARCHAR(100),
    course          VARCHAR(100),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fresh scholarship applications (from Freshform.html)
CREATE TABLE applications (
    id                    INT AUTO_INCREMENT PRIMARY KEY,
    student_id            INT NOT NULL,
    address               TEXT,
    course                VARCHAR(100),
    university            VARCHAR(100),
    academic_records_path VARCHAR(255),
    personal_statement    TEXT,
    reference_letter_path VARCHAR(255),
    status                ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    submitted_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Renewal submissions (from dashboard2.html)
CREATE TABLE renewals (
    id                    INT AUTO_INCREMENT PRIMARY KEY,
    student_id            INT NOT NULL,
    year_of_study         INT NOT NULL,
    academic_records_path VARCHAR(255),
    status                ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    submitted_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Quick sanity check after running this script:
-- SHOW TABLES;
