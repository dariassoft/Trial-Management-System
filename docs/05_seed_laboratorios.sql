-- ==================================================
-- 05_seed_laboratorios.sql
-- ==================================================
-- Seed de Laboratorios y Productos Iniciales

-- ==================================================
-- INSERTAR LABORATORIOS
-- ==================================================

INSERT INTO Laboratorio (nombre) VALUES ('Laboratorio Principal');
INSERT INTO Laboratorio (nombre) VALUES ('ADAMA');
INSERT INTO Laboratorio (nombre) VALUES ('Bayer');
INSERT INTO Laboratorio (nombre) VALUES ('Syngenta');
INSERT INTO Laboratorio (nombre) VALUES ('Corteva');
INSERT INTO Laboratorio (nombre) VALUES ('Nufarm');

-- ==================================================
-- INSERTAR PRODUCTOS
-- ==================================================

INSERT INTO Producto (lab_id_fk, nombre_comercial, principio_activo, formulacion)
SELECT lab_id, 'Glifosato 480', 'Glifosato', 'SL' FROM Laboratorio WHERE nombre = 'Laboratorio Principal';

INSERT INTO Producto (lab_id_fk, nombre_comercial, principio_activo, formulacion)
SELECT lab_id, 'Glifosato Plus', 'Glifosato', 'SL' FROM Laboratorio WHERE nombre = 'Laboratorio Principal';

INSERT INTO Producto (lab_id_fk, nombre_comercial, principio_activo, formulacion)
SELECT lab_id, 'Atrazina 50', 'Atrazina', 'PM' FROM Laboratorio WHERE nombre = 'Laboratorio Principal';

INSERT INTO Producto (lab_id_fk, nombre_comercial, principio_activo, formulacion)
SELECT lab_id, 'Glif Activo', 'Glifosato', 'SL' FROM Laboratorio WHERE nombre = 'ADAMA';

INSERT INTO Producto (lab_id_fk, nombre_comercial, principio_activo, formulacion)
SELECT lab_id, 'Predator', '2,4-D', 'EE' FROM Laboratorio WHERE nombre = 'ADAMA';

INSERT INTO Producto (lab_id_fk, nombre_comercial, principio_activo, formulacion)
SELECT lab_id, 'Roundup', 'Glifosato', 'SL' FROM Laboratorio WHERE nombre = 'Bayer';

INSERT INTO Producto (lab_id_fk, nombre_comercial, principio_activo, formulacion)
SELECT lab_id, 'Tempo', 'Cipermetrina', 'EW' FROM Laboratorio WHERE nombre = 'Bayer';

INSERT INTO Producto (lab_id_fk, nombre_comercial, principio_activo, formulacion)
SELECT lab_id, 'Gramoxone', 'Paraquat', 'SL' FROM Laboratorio WHERE nombre = 'Syngenta';

INSERT INTO Producto (lab_id_fk, nombre_comercial, principio_activo, formulacion)
SELECT lab_id, 'Actara', 'Tiametoxam', 'WG' FROM Laboratorio WHERE nombre = 'Syngenta';

INSERT INTO Producto (lab_id_fk, nombre_comercial, principio_activo, formulacion)
SELECT lab_id, 'Engeo Plata', 'Tiametoxam + Lambda', 'SC' FROM Laboratorio WHERE nombre = 'Corteva';

INSERT INTO Producto (lab_id_fk, nombre_comercial, principio_activo, formulacion)
SELECT lab_id, 'Lorsban', 'Clorpirifós', 'EC' FROM Laboratorio WHERE nombre = 'Corteva';

INSERT INTO Producto (lab_id_fk, nombre_comercial, principio_activo, formulacion)
SELECT lab_id, 'Foley', 'Glifosato', 'SL' FROM Laboratorio WHERE nombre = 'Nufarm';

INSERT INTO Producto (lab_id_fk, nombre_comercial, principio_activo, formulacion)
SELECT lab_id, 'Cartap', 'Cartap', 'SL' FROM Laboratorio WHERE nombre = 'Nufarm';

-- ==================================================
-- ASIGNAR LABORATORIOS AL USUARIO SUPERADMIN
-- ==================================================

INSERT INTO Usuario_Laboratorio (usuario_id_fk, lab_id_fk)
SELECT u.usuario_id, l.lab_id
FROM Usuario u, Laboratorio l
WHERE u.username = 'dariassoft@gmail.com'
AND l.nombre = 'Laboratorio Principal'
AND NOT EXISTS (
  SELECT 1 FROM Usuario_Laboratorio ul
  WHERE ul.usuario_id_fk = u.usuario_id
  AND ul.lab_id_fk = l.lab_id
)
LIMIT 1;

