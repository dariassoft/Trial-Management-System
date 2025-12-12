-- -----------------------------------------------------
-- Inserción de datos iniciales para Protocolos, Tratamientos y Tratamiento_Producto
-- -----------------------------------------------------

-- NOTA: Asegúrate de que las tablas Producto y Laboratorio ya estén pobladas
-- para que las claves foráneas puedan ser referenciadas correctamente.

-- Paso 1: Insertar Protocolos de ejemplo
INSERT INTO `Protocolo` (`protocolo_id`, `nombre`, `descripcion`) VALUES
(1, 'Protocolo Herbicida Maíz Post-Emergencia', 'Control de malezas de hoja ancha y gramíneas en maíz.'),
(2, 'Protocolo Fungicida Trigo Espiga', 'Control de enfermedades fúngicas en trigo durante la etapa de espigazón.'),
(3, 'Protocolo Insecticida Soja R3', 'Control de plagas de lepidópteros y chinches en soja en estado reproductivo R3.');

-- Paso 2: Insertar Productos de ejemplo (si no existen ya)
-- Asumimos que ya existen laboratorios con IDs 1, 2, 3, etc.
-- Si ya existen, estos INSERTs fallarán o se duplicarán si no se maneja con ON CONFLICT o DELETE previo.
-- Para este seeder, asumimos que se ejecuta en una DB limpia o que los IDs no colisionan.
INSERT INTO `Producto` (`producto_id`, `lab_id_fk`, `nombre_comercial`, `principio_activo`, `formulacion`) VALUES
(1, 1, 'Glifosato Ultra', 'Glifosato', 'SL'),
(2, 1, 'Atrazina Max', 'Atrazina', 'SC'),
(3, 2, 'Fungicid Total', 'Azoxystrobin', 'EC'),
(4, 2, 'Insecticid Pro', 'Lambda-cihalotrina', 'EW'),
(5, 3, 'Fertilizante NPK', 'Nitrógeno, Fósforo, Potasio', 'Granulado')
ON DUPLICATE KEY UPDATE nombre_comercial = VALUES(nombre_comercial); -- Para evitar errores si ya existen

-- Paso 3: Insertar Tratamientos de ejemplo vinculados a Protocolos
-- Protocolo 1: Herbicida Maíz Post-Emergencia
INSERT INTO `Tratamiento` (`tratamiento_id`, `protocolo_id_fk`, `numero_trat`, `descripcion`, `es_testigo`) VALUES
(1, 1, 1, 'Tratamiento 1 (P1): Glifosato Ultra (1.5 L/ha) + Atrazina Max (2 L/ha)', FALSE),
(2, 1, 2, 'Tratamiento 2 (P1): Testigo (Sin aplicación)', TRUE);

-- Protocolo 2: Fungicida Trigo Espiga
INSERT INTO `Tratamiento` (`tratamiento_id`, `protocolo_id_fk`, `numero_trat`, `descripcion`, `es_testigo`) VALUES
(3, 2, 3, 'Tratamiento 1 (P2): Fungicid Total (0.5 L/ha)', FALSE),
(4, 2, 4, 'Tratamiento 2 (P2): Testigo (Sin aplicación)', TRUE);

-- Protocolo 3: Insecticida Soja R3
INSERT INTO `Tratamiento` (`tratamiento_id`, `protocolo_id_fk`, `numero_trat`, `descripcion`, `es_testigo`) VALUES
(5, 3, 5, 'Tratamiento 1 (P3): Insecticid Pro (0.2 L/ha) + Fertilizante NPK (100 kg/ha)', FALSE),
(6, 3, 6, 'Tratamiento 2 (P3): Testigo (Sin aplicación)', TRUE);


-- Paso 4: Vincular Productos a Tratamientos (Tratamiento_Producto)
INSERT INTO `Tratamiento_Producto` (`trat_prod_id`, `tratamiento_id_fk`, `producto_id_fk`, `dosis`, `unidad_dosis`) VALUES
(1, 1, 1, '1.5', 'L/ha'), -- Glifosato Ultra en Tratamiento 1 (P1)
(2, 1, 2, '2', 'L/ha'),   -- Atrazina Max en Tratamiento 1 (P1)
(3, 3, 3, '0.5', 'L/ha'), -- Fungicid Total en Tratamiento 1 (P2)
(4, 5, 4, '0.2', 'L/ha'), -- Insecticid Pro en Tratamiento 1 (P3)
(5, 5, 5, '100', 'kg/ha') -- Fertilizante NPK en Tratamiento 1 (P3)
ON DUPLICATE KEY UPDATE dosis = VALUES(dosis); -- Para evitar errores si ya existen

-- Verificar la inserción
SELECT * FROM `Protocolo`;
SELECT * FROM `Tratamiento`;
SELECT * FROM `Tratamiento_Producto`;
SELECT * FROM `Producto`;
