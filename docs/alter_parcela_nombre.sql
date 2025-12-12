-- docs/alter_parcela_nombre.sql
-- Agrega nombre/código manual para la Parcela y evita duplicados por Ensayo

ALTER TABLE Parcela
  ADD COLUMN IF NOT EXISTS nombre_parcela VARCHAR(50) NULL AFTER tratamiento_id_fk;

-- Unicidad del nombre dentro del mismo Ensayo
CREATE UNIQUE INDEX IF NOT EXISTS uq_parcela_ensayo_nombre ON Parcela(ensayo_id_fk, nombre_parcela);

-- Índice auxiliar para búsquedas por nombre
CREATE INDEX IF NOT EXISTS idx_parcela_nombre ON Parcela(nombre_parcela);
