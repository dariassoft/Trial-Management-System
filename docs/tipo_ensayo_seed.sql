-- docs/tipo_ensayo_seed.sql
-- Poblado inicial de Tipos de Ensayo, Variables (diccionario) y su vinculación
-- Requiere haber ejecutado:
--   - database.sql (para tablas base incluyendo Protocolo_Variable)
--   - docs/tipo_ensayo.sql (para Tipo_Ensayo, Tipo_Ensayo_Variable, Tipo_Ensayo_EvaluacionDia)

SET NAMES utf8mb4;

-- 1) Inserta/asegura variables del diccionario global (Protocolo_Variable)
--    Se usa ON DUPLICATE para idempotencia.
INSERT INTO Protocolo_Variable (nombre_variable, unidad_medida, descripcion) VALUES
  ('PLANTULAS NORMALES', '%', NULL),
  ('PLANTULAS ANORMALES', '%', NULL),
  ('SEMILLAS MUERTAS', '%', NULL),
  ('LONGITUD DE TALLO', 'CM', NULL),
  ('LONGITUD DE RAICES', 'CM', NULL),
  ('PESO SECO TALLO', 'GR', NULL),
  ('PESO SECO RAICES', 'GR', NULL),
  ('SANIDAD GENERAL', '%', NULL),
  ('PORCENTAJE DE CONTROL GENERAL', '%', NULL),
  ('FITOTOXICIDAD', 'ESCALA', 'Escala 1-9'),
  ('PORCENTAJE DE CONTROL PARA DISTINTAS MALEZAS', 'ESCALA', 'Escala 1-9'),
  ('N° DE PLANTAS POR METROS LINEAL', 'N°/METRO', NULL),
  ('VIGOR PLANTAS', 'ESCALA', 'Escala 1-5'),
  ('ESTADO SANITARIO GENERAL', '%', NULL),
  ('LONGITUD DE PLANTAS', 'CM', NULL),
  ('LONGITUD DE RAICES (CAMPO)', 'CM', NULL),
  ('VIGOR DE RAICES', 'ESCALA', 'Escala 1-5'),
  ('NUMERO DE NODULO/PLANTULAS', 'N°', NULL),
  ('VIGOR AEREO', 'ESCALA', 'Escala 1-5'),
  ('NVI', 'ESCALA', 'Escala 0-1'),
  ('ENFERMEDAD ESCLEROTINIA', NULL, 'Contexto de variables de enfermedad'),
  ('INCIDENCIA', '%', NULL),
  ('SEVERIDAD', '%', NULL),
  ('N° DE ACAROS POR FOLIOLO', 'N°', NULL),
  ('N° DE TIPS ADULTOS POR FOLIOLO', 'N°', NULL),
  ('N° DE TRIPS NINFA POR FOLIOLO', 'N°', NULL),
  ('N° DE MOSCA BLANCA ADULTA', 'N°', NULL),
  ('N° DE NINFA DE MOSCA  BLANCA', 'N°', NULL),
  ('N° DE HUEVOS DE MOSCA BLANCA', 'N°', NULL),
  ('PORCENTAJE DE DESFOLIACIÓN', '%', NULL),
  ('OTROS', NULL, NULL),
  ('N° DE MEDIDORA POR METROS  MENORES A 1,5 CM', 'N°/METRO', NULL),
  ('N° DE MEDIDORA POR METROS  MAYORES A 1,5 CM', 'N°/METRO', NULL),
  ('N° DE ANTICARCIA POR METRO MENORES A 1,5 CM', 'N°/METRO', NULL),
  ('N° DE ANTICARCIA POR METRO MAYORES A 1,5 CM', 'N°/METRO', NULL),
  ('N° DE SPODOPTERA POR METROS MENORES A 1,5 CM', 'N°/METRO', NULL),
  ('N° DE SPODOPTERA POR METROS MAYORES A 1,5 CM', 'N°/METRO', NULL),
  ('PORCENTAJE SECADO TALLO', '%', NULL),
  ('PORCENTAJE SECADO HOJAS', '%', NULL),
  ('PORCENTAJE SECADO CHAUCHA', '%', NULL)
ON DUPLICATE KEY UPDATE unidad_medida = VALUES(unidad_medida), descripcion = VALUES(descripcion);

