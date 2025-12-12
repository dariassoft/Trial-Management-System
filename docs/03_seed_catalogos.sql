-- ==================================================
-- 03_seed_catalogos.sql
-- ==================================================
-- Seed de Catálogos: Cultivos, Variedades

-- ==================================================
-- INSERTAR CULTIVOS
-- ==================================================

INSERT INTO Cultivo (nombre) VALUES ('Soja');
INSERT INTO Cultivo (nombre) VALUES ('Maiz');
INSERT INTO Cultivo (nombre) VALUES ('Barbecho');
INSERT INTO Cultivo (nombre) VALUES ('Poroto');
INSERT INTO Cultivo (nombre) VALUES ('Mani');
INSERT INTO Cultivo (nombre) VALUES ('Trigo');
INSERT INTO Cultivo (nombre) VALUES ('Cebada');
INSERT INTO Cultivo (nombre) VALUES ('Otros');

-- ==================================================
-- INSERTAR VARIEDADES POR CULTIVO
-- ==================================================

INSERT INTO Cultivo_Variedad (cultivo_id_fk, nombre)
SELECT cultivo_id, 'Asgrow MG4.2' FROM Cultivo WHERE nombre = 'Soja';

INSERT INTO Cultivo_Variedad (cultivo_id_fk, nombre)
SELECT cultivo_id, 'DM 4.0i' FROM Cultivo WHERE nombre = 'Soja';

INSERT INTO Cultivo_Variedad (cultivo_id_fk, nombre)
SELECT cultivo_id, 'Desoy 3810' FROM Cultivo WHERE nombre = 'Soja';

INSERT INTO Cultivo_Variedad (cultivo_id_fk, nombre)
SELECT cultivo_id, 'DK 7710' FROM Cultivo WHERE nombre = 'Maiz';

INSERT INTO Cultivo_Variedad (cultivo_id_fk, nombre)
SELECT cultivo_id, 'SK 7333' FROM Cultivo WHERE nombre = 'Maiz';

INSERT INTO Cultivo_Variedad (cultivo_id_fk, nombre)
SELECT cultivo_id, 'P1198W' FROM Cultivo WHERE nombre = 'Maiz';

INSERT INTO Cultivo_Variedad (cultivo_id_fk, nombre)
SELECT cultivo_id, 'Baguette 620' FROM Cultivo WHERE nombre = 'Trigo';

INSERT INTO Cultivo_Variedad (cultivo_id_fk, nombre)
SELECT cultivo_id, 'Klein Proteo' FROM Cultivo WHERE nombre = 'Trigo';

INSERT INTO Cultivo_Variedad (cultivo_id_fk, nombre)
SELECT cultivo_id, 'Baguette 250' FROM Cultivo WHERE nombre = 'Trigo';

INSERT INTO Cultivo_Variedad (cultivo_id_fk, nombre)
SELECT cultivo_id, 'Scarlett' FROM Cultivo WHERE nombre = 'Cebada';

INSERT INTO Cultivo_Variedad (cultivo_id_fk, nombre)
SELECT cultivo_id, 'Rainbow' FROM Cultivo WHERE nombre = 'Cebada';

