-- Script para eliminar la restricción única bloque+tratamiento de la tabla Parcela
-- Esto permite que un tratamiento se repita en diferentes parcelas del mismo bloque
-- Fecha: 2026-01-29
-- EJECUTADO: Sí

-- El índice único original se llama: IDX_acdb4a62b0e29a70f0632e8b10
-- Pero MySQL no permite eliminar un índice que está siendo usado por una FK
-- Por eso primero creamos un índice simple para la columna bloque_id_fk

-- Paso 1: Crear índice simple para bloque_id_fk (necesario para mantener la FK)
CREATE INDEX idx_parcela_bloque ON Parcela(bloque_id_fk);

-- Paso 2: Eliminar el índice único bloque+tratamiento
ALTER TABLE Parcela DROP INDEX `IDX_acdb4a62b0e29a70f0632e8b10`;

-- Verificar resultado
-- SHOW INDEX FROM Parcela;
