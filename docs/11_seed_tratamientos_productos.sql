-- -----------------------------------------------------
-- Inserción de datos iniciales para Productos, Tratamientos y Tratamiento_Producto
-- -----------------------------------------------------

-- NOTA: Asegúrate de que las tablas Laboratorio y Ensayo ya estén pobladas
-- para que las claves foráneas puedan ser referenciadas correctamente.

-- Paso 1: Insertar Productos de ejemplo
-- Asumimos que ya existen laboratorios con IDs 1, 2, 3, etc.
INSERT INTO `Producto` (`producto_id`, `lab_id_fk`, `nombre_comercial`, `principio_activo`, `formulacion`) VALUES
(1, 1, 'Glifosato Ultra', 'Glifosato', 'SL'),
(2, 1, 'Atrazina Max', 'Atrazina', 'SC'),
(3, 2, 'Fungicid Total', 'Azoxystrobin', 'EC'),
(4, 2, 'Insecticid Pro', 'Lambda-cihalotrina', 'EW'),
(5, 3, 'Fertilizante NPK', 'Nitrógeno, Fósforo, Potasio', 'Granulado');

-- Paso 2: Insertar Tratamientos de ejemplo
-- Asumimos que ya existe un Ensayo con ID 1.
-- La descripción del tratamiento incluirá los productos y dosis para ser mostrada en el select.
INSERT INTO `Tratamiento` (`tratamiento_id`, `ensayo_id_fk`, `numero_trat`, `descripcion`, `es_testigo`) VALUES
(1, 1, 1, 'Tratamiento 1: Glifosato Ultra (1.5 L/ha) + Atrazina Max (2 L/ha)', FALSE),
(2, 1, 2, 'Tratamiento 2: Fungicid Total (0.5 L/ha)', FALSE),
(3, 1, 3, 'Tratamiento 3: Testigo (Sin aplicación)', TRUE),
(4, 1, 4, 'Tratamiento 4: Insecticid Pro (0.2 L/ha) + Fertilizante NPK (100 kg/ha)', FALSE);

-- Paso 3: Vincular Productos a Tratamientos (Tratamiento_Producto)
INSERT INTO `Tratamiento_Producto` (`trat_prod_id`, `tratamiento_id_fk`, `producto_id_fk`, `dosis`, `unidad_dosis`) VALUES
(1, 1, 1, '1.5', 'L/ha'),
(2, 1, 2, '2', 'L/ha'),
(3, 2, 3, '0.5', 'L/ha'),
(4, 4, 4, '0.2', 'L/ha'),
(5, 4, 5, '100', 'kg/ha');

-- Verificar la inserción
SELECT * FROM `Producto`;
SELECT * FROM `Tratamiento`;
SELECT * FROM `Tratamiento_Producto`;
