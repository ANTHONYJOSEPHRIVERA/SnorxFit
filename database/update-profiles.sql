-- Actualización de la tabla user_profiles para incluir nuevos campos
-- Ejecutar en phpMyAdmin o MySQL Workbench

USE snorxfit_db;

-- Agregar nuevas columnas a la tabla user_profiles
ALTER TABLE user_profiles 
ADD COLUMN birth_date DATE AFTER user_id,
ADD COLUMN imc DECIMAL(4,1) AFTER fitness_level,
ADD COLUMN imc_category VARCHAR(50) AFTER imc,
ADD COLUMN allergies TEXT AFTER imc_category,
ADD COLUMN chronic_diseases TEXT AFTER allergies;

-- Opcional: Agregar índices para mejorar rendimiento
ALTER TABLE user_profiles 
ADD INDEX idx_birth_date (birth_date),
ADD INDEX idx_imc (imc);

-- Verificar la estructura actualizada
DESCRIBE user_profiles;