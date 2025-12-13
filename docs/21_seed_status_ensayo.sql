-- ============================================================================
-- SEED: StatusEnsayo - Datos iniciales
-- DESCRIPCIÓN: Carga los 7 estados predefinidos para ensayos
-- FECHA: 2025-12-13
-- ============================================================================

INSERT INTO StatusEnsayo (nombre, descripcion, activo) VALUES
  ('Por Iniciar', 'Ensayo creado pero aún no ha comenzado', TRUE),
  ('En Ejecución', 'Ensayo actualmente en ejecución en campo', TRUE),
  ('En Análisis', 'Ensayo completado, datos en análisis de laboratorio', TRUE),
  ('Completado', 'Ensayo completado con análisis finalizado', TRUE),
  ('Cancelado', 'Ensayo cancelado durante su ejecución', TRUE),
  ('Suspendido', 'Ensayo suspendido temporalmente, puede reanudarse', TRUE),
  ('Archivado', 'Ensayo archivado, sin posibilidad de modificación', TRUE);