-- 2) Inserta Tipos de Ensayo
INSERT INTO Tipo_Ensayo (nombre, evaluacion_csv, activo) VALUES
  ('LABORATORIO (TRATAMIENTO DE SEMILLA)', '3,7,14', TRUE),
  ('BARBECHO', '3,7,14,21,28,35', TRUE),
  ('PREEMERGENTES', '3,7,14,21,28,35', TRUE),
  ('TRATAMIENTOS DE SEMILLAS CAMPO', '3,7,14,21,28,35', TRUE),
  ('FOLIARES Y RECUPERADORES', '3,7,14,21,28,35', TRUE),
  ('FUNGICIDA', '3,7,14,21,28,35', TRUE),
  ('INSECTICIDA', '3,7,14,21,28', TRUE),
  ('BACTERICIDA', '3,7,14,21,28', TRUE),
  ('DESECANTES', '3,7,14,21,28', TRUE)
ON DUPLICATE KEY UPDATE evaluacion_csv = VALUES(evaluacion_csv), activo = VALUES(activo);

-- Helper: función simple (procedimiento) para vincular variables por nombre
-- Nota: Si no se permiten procedimientos, se pueden usar INSERT ... SELECT directos abajo.

-- 3) Vincula variables a cada Tipo con orden y posibles escalas
-- LABORATORIO (TRATAMIENTO DE SEMILLA)
INSERT INTO Tipo_Ensayo_Variable (tipo_ensayo_id_fk, variable_id_fk, orden, requerido, unidad_override, escala)
SELECT te.tipo_ensayo_id, pv.variable_id, ord.orden, ord.requerido, pv.unidad_medida, NULL
FROM Tipo_Ensayo te
JOIN (
  SELECT 'PLANTULAS NORMALES' n, 1 orden, TRUE requerido UNION ALL
  SELECT 'PLANTULAS ANORMALES', 2, TRUE UNION ALL
  SELECT 'SEMILLAS MUERTAS', 3, TRUE UNION ALL
  SELECT 'LONGITUD DE TALLO', 4, FALSE UNION ALL
  SELECT 'LONGITUD DE RAICES', 5, FALSE UNION ALL
  SELECT 'PESO SECO TALLO', 6, FALSE UNION ALL
  SELECT 'PESO SECO RAICES', 7, FALSE UNION ALL
  SELECT 'SANIDAD GENERAL', 8, FALSE
) ord ON 1=1
JOIN Protocolo_Variable pv ON pv.nombre_variable = ord.n
WHERE te.nombre = 'LABORATORIO (TRATAMIENTO DE SEMILLA)'
ON DUPLICATE KEY UPDATE orden = VALUES(orden), requerido = VALUES(requerido), unidad_override = VALUES(unidad_override), escala = VALUES(escala);

-- BARBECHO
INSERT INTO Tipo_Ensayo_Variable (tipo_ensayo_id_fk, variable_id_fk, orden, requerido, unidad_override, escala)
SELECT te.tipo_ensayo_id, pv.variable_id, ord.orden, ord.requerido, NULL, ord.escala
FROM Tipo_Ensayo te
JOIN (
  SELECT 'PORCENTAJE DE CONTROL GENERAL' n, 1 orden, TRUE requerido, NULL escala UNION ALL
  SELECT 'FITOTOXICIDAD', 2, FALSE, '1-9' UNION ALL
  SELECT 'PORCENTAJE DE CONTROL GENERAL', 3, FALSE, '1-9'
) ord ON 1=1
JOIN Protocolo_Variable pv ON pv.nombre_variable = ord.n
WHERE te.nombre = 'BARBECHO'
ON DUPLICATE KEY UPDATE orden = VALUES(orden), requerido = VALUES(requerido), escala = VALUES(escala);

-- PREEMERGENTES
INSERT INTO Tipo_Ensayo_Variable (tipo_ensayo_id_fk, variable_id_fk, orden, requerido, unidad_override, escala)
SELECT te.tipo_ensayo_id, pv.variable_id, ord.orden, ord.requerido, NULL, ord.escala
FROM Tipo_Ensayo te
JOIN (
  SELECT 'PORCENTAJE DE CONTROL GENERAL' n, 1 orden, TRUE requerido, NULL escala UNION ALL
  SELECT 'FITOTOXICIDAD', 2, FALSE, '1-9' UNION ALL
  SELECT 'PORCENTAJE DE CONTROL PARA DISTINTAS MALEZAS', 3, FALSE, '1-9'
) ord ON 1=1
JOIN Protocolo_Variable pv ON pv.nombre_variable = ord.n
WHERE te.nombre = 'PREEMERGENTES'
ON DUPLICATE KEY UPDATE orden = VALUES(orden), requerido = VALUES(requerido), escala = VALUES(escala);

