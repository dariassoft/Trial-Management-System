-- Tabla/Columna Status para Ensayo
-- Este script crea la columna status si no existe

-- Agregar columna status a tabla Ensayo (si no existe)
ALTER TABLE Ensayo
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Activo' AFTER fecha_siembra;

-- Crear índice en status para búsquedas rápidas
ALTER TABLE Ensayo
ADD INDEX IF NOT EXISTS idx_ensayo_status (status);

-- Valores válidos para status:
-- 'Activo' - Por defecto, ensayo en estado normal
-- 'En Ejecución' - Ensayo actualmente en fase de ejecución
-- 'Completado' - Ensayo ya finalizado
-- 'Por Iniciar' - Ensayo planificado pero no iniciado
-- 'Pausado' - Ensayo pausado temporalmente
-- 'Cancelado' - Ensayo cancelado

