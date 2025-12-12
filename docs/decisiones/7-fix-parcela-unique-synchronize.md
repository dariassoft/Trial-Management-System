### 7) Error de arranque por DROP INDEX en Parcela (ER_DROP_INDEX_FK) y alineación ORM-DB

Problema
- Al iniciar la app con TypeORM `synchronize: true`, MySQL rechazó un intento de eliminar el índice único `uq_parcela_ensayo_nombre`:
  - `QueryFailedError: Cannot drop index 'uq_parcela_ensayo_nombre': needed in a foreign key constraint`
- Este índice fue creado manualmente por `docs/alter_parcela_nombre.sql` para asegurar la unicidad de `nombre_parcela` dentro de cada ensayo.

Causa raíz
- El esquema de la BD (índices creados por SQL) no coincidía con el metadata de TypeORM (entidades). 
- Al no ver el índice en metadata, `synchronize: true` intentó reconciliar el estado borrándolo; MySQL lo impidió por depender de él en alguna restricción.

Solución aplicada (mínima y segura)
- Se alineó la entidad `Parcela` con los índices/constraints existentes en la BD:
  - `@Unique('uq_parcela_ensayo_nombre', ['ensayo', 'nombreParcela'])`
  - `@Index('idx_parcela_nombre', ['nombreParcela'])`
- Se añadió además una unicidad recomendada en `Ensayo` para reflejar `docs/alter_ensayo_laboratorio.sql`:
  - `@Index('uq_ensayo_lab_codigo', ['laboratorio', 'codigoLabor'], { unique: true })`

Efecto
- Con la metadata ORM alineada, `synchronize` deja de intentar eliminar el índice y la conexión a BD debe establecerse correctamente (suponiendo permisos de filesystem resueltos para `dist/`).

Verificación sugerida
1. Type-check sin emitir:
   ```bash
   npx tsc --noEmit -p tsconfig.build.json
   ```
2. Ajustar permisos del directorio de build si es necesario (Linux):
   ```bash
   rm -rf dist && mkdir dist && chmod -R u+rwX dist
   ```
3. Arrancar en dev y revisar logs de TypeORM:
   ```bash
   npm run start:dev
   ```

Operativa recomendada
- En producción, usar `synchronize: false` y aplicar cambios de esquema sólo con los SQL bajo `docs/`. Mantener ORM y DB en sincronía evita migraciones implícitas peligrosas.

Diagnóstico adicional (si volviera a aparecer)
- Inspeccionar el estado real de índices/constraints:
  ```sql
  SHOW CREATE TABLE Parcela; 
  SHOW INDEX FROM Parcela; 
  SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
  FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('Parcela','Datos_Campo','Momento_Evaluacion');
  ```
- Nunca eliminar índices necesarios para FKs sin re-crear previamente los FKs afectados.
