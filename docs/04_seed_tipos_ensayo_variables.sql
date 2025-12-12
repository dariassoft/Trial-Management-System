-- -----------------------------------------------------
-- Script para vincular Protocolo_Variable con Tipo_Ensayo
-- -----------------------------------------------------

-- Paso 1: Borrar todos los datos existentes en Protocolo_Variable para evitar conflictos.
-- Esto es crucial porque vamos a añadir una clave foránea no nula.
DELETE FROM `Protocolo_Variable`;

-- Paso 2: Añadir la columna para la clave foránea, si no existe.
-- La cláusula `IF NOT EXISTS` previene errores si el script se corre más de una vez.
ALTER TABLE `Protocolo_Variable`
ADD COLUMN `tipo_ensayo_id_fk` INT NULL AFTER `variable_id`;

-- Paso 3: Añadir la restricción de clave foránea, si no existe.
-- El nombre de la restricción `FK_protocolo_variable_tipo_ensayo` es descriptivo.
ALTER TABLE `Protocolo_Variable`
ADD CONSTRAINT `FK_protocolo_variable_tipo_ensayo`
FOREIGN KEY (`tipo_ensayo_id_fk`)
REFERENCES `Tipo_Ensayo` (`tipo_ensayo_id`)
ON DELETE CASCADE ON UPDATE CASCADE;


-- -----------------------------------------------------
-- Inserción de datos para Protocolo_Variable
-- -----------------------------------------------------

-- ID 1: LABORATORIO (TRATAMIENTO DE SEMILLA)
INSERT INTO `Protocolo_Variable` (`tipo_ensayo_id_fk`, `nombre_variable`, `unidad_medida`) VALUES
(1, 'PLANTULAS NORMALES', '%'),
(1, 'PLANTULAS ANORMALES', '%'),
(1, 'SEMILLAS MUERTAS', '%'),
(1, 'LONGITUD DE TALLO', 'CM'),
(1, 'LONGITUD DE RAICES', 'CM'),
(1, 'PESO SECO TALLO', 'g'), -- Asumo gramos para peso seco
(1, 'PESO SECO RAICES', 'g'), -- Asumo gramos para peso seco
(1, 'SANIDAD GENERAL (LAB)', '%');

-- ID 2: BARBECHO
INSERT INTO `Protocolo_Variable` (`tipo_ensayo_id_fk`, `nombre_variable`, `unidad_medida`) VALUES
(2, 'PORCENTAJE DE CONTROL GENERAL (BARBECHO)', '%'),
(2, 'FITOTOXICIDAD (BARBECHO)', 'ESCALA 1-9');

-- ID 3: PREEMERGENTES
INSERT INTO `Protocolo_Variable` (`tipo_ensayo_id_fk`, `nombre_variable`, `unidad_medida`) VALUES
(3, 'PORCENTAJE DE CONTROL GENERAL (PREEMERGENTES)', '%'),
(3, 'FITOTOXICIDAD (PREEMERGENTES)', 'ESCALA 1-9'),
(3, 'PORCENTAJE DE CONTROL PARA DISTINTAS MALEZAS', 'ESCALA 1-9');

-- ID 4: TRATAMIENTOS DE SEMILLAS CAMPO
INSERT INTO `Protocolo_Variable` (`tipo_ensayo_id_fk`, `nombre_variable`, `unidad_medida`) VALUES
(4, 'N° DE PLANTAS POR METROS LINEAL', 'N°/METRO'),
(4, 'VIGOR PLANTAS', 'ESCALA 1-5'),
(4, 'ESTADO SANITARIO GENERAL (CAMPO)', '0-100%'),
(4, 'LONGITUD DE PLANTAS', 'CM'),
(4, 'LONGITUD DE RAICES (CAMPO)', 'CM'),
(4, 'VIGOR DE RAICES', 'ESCALA 1-5'),
(4, 'NUMERO DE NODULO/PLANTULAS', 'N°');

