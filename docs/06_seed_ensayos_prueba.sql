-- Seed data para Ensayos de prueba
-- Con lab_id_fk asignado

INSERT INTO Ensayo (
  lab_id_fk,
  nombre_ensayo,
  version_protocolo,
  responsable,
  provincia,
  departamento,
  establecimiento,
  lote,
  latitud,
  longitud,
  cultivo_especie,
  cultivo_variedad,
  tipo_siembra,
  dist_surcos_cm,
  fecha_siembra
) VALUES
(1, 'Ensayo Soja Temprana 2024', 'v1.0', 'Juan García', 'Córdoba', 'Río Cuarto', 'La Estancia', 'Lote A', -38.7465, -64.2419, 'Soja', 'Asgrow MG4.2', 'Directa', 52, '2024-11-01'),
(1, 'Ensayo Maíz Híbrido Temprano', 'v2.1', 'María López', 'Córdoba', 'Río Cuarto', 'San Juan', 'Lote B', -38.7500, -64.2400, 'Maíz', 'DK 7710', 'Mecánica', 75, '2024-10-15'),
(1, 'Ensayo Comparativo Trigos', 'v1.5', 'Carlos Martínez', 'Buenos Aires', 'Tres Arroyos', 'La Pampa', 'Lote C', -38.2500, -60.2000, 'Trigo', 'Baguette 620', 'Mecánica', 17.5, '2024-09-20'),
(1, 'Ensayo Soja tardía con Fungicidas', 'v1.0', 'Ana Rodríguez', 'Santa Fe', 'Rosario', 'El Triunfo', 'Lote D', -32.8750, -60.6500, 'Soja', 'Don Mario', 'Directa', 52, '2024-12-01'),
(1, 'Ensayo Maíz y rotación de cultivos', 'v3.0', 'Roberto Silva', 'Entre Ríos', 'Paraná', 'Las Delicias', 'Lote E', -31.7500, -60.5000, 'Maíz', 'Pioneer 30F35', 'Mecánica', 75, '2024-11-20'),
(1, 'Ensayo Piloto - Barbecho y cobertura', 'v1.2', 'Laura González', 'La Pampa', 'Caleu Caleu', 'La Negra', 'Lote F', -37.9000, -65.4000, 'Barbecho', 'N/A', 'Mecánica', 0, '2024-08-15'),
(1, 'Ensayo Poroto - Densidad de siembra', 'v2.0', 'Fernando Díaz', 'Córdoba', 'Tercero Arriba', 'San Isidro', 'Lote G', -33.7000, -62.5000, 'Poroto', 'Alubia', 'Mecánica', 45, '2024-11-10'),
(1, 'Ensayo Maní - Ciclo largo', 'v1.0', 'Patricia López', 'Buenos Aires', 'Bragado', 'Santa Rosa', 'Lote H', -35.1200, -61.1600, 'Maní', 'Florunner', 'Mecánica', 38, '2024-10-01'),
(1, 'Ensayo Cebada cervecera', 'v1.5', 'Miguel Ramos', 'La Pampa', 'Maracó', 'El Trébol', 'Lote I', -36.8000, -66.3000, 'Cebada', 'MB3', 'Mecánica', 18, '2024-09-01'),
(1, 'Ensayo Soja - Manejo de malezas', 'v2.5', 'Daniela Moreno', 'Córdoba', 'Río Segundo', 'Villa María', 'Lote J', -32.4000, -63.2000, 'Soja', 'Morgan 5.9', 'Directa', 52, '2024-11-15');

