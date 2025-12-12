-- -----------------------------------------------------
-- Migración: Alterar tabla Tratamiento para vincularla a Protocolo
-- -----------------------------------------------------

-- Paso 1: Eliminar la clave foránea 'FK_tratamiento_ensayo' si existe
-- MySQL no soporta DROP FOREIGN KEY IF EXISTS directamente, así que lo hacemos en dos pasos.
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SELECT @fk_name := CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Tratamiento' AND COLUMN_NAME = 'ensayo_id_fk' AND REFERENCED_TABLE_NAME = 'Ensayo';
SET @drop_fk_sql = IF(@fk_name IS NOT NULL, CONCAT('ALTER TABLE `Tratamiento` DROP FOREIGN KEY ', @fk_name), 'SELECT 1');
PREPARE stmt FROM @drop_fk_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;

-- Paso 2: Eliminar la columna 'ensayo_id_fk' si existe
ALTER TABLE `Tratamiento`
DROP COLUMN `ensayo_id_fk`;

-- Paso 3: Añadir la nueva columna para la clave foránea 'protocolo_id_fk'
ALTER TABLE `Tratamiento`
ADD COLUMN `protocolo_id_fk` INT NOT NULL AFTER `tratamiento_id`;

-- Paso 4: Añadir la restricción de clave foránea
ALTER TABLE `Tratamiento`
ADD CONSTRAINT `FK_tratamiento_protocolo`
FOREIGN KEY (`protocolo_id_fk`)
REFERENCES `Protocolo` (`protocolo_id`)
ON DELETE CASCADE ON UPDATE CASCADE;

-- Paso 5: Actualizar la restricción UNIQUE
-- Eliminar la antigua si existe (puede tener un nombre generado automáticamente)
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SELECT @uq_name := CONSTRAINT_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Tratamiento' AND CONSTRAINT_TYPE = 'UNIQUE' AND CONSTRAINT_NAME LIKE 'UQ_Tratamiento_ensayo_numeroTrat%';
SET @drop_uq_sql = IF(@uq_name IS NOT NULL, CONCAT('ALTER TABLE `Tratamiento` DROP INDEX ', @uq_name), 'SELECT 1');
PREPARE stmt FROM @drop_uq_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Añadir la nueva restricción UNIQUE
ALTER TABLE `Tratamiento`
ADD UNIQUE INDEX `UQ_tratamiento_protocolo_numeroTrat` (`protocolo_id_fk`, `numero_trat`);

-- Verificar la estructura de la tabla Tratamiento después de la migración
SHOW COLUMNS FROM `Tratamiento`;
DESCRIBE `Tratamiento`;