-- TRATAMIENTOS DE SEMILLAS CAMPO
INSERT INTO Tipo_Ensayo_Variable (tipo_ensayo_id_fk, variable_id_fk, orden, requerido, unidad_override, escala)
SELECT te.tipo_ensayo_id, pv.variable_id, ord.orden, ord.requerido, ord.unidad_override, ord.escala
FROM Tipo_Ensayo te
JOIN (
  SELECT 'N° DE PLANTAS POR METROS LINEAL' n, 1 orden, TRUE requerido, 'N°/METRO' unidad_override, NULL escala UNION ALL
  SELECT 'VIGOR PLANTAS', 2, FALSE, NULL, '1-5' UNION ALL
  SELECT 'ESTADO SANITARIO GENERAL', 3, FALSE, '%', NULL UNION ALL
  SELECT 'LONGITUD DE PLANTAS', 4, FALSE, 'CM', NULL UNION ALL
  SELECT 'LONGITUD DE RAICES (CAMPO)', 5, FALSE, 'CM', NULL UNION ALL
  SELECT 'VIGOR DE RAICES', 6, FALSE, NULL, '1-5' UNION ALL
  SELECT 'NUMERO DE NODULO/PLANTULAS', 7, FALSE, 'N°', NULL
) ord ON 1=1
JOIN Protocolo_Variable pv ON pv.nombre_variable = ord.n
WHERE te.nombre = 'TRATAMIENTOS DE SEMILLAS CAMPO'
ON DUPLICATE KEY UPDATE orden = VALUES(orden), requerido = VALUES(requerido), unidad_override = VALUES(unidad_override), escala = VALUES(escala);

-- FOLIARES Y RECUPERADORES
INSERT INTO Tipo_Ensayo_Variable (tipo_ensayo_id_fk, variable_id_fk, orden, requerido, unidad_override, escala)
SELECT te.tipo_ensayo_id, pv.variable_id, ord.orden, ord.requerido, NULL, ord.escala
FROM Tipo_Ensayo te
JOIN (
  SELECT 'VIGOR AEREO' n, 1 orden, FALSE requerido, '1-5' escala UNION ALL
  SELECT 'FITOTOXICIDAD', 2, FALSE, '1-9' UNION ALL
  SELECT 'NVI', 3, FALSE, '0-1' UNION ALL
  SELECT 'OTROS', 4, FALSE, NULL
) ord ON 1=1
JOIN Protocolo_Variable pv ON pv.nombre_variable = ord.n
WHERE te.nombre = 'FOLIARES Y RECUPERADORES'
ON DUPLICATE KEY UPDATE orden = VALUES(orden), requerido = VALUES(requerido), escala = VALUES(escala);

-- FUNGICIDA
INSERT INTO Tipo_Ensayo_Variable (tipo_ensayo_id_fk, variable_id_fk, orden, requerido, unidad_override, escala)
SELECT te.tipo_ensayo_id, pv.variable_id, ord.orden, ord.requerido, NULL, ord.escala
FROM Tipo_Ensayo te
JOIN (
  SELECT 'ENFERMEDAD ESCLEROTINIA' n, 1 orden, FALSE requerido, NULL escala UNION ALL
  SELECT 'INCIDENCIA', 2, TRUE, NULL UNION ALL
  SELECT 'SEVERIDAD', 3, TRUE, NULL UNION ALL
  SELECT 'FITOTOXICIDAD', 4, FALSE, '1-9' UNION ALL
  SELECT 'NVI', 5, FALSE, '0-1' UNION ALL
  SELECT 'SANIDAD GENERAL', 6, FALSE, '0-100'
) ord ON 1=1
JOIN Protocolo_Variable pv ON pv.nombre_variable = ord.n
WHERE te.nombre = 'FUNGICIDA'
ON DUPLICATE KEY UPDATE orden = VALUES(orden), requerido = VALUES(requerido), escala = VALUES(escala);

