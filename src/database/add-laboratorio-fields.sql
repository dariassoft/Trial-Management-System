-- Script SQL para agregar los campos nuevos a la tabla Laboratorio
-- Ejecutar este script si las migraciones no funcionan

ALTER TABLE `Laboratorio` ADD COLUMN `descripcion` TEXT NULL DEFAULT NULL;
ALTER TABLE `Laboratorio` ADD COLUMN `direccion` VARCHAR(255) NULL DEFAULT NULL;
ALTER TABLE `Laboratorio` ADD COLUMN `telefono` VARCHAR(50) NULL DEFAULT NULL;
ALTER TABLE `Laboratorio` ADD COLUMN `email` VARCHAR(100) NULL DEFAULT NULL;
ALTER TABLE `Laboratorio` ADD COLUMN `contacto` VARCHAR(100) NULL DEFAULT NULL;
ALTER TABLE `Laboratorio` ADD COLUMN `esta_activo` BOOLEAN DEFAULT TRUE;
ALTER TABLE `Laboratorio` ADD COLUMN `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `Laboratorio` ADD COLUMN `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Verificar que las columnas fueron creadas correctamente
DESCRIBE `Laboratorio`;

