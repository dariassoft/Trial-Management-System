-- docs/alter_ensayo_laboratorio.sql
-- Vincula Ensayo con Laboratorio y agrega un código/identificador de labor
-- También agrega el FK opcional a Tipo_Ensayo para clasificar el ensayo

ALTER TABLE Ensayo
  ADD COLUMN IF NOT EXISTS lab_id_fk INT NULL AFTER ensayo_id,
  ADD COLUMN IF NOT EXISTS codigo_labor VARCHAR(50) NULL AFTER nombre_ensayo,
  ADD COLUMN IF NOT EXISTS tipo_ensayo_id_fk INT NULL AFTER version_protocolo;

-- Índices
CREATE INDEX IF NOT EXISTS idx_ensayo_lab ON Ensayo(lab_id_fk);
CREATE INDEX IF NOT EXISTS idx_ensayo_codigo ON Ensayo(codigo_labor);
CREATE INDEX IF NOT EXISTS idx_ensayo_tipo ON Ensayo(tipo_ensayo_id_fk);

-- FKs (si ya existieran, MySQL fallará; ejecutar en entorno controlado)
ALTER TABLE Ensayo
  ADD CONSTRAINT fk_ensayo_lab FOREIGN KEY (lab_id_fk) REFERENCES Laboratorio(lab_id),
  ADD CONSTRAINT fk_ensayo_tipo FOREIGN KEY (tipo_ensayo_id_fk) REFERENCES Tipo_Ensayo(tipo_ensayo_id);

-- Recomendación: evitar duplicados del código dentro de un laboratorio
-- Dos laboratorios diferentes podrían usar el mismo código, pero dentro del mismo lab debe ser único
CREATE UNIQUE INDEX IF NOT EXISTS uq_ensayo_lab_codigo ON Ensayo(lab_id_fk, codigo_labor);