-- INSECTICIDA
INSERT INTO Tipo_Ensayo_Variable (tipo_ensayo_id_fk, variable_id_fk, orden, requerido, unidad_override, escala)
SELECT te.tipo_ensayo_id, pv.variable_id, ord.orden, ord.requerido, ord.unidad_override, ord.escala
FROM Tipo_Ensayo te
JOIN (
  SELECT 'N° DE ACAROS POR FOLIOLO' n, 1 orden, FALSE requerido, 'N°' unidad_override, NULL escala UNION ALL
  SELECT 'N° DE TIPS ADULTOS POR FOLIOLO', 2, FALSE, 'N°', NULL UNION ALL
  SELECT 'N° DE TRIPS NINFA POR FOLIOLO', 3, FALSE, 'N°', NULL UNION ALL
  SELECT 'N° DE MOSCA BLANCA ADULTA', 4, FALSE, 'N°', NULL UNION ALL
  SELECT 'N° DE NINFA DE MOSCA  BLANCA', 5, FALSE, 'N°', NULL UNION ALL
  SELECT 'N° DE HUEVOS DE MOSCA BLANCA', 6, FALSE, 'N°', NULL UNION ALL
  SELECT 'PORCENTAJE DE DESFOLIACIÓN', 7, FALSE, '%' unidad_override, '0-100' escala UNION ALL
  SELECT 'SANIDAD GENERAL', 8, FALSE, '%', '0-100' UNION ALL
  SELECT 'OTROS', 9, FALSE, NULL, NULL UNION ALL
  SELECT 'N° DE MEDIDORA POR METROS  MENORES A 1,5 CM', 10, FALSE, 'N°/METRO', NULL UNION ALL
  SELECT 'N° DE MEDIDORA POR METROS  MAYORES A 1,5 CM', 11, FALSE, 'N°/METRO', NULL UNION ALL
  SELECT 'N° DE ANTICARCIA POR METRO MENORES A 1,5 CM', 12, FALSE, 'N°/METRO', NULL UNION ALL
  SELECT 'N° DE ANTICARCIA POR METRO MAYORES A 1,5 CM', 13, FALSE, 'N°/METRO', NULL UNION ALL
  SELECT 'N° DE SPODOPTERA POR METROS MENORES A 1,5 CM', 14, FALSE, 'N°/METRO', NULL UNION ALL
  SELECT 'N° DE SPODOPTERA POR METROS MAYORES A 1,5 CM', 15, FALSE, 'N°/METRO', NULL
) ord ON 1=1
JOIN Protocolo_Variable pv ON pv.nombre_variable = ord.n
WHERE te.nombre = 'INSECTICIDA'
ON DUPLICATE KEY UPDATE orden = VALUES(orden), requerido = VALUES(requerido), unidad_override = VALUES(unidad_override), escala = VALUES(escala);

-- BACTERICIDA
INSERT INTO Tipo_Ensayo_Variable (tipo_ensayo_id_fk, variable_id_fk, orden, requerido, unidad_override, escala)
SELECT te.tipo_ensayo_id, pv.variable_id, ord.orden, ord.requerido, NULL, ord.escala
FROM Tipo_Ensayo te
JOIN (
  SELECT 'ENFERMEDAD BACTERIA' n, 1 orden, FALSE requerido, NULL escala UNION ALL
  SELECT 'INCIDENCIA', 2, TRUE, NULL UNION ALL
  SELECT 'SEVERIDAD', 3, TRUE, NULL UNION ALL
  SELECT 'FITOTOXICIDAD', 4, FALSE, '1-9' UNION ALL
  SELECT 'NVI', 5, FALSE, '0-1' UNION ALL
  SELECT 'SANIDAD GENERAL', 6, FALSE, '0-100'
) ord ON 1=1
JOIN Protocolo_Variable pv ON pv.nombre_variable = ord.n
WHERE te.nombre = 'BACTERICIDA'
ON DUPLICATE KEY UPDATE orden = VALUES(orden), requerido = VALUES(requerido), escala = VALUES(escala);

-- DESECANTES
INSERT INTO Tipo_Ensayo_Variable (tipo_ensayo_id_fk, variable_id_fk, orden, requerido, unidad_override, escala)
SELECT te.tipo_ensayo_id, pv.variable_id, ord.orden, ord.requerido, NULL, ord.escala
FROM Tipo_Ensayo te
JOIN (
  SELECT 'PORCENTAJE DE CONTROL GENERAL' n, 1 orden, TRUE requerido, NULL escala UNION ALL
  SELECT 'FITOTOXICIDAD', 2, FALSE, '1-9' UNION ALL
  SELECT 'PORCENTAJE DE CONTROL GENERAL', 3, FALSE, '1-9' UNION ALL
  SELECT 'PORCENTAJE SECADO TALLO', 4, FALSE, '0-100' UNION ALL
  SELECT 'PORCENTAJE SECADO HOJAS', 5, FALSE, '0-100' UNION ALL
  SELECT 'PORCENTAJE SECADO CHAUCHA', 6, FALSE, '0-100'
) ord ON 1=1
JOIN Protocolo_Variable pv ON pv.nombre_variable = ord.n
WHERE te.nombre = 'DESECANTES'
ON DUPLICATE KEY UPDATE orden = VALUES(orden), requerido = VALUES(requerido), escala = VALUES(escala);

