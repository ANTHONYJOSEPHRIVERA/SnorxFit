-- Base de datos SnorxFit
-- Ejecutar en phpMyAdmin o MySQL Workbench

CREATE DATABASE IF NOT EXISTS snorxfit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE snorxfit_db;

-- Tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Tabla de perfiles de fitness
CREATE TABLE user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    age INT NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    height DECIMAL(5,2) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    goal ENUM('lose', 'gain', 'maintain') NOT NULL,
    activity_level ENUM('sedentary', 'light', 'moderate', 'active', 'very_active') NOT NULL,
    fitness_level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Tabla de seguimiento de peso
CREATE TABLE weight_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, date)
);

-- Tabla de seguimiento de ejercicios
CREATE TABLE workout_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exercise_name VARCHAR(255) NOT NULL,
    duration_minutes INT,
    calories_burned INT,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, date)
);

-- Tabla de comidas seleccionadas
CREATE TABLE user_foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_name VARCHAR(255) NOT NULL,
    calories_per_100g INT NOT NULL,
    protein_per_100g DECIMAL(5,2),
    carbs_per_100g DECIMAL(5,2),
    fat_per_100g DECIMAL(5,2),
    is_selected BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Tabla de sesiones (para autenticación)
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
);

-- Insertar algunos datos de ejemplo
INSERT INTO users (email, name, password) VALUES
('demo@snorxfit.com', 'Usuario Demo', '$2b$10$example_hash_for_password123'),
('snorlax@pokemon.com', 'Snorlax', '$2b$10$example_hash_for_sleep123');

-- Insertar perfil de ejemplo
INSERT INTO user_profiles (user_id, age, weight, height, gender, goal, activity_level, fitness_level) VALUES
(1, 25, 70.5, 175.0, 'male', 'maintain', 'moderate', 'beginner');