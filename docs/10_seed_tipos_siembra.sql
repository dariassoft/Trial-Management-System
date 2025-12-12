-- -----------------------------------------------------
-- Inserción de datos iniciales para Tipos de Siembra
-- -----------------------------------------------------

-- Asegurarse de que la tabla esté vacía antes de insertar para evitar duplicados
-- DELETE FROM TipoSiembra;

-- Insertar los tipos de siembra más comunes
INSERT INTO `TipoSiembra` (`nombre`) VALUES
('Siembra Directa'),
('Labranza Convencional'),
('Labranza Mínima'),
('Siembra en Surcos'),
('Siembra al Voleo'),
('Siembra de Precisión');

-- Verificar la inserción
SELECT * FROM `TipoSiembra`;
