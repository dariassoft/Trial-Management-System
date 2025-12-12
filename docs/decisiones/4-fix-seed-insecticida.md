### 4) Corrección de semilla SQL: sección INSECTICIDA en `tipo_ensayo_seed.sql`

Problema reportado
- Al ejecutar `docs/tipo_ensayo_seed.sql`, se producía un error a partir de la sección `-- INSECTICIDA` indicando que no existía el campo `escala`.

Causa raíz
- El esquema sí define el campo `escala` en `Tipo_Ensayo_Variable` (ver `docs/tipo_ensayo.sql`).
- El error se originaba en el subquery derivado (`ord`) de la sección INSECTICIDA: algunas columnas no tenían alias consistentes (`unidad_override`, `escala`). MySQL, al proyectar columnas posicionalmente, no encontraba el alias `escala` al hacer `SELECT ... ord.escala`.

Solución aplicada
- Se normalizó el subquery de INSECTICIDA para que todas las filas definan explícitamente los alias `unidad_override` y `escala` en las columnas derivadas.
- Fragmento corregido (resumen):
  ```sql
  -- INSECTICIDA
  INSERT INTO Tipo_Ensayo_Variable (tipo_ensayo_id_fk, variable_id_fk, orden, requerido, unidad_override, escala)
  SELECT te.tipo_ensayo_id, pv.variable_id, ord.orden, ord.requerido, ord.unidad_override, ord.escala
  FROM Tipo_Ensayo te
  JOIN (
    SELECT 'N° DE ACAROS POR FOLIOLO' n, 1 orden, FALSE requerido, 'N°' unidad_override, NULL escala UNION ALL
    ...
    SELECT 'PORCENTAJE DE DESFOLIACIÓN', 7, FALSE, '%' unidad_override, '0-100' escala UNION ALL
    ...
  ) ord ON 1=1
  JOIN Protocolo_Variable pv ON pv.nombre_variable = ord.n
  WHERE te.nombre = 'INSECTICIDA'
  ON DUPLICATE KEY UPDATE
    orden = VALUES(orden),
    requerido = VALUES(requerido),
    unidad_override = VALUES(unidad_override),
    escala = VALUES(escala);
  ```

Verificaciones
- Confirmado que `docs/tipo_ensayo.sql` define `Tipo_Ensayo_Variable.escala`.
- Revisadas otras secciones (BARBECHO, PREEMERGENTES, FUNGICIDA, BACTERICIDA, DESECANTES): ya utilizaban `ord.escala` con alias presente en el subquery o `NULL escala`.

Cómo ejecutar
1. Asegúrate de haber corrido antes `docs/tipo_ensayo.sql` (crea las tablas de catálogo) y de tener `Protocolo_Variable` existente (de `database.sql`).
2. Ejecuta: `mysql -h <host> -P <port> -u<user> -p<pass> <db> < docs/tipo_ensayo_seed.sql`

Notas
- Los `INSERT ... ON DUPLICATE KEY UPDATE` suponen la restricción única `(tipo_ensayo_id_fk, variable_id_fk)` en `Tipo_Ensayo_Variable`, presente en `docs/tipo_ensayo.sql`.
- El script es idempotente: se puede re-ejecutar sin duplicar filas.