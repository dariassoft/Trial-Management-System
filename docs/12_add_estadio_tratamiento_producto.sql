-- SQL para agregar el campo 'estadio' a la tabla Tratamiento_Producto
-- Sesión 3: Gestión de Tratamientos

ALTER TABLE `Tratamiento_Producto`
ADD COLUMN `estadio` VARCHAR(20) NULL
COMMENT 'Estadio de aplicación (V2, V3, V4, etc.)'
AFTER `unidad_dosis`;

-- Opcional: Ver la estructura actualizada
DESCRIBE `Tratamiento_Producto`;

