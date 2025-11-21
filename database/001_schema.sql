-- =============================================================
-- SnorxFit - Esquema Base de Base de Datos (MySQL 8+)
-- Fecha: 2025-09-29
-- NOTA: Revisa nombres y ajusta si ya existen tablas previas.
-- Ejecutar de forma segura: cada CREATE usa IF NOT EXISTS.
-- Charset / Collation: utf8mb4 para soportar emojis.
-- =============================================================

-- (Opcional) SET GLOBAL sql_require_primary_key=ON;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================
-- Tabla: users
-- =============================================================
CREATE TABLE IF NOT EXISTS users (
  id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(150) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  last_login_at   DATETIME NULL,
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Tabla: user_profiles (perfil extendido + métricas de salud)
-- =============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id                BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id           BIGINT UNSIGNED NOT NULL UNIQUE,
  birth_date        DATE NULL,
  gender            ENUM('male','female','other') DEFAULT 'male',
  height_cm         DECIMAL(5,2) NULL,
  weight_kg         DECIMAL(5,2) NULL,
  activity_level    ENUM('sedentary','light','moderate','active','veryActive') DEFAULT 'moderate',
  fitness_level     ENUM('beginner','intermediate','advanced') DEFAULT 'beginner',
  goal              ENUM('lose','maintain','gain') DEFAULT 'maintain',
  imc               DECIMAL(5,2) NULL,
  imc_category      VARCHAR(30) NULL,
  allergies         TEXT NULL,
  chronic_diseases  TEXT NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trigger para autocalcular IMC y categoría si hay peso y altura.
DROP TRIGGER IF EXISTS trg_user_profiles_bi;
DELIMITER $$
CREATE TRIGGER trg_user_profiles_bi
BEFORE INSERT ON user_profiles FOR EACH ROW
BEGIN
  IF NEW.weight_kg IS NOT NULL AND NEW.height_cm IS NOT NULL AND NEW.height_cm > 0 THEN
    SET NEW.imc = ROUND(NEW.weight_kg / POW(NEW.height_cm/100, 2), 2);
    SET NEW.imc_category = (
      CASE
        WHEN NEW.imc < 18.5 THEN 'Bajo peso'
        WHEN NEW.imc < 25 THEN 'Peso normal'
        WHEN NEW.imc < 30 THEN 'Sobrepeso'
        ELSE 'Obesidad'
      END
    );
  END IF;
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS trg_user_profiles_bu;
DELIMITER $$
CREATE TRIGGER trg_user_profiles_bu
BEFORE UPDATE ON user_profiles FOR EACH ROW
BEGIN
  IF NEW.weight_kg IS NOT NULL AND NEW.height_cm IS NOT NULL AND NEW.height_cm > 0 THEN
    SET NEW.imc = ROUND(NEW.weight_kg / POW(NEW.height_cm/100, 2), 2);
    SET NEW.imc_category = (
      CASE
        WHEN NEW.imc < 18.5 THEN 'Bajo peso'
        WHEN NEW.imc < 25 THEN 'Peso normal'
        WHEN NEW.imc < 30 THEN 'Sobrepeso'
        ELSE 'Obesidad'
      END
    );
  END IF;
END$$
DELIMITER ;

-- =============================================================
-- Tabla: user_weights (histórico de peso)
-- =============================================================
CREATE TABLE IF NOT EXISTS user_weights (
  id           BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id      BIGINT UNSIGNED NOT NULL,
  weight_kg    DECIMAL(5,2) NOT NULL,
  recorded_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_weights_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_weights_user_time (user_id, recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Tabla: user_moods (diario emocional)
-- =============================================================
CREATE TABLE IF NOT EXISTS user_moods (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  mood        VARCHAR(20) NOT NULL, -- happy, sad, stressed, energetic, neutral, etc.
  note        TEXT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_moods_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_moods_user_time (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Tabla: user_photos (fotos de progreso o comidas)
-- =============================================================
CREATE TABLE IF NOT EXISTS user_photos (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  type        ENUM('progress','meal') NOT NULL DEFAULT 'progress',
  url         VARCHAR(255) NOT NULL,
  caption     VARCHAR(255) NULL,
  taken_at    DATETIME NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_photos_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_photos_user_type (user_id, type),
  INDEX idx_user_photos_time (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Tabla: user_reminders (recordatorios configurados por usuario)
-- =============================================================
CREATE TABLE IF NOT EXISTS user_reminders (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id       BIGINT UNSIGNED NOT NULL,
  type          ENUM('meal','workout','weigh','mood') NOT NULL,
  scheduled_at  DATETIME NOT NULL,
  message       VARCHAR(255) NOT NULL,
  active        TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_reminders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_reminders_user_time (user_id, scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Tabla: food_scans (histórico de análisis IA de comidas)
-- =============================================================
CREATE TABLE IF NOT EXISTS food_scans (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id       BIGINT UNSIGNED NOT NULL,
  name          VARCHAR(120) NULL,
  calories      INT NULL,
  proteins_g    INT NULL,
  carbs_g       INT NULL,
  fats_g        INT NULL,
  description   TEXT NULL,
  image_url     VARCHAR(255) NULL,
  raw_response  JSON NULL, -- Respuesta completa de Gemini para debugging
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_food_scans_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_food_scans_user_time (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Tabla: password_resets (flujo de recuperación)
-- =============================================================
CREATE TABLE IF NOT EXISTS password_resets (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  token       VARCHAR(120) NOT NULL UNIQUE,
  expires_at  DATETIME NOT NULL,
  used_at     DATETIME NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_password_resets_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- (Opcional) Tabla user_sessions SI se quisiera restaurar en el futuro
-- =============================================================
-- CREATE TABLE IF NOT EXISTS user_sessions (
--   id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
--   user_id BIGINT UNSIGNED NOT NULL,
--   jwt_id VARCHAR(64) NOT NULL,
--   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   last_seen_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
--   CONSTRAINT fk_user_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--   INDEX idx_user_sessions_user (user_id)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Vistas útiles (opcional)
-- =============================================================
CREATE OR REPLACE VIEW vw_user_latest_weight AS
SELECT w.user_id, w.weight_kg, w.recorded_at
FROM user_weights w
INNER JOIN (
  SELECT user_id, MAX(recorded_at) AS max_rec
  FROM user_weights
  GROUP BY user_id
) m ON m.user_id = w.user_id AND m.max_rec = w.recorded_at;

-- =============================================================
-- Usuario de prueba (eliminar en producción)
-- =============================================================
INSERT INTO users (name, email, password_hash)
SELECT 'Demo', 'demo@example.com', '$2b$10$123456789012345678901uYVjzX3eFAKEHASHzzzzzzzzzzzzzzzu' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='demo@example.com');

-- Perfil demo mínimo
INSERT INTO user_profiles (user_id, height_cm, weight_kg, fitness_level, activity_level, goal)
SELECT u.id, 175, 80, 'beginner', 'moderate', 'maintain'
FROM users u
LEFT JOIN user_profiles p ON p.user_id = u.id
WHERE u.email='demo@example.com' AND p.id IS NULL;

-- =============================================================
-- Stored procedure (reset parcial de datos volátiles)
-- =============================================================
DROP PROCEDURE IF EXISTS sp_clear_user_dynamic_data;
DELIMITER $$
CREATE PROCEDURE sp_clear_user_dynamic_data(IN p_user_id BIGINT)
BEGIN
  DELETE FROM user_weights WHERE user_id = p_user_id;
  DELETE FROM user_moods WHERE user_id = p_user_id;
  DELETE FROM user_photos WHERE user_id = p_user_id;
  DELETE FROM user_reminders WHERE user_id = p_user_id;
  DELETE FROM food_scans WHERE user_id = p_user_id;
END$$
DELIMITER ;

-- =============================================================
-- FIN DEL ESQUEMA
-- =============================================================