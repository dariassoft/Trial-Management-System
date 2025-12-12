-- -----------------------------------------------------
-- Migración: Alterar tabla Ensayo para vincularla a Protocolo
-- -----------------------------------------------------

-- Paso 1: Eliminar la columna 'version_protocolo' si existe
ALTER TABLE `Ensayo`
DROP COLUMN `version_protocolo`;

-- Paso 2: Eliminar la clave foránea 'FK_ensayo_tratamiento_protocolo' si existe
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SELECT @fk_name := CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Ensayo' AND COLUMN_NAME = 'tratamiento_protocolo_id_fk' AND REFERENCED_TABLE_NAME = 'Tratamiento';
SET @drop_fk_sql = IF(@fk_name IS NOT NULL, CONCAT('ALTER TABLE `Ensayo` DROP FOREIGN KEY ', @fk_name), 'SELECT 1');
PREPARE stmt FROM @drop_fk_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;

-- Paso 3: Eliminar la columna 'tratamiento_protocolo_id_fk' si existe
ALTER TABLE `Ensayo`
DROP COLUMN `tratamiento_protocolo_id_fk`;

-- Paso 4: Añadir la nueva columna para la clave foránea 'protocolo_id_fk'
ALTER TABLE `Ensayo`
ADD COLUMN `protocolo_id_fk` INT NULL AFTER `nombre_ensayo`;

-- Paso 5: Añadir la restricción de clave foránea
ALTER TABLE `Ensayo`
ADD CONSTRAINT `FK_ensayo_protocolo`
FOREIGN KEY (`protocolo_id_fk`)
REFERENCES `Protocolo` (`protocolo_id`)
ON DELETE SET NULL ON UPDATE CASCADE;

-- Paso 6: Actualizar la restricción UNIQUE
-- Eliminar la antigua si existe
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SELECT @uq_name := CONSTRAINT_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Ensayo' AND CONSTRAINT_TYPE = 'UNIQUE' AND CONSTRAINT_NAME LIKE 'UQ_Ensayo_nombreEnsayo_protocoloTratamiento%';
SET @drop_uq_sql = IF(@uq_name IS NOT NULL, CONCAT('ALTER TABLE `Ensayo` DROP INDEX ', @uq_name), 'SELECT 1');
PREPARE stmt FROM @drop_uq_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Añadir la nueva restricción UNIQUE
ALTER TABLE `Ensayo`
ADD UNIQUE INDEX `UQ_Ensayo_nombreEnsayo_protocolo` (`nombre_ensayo`, `protocolo_id_fk`);

-- Verificar la estructura de la tabla Ensayo después de la migración
SHOW COLUMNS FROM `Ensayo`;
DESCRIBE `Ensayo`;
