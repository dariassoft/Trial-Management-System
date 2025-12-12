-- -----------------------------------------------------
-- Migración: Alterar tabla Ensayo para reemplazar version_protocolo con FK a Tratamiento
-- -----------------------------------------------------

-- Paso 1: Eliminar la columna 'version_protocolo' si existe
-- Esto es necesario porque vamos a reemplazarla con una clave foránea.
-- Si la columna no existe, este comando no hará nada.
ALTER TABLE `Ensayo`
DROP COLUMN `version_protocolo`;

-- Paso 2: Añadir la nueva columna para la clave foránea 'tratamiento_protocolo_id_fk'
-- Esta columna almacenará el ID del Tratamiento que actúa como protocolo.
ALTER TABLE `Ensayo`
ADD COLUMN `tratamiento_protocolo_id_fk` INT NULL AFTER `nombre_ensayo`;

-- Paso 3: Añadir la restricción de clave foránea
-- Vincula 'tratamiento_protocolo_id_fk' en Ensayo con 'tratamiento_id' en Tratamiento.
-- ON DELETE SET NULL: Si un Tratamiento se elimina, la referencia en Ensayo se pone a NULL.
-- ON UPDATE CASCADE: Si el ID de un Tratamiento cambia, la referencia en Ensayo se actualiza.
ALTER TABLE `Ensayo`
ADD CONSTRAINT `FK_ensayo_tratamiento_protocolo`
FOREIGN KEY (`tratamiento_protocolo_id_fk`)
REFERENCES `Tratamiento` (`tratamiento_id`)
ON DELETE SET NULL ON UPDATE CASCADE;

-- Paso 4: Actualizar la restricción UNIQUE si existe y es necesario
-- Si la restricción UNIQUE original incluía 'version_protocolo', debemos ajustarla.
-- Primero, intentamos eliminar la restricción antigua si existe.
-- NOTA: El nombre de la restricción puede variar. Necesitarías verificarlo en tu DB.
-- Por ejemplo, si se llamaba 'UQ_Ensayo_nombreEnsayo_versionProtocolo'
-- ALTER TABLE `Ensayo` DROP INDEX IF EXISTS `UQ_Ensayo_nombreEnsayo_versionProtocolo`;

-- Luego, añadimos la nueva restricción UNIQUE si es necesario.
-- En este caso, la entidad Ensayo ya tiene @Unique(['nombreEnsayo', 'protocoloTratamiento'])
-- TypeORM debería manejar esto automáticamente si synchronize es true (pero lo tenemos en false).
-- Si necesitas añadirla manualmente y no confías en TypeORM, sería algo como:
-- ALTER TABLE `Ensayo` ADD UNIQUE INDEX `UQ_Ensayo_nombreEnsayo_protocoloTratamiento` (`nombre_ensayo`, `tratamiento_protocolo_id_fk`);

-- Consideraciones:
-- Si ya tienes datos en la tabla Ensayo y quieres migrar la 'version_protocolo' a 'tratamiento_protocolo_id_fk',
-- necesitarías un script de migración de datos más complejo que mapee las versiones antiguas a IDs de Tratamiento.
-- Por ahora, asumimos que se hará en una base de datos limpia o que los datos antiguos no son críticos para esta FK.

-- Verificar la estructura de la tabla Ensayo después de la migración
SHOW COLUMNS FROM `Ensayo`;
DESCRIBE `Ensayo`;