-- ID 5: FOLIARES Y RECUPERADORES
INSERT INTO `Protocolo_Variable` (`tipo_ensayo_id_fk`, `nombre_variable`, `unidad_medida`) VALUES
(5, 'VIGOR AEREO', 'ESCALA 1-5'),
(5, 'FITOTOXICIDAD (FOLIARES)', 'ESCALA 1-9'),
(5, 'NVI (FOLIARES)', 'ESCALA 0-1'),
(5, 'OBSERVACIONES (FOLIARES)', 'TEXTO');

-- ID 6: FUNGICIDA
INSERT INTO `Protocolo_Variable` (`tipo_ensayo_id_fk`, `nombre_variable`, `unidad_medida`) VALUES
(6, 'ENFERMEDAD ESCLEROTINIA - INCIDENCIA', '%'),
(6, 'ENFERMEDAD ESCLEROTINIA - SEVERIDAD', '%'),
(6, 'FITOTOXICIDAD (FUNGICIDA)', 'ESCALA 1-9'),
(6, 'NVI (FUNGICIDA)', 'ESCALA 0-1'),
(6, 'SANIDAD GENERAL (FUNGICIDA)', 'ESCALA 0-100');

-- ID 7: INSECTICIDA
INSERT INTO `Protocolo_Variable` (`tipo_ensayo_id_fk`, `nombre_variable`, `unidad_medida`) VALUES
(7, 'N° DE ACAROS POR FOLIOLO', 'N°'),
(7, 'N° DE TRIPS ADULTOS POR FOLIOLO', 'N°'),
(7, 'N° DE TRIPS NINFA POR FOLIOLO', 'N°'),
(7, 'N° DE MOSCA BLANCA ADULTA', 'N°'),
(7, 'N° DE NINFA DE MOSCA BLANCA', 'N°'),
(7, 'N° DE HUEVOS DE MOSCA BLANCA', 'N°'),
(7, 'N° DE MEDIDORA POR METROS MENORES A 1,5 CM', 'N°'),
(7, 'N° DE MEDIDORA POR METROS MAYORES A 1,5 CM', 'N°'),
(7, 'N° DE ANTICARCIA POR METRO MENORES A 1,5 CM', 'N°'),
(7, 'N° DE ANTICARCIA POR METRO MAYORES A 1,5 CM', 'N°'),
(7, 'N° DE SPODOPTERA POR METROS MENORES A 1,5 CM', 'N°'),
(7, 'N° DE SPODOPTERA POR METROS MAYORES A 1,5 CM', 'N°'),
(7, 'PORCENTAJE DE DESFOLIACIÓN', 'ESCALA 0-100'),
(7, 'SANIDAD GENERAL (INSECTICIDA)', 'ESCALA 0-100'),
(7, 'OTROS (INSECTICIDA)', 'TEXTO');

-- ID 8: BACTERICIDA
INSERT INTO `Protocolo_Variable` (`tipo_ensayo_id_fk`, `nombre_variable`, `unidad_medida`) VALUES
(8, 'ENFERMEDAD BACTERIA - INCIDENCIA', '%'),
(8, 'ENFERMEDAD BACTERIA - SEVERIDAD', '%'),
(8, 'FITOTOXICIDAD (BACTERICIDA)', 'ESCALA 1-9'),
(8, 'NVI (BACTERICIDA)', 'ESCALA 0-1'),
(8, 'SANIDAD GENERAL (BACTERICIDA)', 'ESCALA 0-100');

-- ID 9: DESECANTES
INSERT INTO `Protocolo_Variable` (`tipo_ensayo_id_fk`, `nombre_variable`, `unidad_medida`) VALUES
(9, 'PORCENTAJE DE CONTROL GENERAL (DESECANTES)', '%'),
(9, 'FITOTOXICIDAD (DESECANTES)', 'ESCALA 1-9'),
(9, 'PORCENTAJE SECADO TALLO', 'ESCALA 0-100'),
(9, 'PORCENTAJE SECADO HOJAS', 'ESCALA 0-100'),
(9, 'PORCENTAJE SECADO CHAUCHA', 'ESCALA 0-100');


-- Verificar la inserción
SELECT * FROM `Protocolo_Variable`;
