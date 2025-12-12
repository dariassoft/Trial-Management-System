SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

DELETE FROM Ensayo;

INSERT INTO Ensayo (lab_id_fk, nombre_ensayo, version_protocolo, responsable, provincia, departamento, fecha_siembra, status)
VALUES
(1, 'Ensayo Soja Temprana 2024', 'v1.0', 'Juan García', 'Córdoba', 'Río Cuarto', '2024-11-01', 'En Ejecución'),
(1, 'Ensayo Maíz Híbrido Temprano', 'v2.1', 'María López', 'Córdoba', 'Río Cuarto', '2024-10-15', 'En Ejecución'),
(1, 'Ensayo Comparativo Trigos', 'v1.5', 'Carlos Martínez', 'Buenos Aires', 'Tres Arroyos', '2024-09-20', 'En Ejecución'),
(1, 'Ensayo Soja tardía con Fungicidas', 'v1.0', 'Ana Rodríguez', 'Santa Fe', 'Rosario', '2024-12-01', 'Completado'),
(1, 'Ensayo Maíz y rotación de cultivos', 'v3.0', 'Roberto Silva', 'Entre Ríos', 'Paraná', '2024-11-20', 'Completado'),
(1, 'Ensayo Piloto - Barbecho y cobertura', 'v1.2', 'Laura González', 'La Pampa', 'Caleu Caleu', '2024-08-15', 'Por Iniciar'),
(1, 'Ensayo Poroto - Densidad de siembra', 'v2.0', 'Fernando Díaz', 'Córdoba', 'Tercero Arriba', '2024-11-10', 'Por Iniciar'),
(1, 'Ensayo Maní - Ciclo largo', 'v1.0', 'Patricia López', 'Buenos Aires', 'Bragado', '2024-10-01', 'Por Iniciar'),
(1, 'Ensayo Cebada cervecera', 'v1.5', 'Miguel Ramos', 'La Pampa', 'Maracó', '2024-09-01', 'Por Iniciar'),
(1, 'Ensayo Soja - Manejo de malezas', 'v2.5', 'Daniela Moreno', 'Córdoba', 'Río Segundo', '2024-11-15', 'Por Iniciar');

SELECT COUNT(*) FROM Ensayo;
SELECT nombre_ensayo, responsable FROM Ensayo LIMIT 3;

