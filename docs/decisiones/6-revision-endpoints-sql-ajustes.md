### 6) Revisión de endpoints tras cambios SQL y ajustes aplicados

Objetivo
- Alinear los endpoints y modelos de la API con las alteraciones recientes en la base de datos: nuevos campos en `Ensayo` (`lab_id_fk`, `codigo_labor`, `tipo_ensayo_id_fk`) y nuevo campo en `Parcela` (`nombre_parcela`).
- Verificar documentación Swagger y ejemplos para reflejar los nuevos campos.

Hallazgos clave
- `Ensayo` (API) no exponía los campos agregados vía SQL: laboratorio, código de labor y tipo de ensayo.
- `Parcela` (API) no permitía asignar/editar el `nombre_parcela` (nomenclatura manual como `26-BASF-0001-PRE-1 A`).
- Los catálogos de `Tipos de Ensayo` y `Cultivos/Variedades` ya estaban consistentes.

Cambios aplicados
- Ensayos
  - DTO `CreateEnsayoDto`: se agregaron `codigoLabor` (string), `laboratorioId` (int) y `tipoEnsayoId` (int).
  - Servicio `EnsayosService`:
    - `create`: asigna `codigoLabor` y setea relaciones `laboratorio` y `tipoEnsayo` cuando se envían `laboratorioId` y `tipoEnsayoId`.
    - `update`: permite actualizar `codigoLabor` y (opcionalmente) reasignar `laboratorio` y/o `tipoEnsayo` con IDs; acepta `null` para remover.
  - Módulo `EnsayosModule`: se agregaron repos de `Laboratorio` y `TipoEnsayo` en `TypeOrmModule.forFeature([...])`.
  - Controlador `EnsayosController`: se actualizaron ejemplos de Swagger para incluir los nuevos campos.
- Parcelas
  - DTO `CreateParcelaDto`: se agregó `nombreParcela` (opcional, string, max 50).
  - Servicio `ParcelasService`:
    - `create`: guarda `nombreParcela`.
    - `update`: permite actualizar `nombreParcela`.
  - Controlador `ParcelasController`: se actualizaron ejemplos de Swagger para mostrar `nombreParcela`.

Notas de esquema y validaciones
- `Parcela` posee índice único por ensayo y nombre (`UNIQUE(ensayo_id_fk, nombre_parcela)`), por lo que el backend retornará error de DB si se intenta duplicar el nombre dentro del mismo ensayo.
- `Ensayo` tiene índice único recomendado `UNIQUE(lab_id_fk, codigo_labor)`. Si se utiliza, asegúrate de no repetir el `codigo_labor` dentro del mismo laboratorio.

Impacto en el cliente (UI)
- Crear/editar Ensayo: permitir elegir un laboratorio (dropdown de `Laboratorio`) y un tipo de ensayo (dropdown de `Tipo_Ensayo`), y capturar el `codigoLabor`.
- Crear/editar Parcela: habilitar campo de texto para `nombreParcela`. Para repeticiones, usar la convención de sufijo A/B/C, etc.

Cómo verificar
1. Type-check sin emitir:
   ```bash
   npx tsc --noEmit -p tsconfig.build.json
   ```
2. Levantar en dev y abrir Swagger:
   ```bash
   npm run start:dev
   # http://localhost:3000/docs
   ```
3. Probar:
   - POST `/api/v1/ensayos` con `codigoLabor`, `laboratorioId`, `tipoEnsayoId`.
   - PATCH `/api/v1/ensayos/:id` cambiando `tipoEnsayoId` o removiéndolo con `null`.
   - POST `/api/v1/parcelas` con `nombreParcela`.
   - PATCH `/api/v1/parcelas/:id` modificando `nombreParcela`.

Compatibilidad y migración
- En desarrollo está activo `synchronize: true` (TypeORM). En producción, mantener desactivado y aplicar SQL de `docs/alter_ensayo_laboratorio.sql` y `docs/alter_parcela_nombre.sql`.

Relacionados
- 3) Tipos de Ensayo y EAV (`docs/decisiones/3-tipos-ensayo-y-eav.md`).
- 5) Endpoints de Tipos de Ensayo (`docs/decisiones/5-endpoints-tipos-ensayo.md`).