-- 4) (Opcional) Poblar tabla normalizada de días para facilitar queries
INSERT INTO Tipo_Ensayo_EvaluacionDia (tipo_ensayo_id_fk, dia)
SELECT te.tipo_ensayo_id, d.dia FROM Tipo_Ensayo te JOIN (
  SELECT 'LABORATORIO (TRATAMIENTO DE SEMILLA)' t, 3 dia UNION ALL
  SELECT 'LABORATORIO (TRATAMIENTO DE SEMILLA)', 7 UNION ALL
  SELECT 'LABORATORIO (TRATAMIENTO DE SEMILLA)', 14 UNION ALL
  SELECT 'BARBECHO', 3 UNION ALL
  SELECT 'BARBECHO', 7 UNION ALL
  SELECT 'BARBECHO', 14 UNION ALL
  SELECT 'BARBECHO', 21 UNION ALL
  SELECT 'BARBECHO', 28 UNION ALL
  SELECT 'BARBECHO', 35 UNION ALL
  SELECT 'PREEMERGENTES', 3 UNION ALL
  SELECT 'PREEMERGENTES', 7 UNION ALL
  SELECT 'PREEMERGENTES', 14 UNION ALL
  SELECT 'PREEMERGENTES', 21 UNION ALL
  SELECT 'PREEMERGENTES', 28 UNION ALL
  SELECT 'PREEMERGENTES', 35 UNION ALL
  SELECT 'TRATAMIENTOS DE SEMILLAS CAMPO', 3 UNION ALL
  SELECT 'TRATAMIENTOS DE SEMILLAS CAMPO', 7 UNION ALL
  SELECT 'TRATAMIENTOS DE SEMILLAS CAMPO', 14 UNION ALL
  SELECT 'TRATAMIENTOS DE SEMILLAS CAMPO', 21 UNION ALL
  SELECT 'TRATAMIENTOS DE SEMILLAS CAMPO', 28 UNION ALL
  SELECT 'TRATAMIENTOS DE SEMILLAS CAMPO', 35 UNION ALL
  SELECT 'FOLIARES Y RECUPERADORES', 3 UNION ALL
  SELECT 'FOLIARES Y RECUPERADORES', 7 UNION ALL
  SELECT 'FOLIARES Y RECUPERADORES', 14 UNION ALL
  SELECT 'FOLIARES Y RECUPERADORES', 21 UNION ALL
  SELECT 'FOLIARES Y RECUPERADORES', 28 UNION ALL
  SELECT 'FOLIARES Y RECUPERADORES', 35 UNION ALL
  SELECT 'FUNGICIDA', 3 UNION ALL
  SELECT 'FUNGICIDA', 7 UNION ALL
  SELECT 'FUNGICIDA', 14 UNION ALL
  SELECT 'FUNGICIDA', 21 UNION ALL
  SELECT 'FUNGICIDA', 28 UNION ALL
  SELECT 'FUNGICIDA', 35 UNION ALL
  SELECT 'INSECTICIDA', 3 UNION ALL
  SELECT 'INSECTICIDA', 7 UNION ALL
  SELECT 'INSECTICIDA', 14 UNION ALL
  SELECT 'INSECTICIDA', 21 UNION ALL
  SELECT 'INSECTICIDA', 28 UNION ALL
  SELECT 'BACTERICIDA', 3 UNION ALL
  SELECT 'BACTERICIDA', 7 UNION ALL
  SELECT 'BACTERICIDA', 14 UNION ALL
  SELECT 'BACTERICIDA', 21 UNION ALL
  SELECT 'BACTERICIDA', 28 UNION ALL
  SELECT 'DESECANTES', 3 UNION ALL
  SELECT 'DESECANTES', 7 UNION ALL
  SELECT 'DESECANTES', 14 UNION ALL
  SELECT 'DESECANTES', 21 UNION ALL
  SELECT 'DESECANTES', 28
) d ON d.t = te.nombre
ON DUPLICATE KEY UPDATE dia = VALUES(dia);
