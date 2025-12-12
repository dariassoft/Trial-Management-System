-- -----------------------------------------------------
-- Creación de la tabla Protocolo
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Protocolo` (
    `protocolo_id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL UNIQUE,
    `descripcion` TEXT NULL
);
