-- ============================================================================
-- TABLA: StatusEnsayo
-- DESCRIPCIÓN: Define los estados posibles para cada ensayo
-- FECHA: 2025-12-13
-- ACTUALIZADO: 2025-12-14
-- ============================================================================

-- Crear tabla StatusEnsayo
CREATE TABLE IF NOT EXISTS StatusEnsayo (
  status_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del estado',
  nombre VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre del estado (ej: Por Iniciar, En Ejecución)',
  descripcion VARCHAR(255) COMMENT 'Descripción del estado',
  activo BOOLEAN DEFAULT TRUE COMMENT 'Indica si el estado está disponible',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última actualización'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de estados para ensayos';

-- Crear índice en nombre para búsquedas rápidas
CREATE INDEX idx_status_nombre ON StatusEnsayo(nombre);

-- Crear índice en activo para filtros
CREATE INDEX idx_status_activo ON StatusEnsayo(activo);

-- Agregar columna status_id_fk en tabla Ensayo si no existe
ALTER TABLE Ensayo
ADD COLUMN status_id_fk INT COMMENT 'FK a StatusEnsayo';

-- Agregar foreign key si no existe (usando nombre único para evitar duplicados)
-- Verificar primero si ya existe
SET @fk_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
  WHERE CONSTRAINT_NAME = 'fk_ensayo_status'
  AND TABLE_NAME = 'Ensayo'
);

-- Solo agregar si no existe
ALTER TABLE Ensayo
ADD CONSTRAINT fk_ensayo_status
FOREIGN KEY (status_id_fk)
REFERENCES StatusEnsayo(status_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Crear índice en Ensayo.status_id_fk si no existe
CREATE INDEX idx_ensayo_status_fk ON Ensayo(status_id_fk);

