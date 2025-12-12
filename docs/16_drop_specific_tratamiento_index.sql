-- -----------------------------------------------------
-- Migración: Eliminar un índice específico de la tabla Tratamiento
-- -----------------------------------------------------

-- Este script elimina el índice 'IDX_7dd25a5313506bb07c8f3f59db'
-- que probablemente fue generado automáticamente por TypeORM para una FK antigua.
-- Es crucial que el nombre del índice sea exacto.

ALTER TABLE `Tratamiento`
DROP INDEX `IDX_7dd25a5313506bb07c8f3f59db`;

-- Verificar los índices restantes en la tabla Tratamiento
SHOW INDEX FROM `Tratamiento`;
