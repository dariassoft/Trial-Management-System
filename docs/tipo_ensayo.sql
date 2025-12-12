-- docs/tipo_ensayo.sql
-- DDL para catalogar Tipos de Ensayo y sus variables predefinidas
-- Ejecutar en MySQL 8+

-- Crear tabla de Tipos de Ensayo
CREATE TABLE IF NOT EXISTS Tipo_Ensayo (
  tipo_ensayo_id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL UNIQUE,
  -- Días de evaluación almacenados como CSV según requerimiento, ej: "3,7,14"
  evaluacion_csv VARCHAR(255) NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla puente para predefinir las variables/mediciones por Tipo de Ensayo
CREATE TABLE IF NOT EXISTS Tipo_Ensayo_Variable (
  tipo_ensayo_variable_id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_ensayo_id_fk INT NOT NULL,
  variable_id_fk INT NOT NULL,
  orden INT NULL,
  requerido BOOLEAN NOT NULL DEFAULT FALSE,
  -- Permite sobreescribir la unidad o escala indicada por el diccionario general, si aplica
  unidad_override VARCHAR(30) NULL,
  escala VARCHAR(50) NULL,
  rango_min DECIMAL(10,2) NULL,
  rango_max DECIMAL(10,2) NULL,

  CONSTRAINT fk_tiev_tipo FOREIGN KEY (tipo_ensayo_id_fk) REFERENCES Tipo_Ensayo(tipo_ensayo_id) ON DELETE CASCADE,
  CONSTRAINT fk_tiev_var FOREIGN KEY (variable_id_fk) REFERENCES Protocolo_Variable(variable_id),
  CONSTRAINT uq_tiev UNIQUE (tipo_ensayo_id_fk, variable_id_fk)
);

-- (Opcional) Normalización de días de evaluación; se mantiene evaluacion_csv como fuente rápida para UI
CREATE TABLE IF NOT EXISTS Tipo_Ensayo_EvaluacionDia (
  tipo_eval_dia_id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_ensayo_id_fk INT NOT NULL,
  dia INT NOT NULL, -- días después de aplicar (DDA)
  CONSTRAINT fk_tied_tipo FOREIGN KEY (tipo_ensayo_id_fk) REFERENCES Tipo_Ensayo(tipo_ensayo_id) ON DELETE CASCADE,
  CONSTRAINT uq_tied UNIQUE (tipo_ensayo_id_fk, dia)
);

-- Índices sugeridos
CREATE INDEX idx_tiev_tipo ON Tipo_Ensayo_Variable(tipo_ensayo_id_fk);
CREATE INDEX idx_tiev_var ON Tipo_Ensayo_Variable(variable_id_fk);
CREATE INDEX idx_tied_tipo ON Tipo_Ensayo_EvaluacionDia(tipo_ensayo_id_fk);
