### 5) Endpoints para Tipos de Ensayo, Variables predefinidas y Días de Evaluación

#### Decisión
- Se implementó un catálogo administrable de Tipos de Ensayo (`Tipo_Ensayo`) con soporte para:
  - CRUD completo del tipo
  - Gestión de variables/mediciones asociadas por tipo (`Tipo_Ensayo_Variable`): orden, requerido, unidad override, escala y rangos
  - Gestión de la planificación de evaluación (DDA) tanto en `evaluacion_csv` como en la tabla normalizada `Tipo_Ensayo_EvaluacionDia`
- Los endpoints se ubican bajo el prefijo `/api/v1/catalogos/tipos-ensayo` y están protegidos por JWT y guard de roles. Lectura: cualquier usuario autenticado; escritura: ADMIN, SUPERADMIN, MANAGER.

#### Entidades nuevas (TypeORM)
- `src/entities/tipo-ensayo.entity.ts` → tabla `Tipo_Ensayo`
- `src/entities/tipo-ensayo-variable.entity.ts` → tabla `Tipo_Ensayo_Variable`
- `src/entities/tipo-ensayo-evaluacion-dia.entity.ts` → tabla `Tipo_Ensayo_EvaluacionDia`
- Se amplió `Ensayo` con relación a `Laboratorio` (`lab_id_fk`), `codigo_labor` y relación opcional a `Tipo_Ensayo` (`tipo_ensayo_id_fk`). Se agregó `nombre_parcela` a `Parcela`.

#### Módulo NestJS
- `src/catalogos/tipos-ensayo/tipos-ensayo.module.ts`
- `src/catalogos/tipos-ensayo/tipos-ensayo.service.ts`
- `src/catalogos/tipos-ensayo/tipos-ensayo.controller.ts`
- DTOs: `create-tipo-ensayo.dto.ts`, `update-tipo-ensayo.dto.ts`, `add-variable.dto.ts`, `update-variable.dto.ts`, `set-evaluacion.dto.ts`

#### Rutas y permisos
- Tipos de Ensayo
  - POST `/catalogos/tipos-ensayo` (ADMIN|SUPERADMIN|MANAGER)
  - GET `/catalogos/tipos-ensayo` (auth)
  - GET `/catalogos/tipos-ensayo/:id` (auth)
  - PATCH `/catalogos/tipos-ensayo/:id` (ADMIN|SUPERADMIN|MANAGER)
  - DELETE `/catalogos/tipos-ensayo/:id` (ADMIN|SUPERADMIN)
- Variables por Tipo
  - GET `/catalogos/tipos-ensayo/:id/variables` (auth)
  - POST `/catalogos/tipos-ensayo/:id/variables` (ADMIN|SUPERADMIN|MANAGER)
  - PATCH `/catalogos/tipos-ensayo/variables/:tevId` (ADMIN|SUPERADMIN|MANAGER)
  - DELETE `/catalogos/tipos-ensayo/variables/:tevId` (ADMIN|SUPERADMIN|MANAGER)
- Días de Evaluación
  - GET `/catalogos/tipos-ensayo/:id/dias` (auth)
  - PUT `/catalogos/tipos-ensayo/:id/evaluacion` (ADMIN|SUPERADMIN|MANAGER)

Notas:
- El endpoint `PUT /:id/evaluacion` acepta `evaluacionCsv` (string "3,7,14") o `dias` (array `[3,7,14]`). Sincroniza `evaluacion_csv` y reescribe los registros en `Tipo_Ensayo_EvaluacionDia` para ese tipo.

#### Ejemplos de requests
- Crear tipo de ensayo
```http
POST /api/v1/catalogos/tipos-ensayo
Authorization: Bearer <JWT>
Content-Type: application/json

{ "nombre": "FUNGICIDA", "evaluacionCsv": "3,7,14,21,28,35", "activo": true }
```

- Listar variables de un tipo
```http
GET /api/v1/catalogos/tipos-ensayo/6/variables
Authorization: Bearer <JWT>
```

- Agregar variable a un tipo
```http
POST /api/v1/catalogos/tipos-ensayo/6/variables
Authorization: Bearer <JWT>
Content-Type: application/json

{ "variableId": 22, "orden": 1, "requerido": true, "escala": "1-9" }
```

- Actualizar días de evaluación
```http
PUT /api/v1/catalogos/tipos-ensayo/6/evaluacion
Authorization: Bearer <JWT>
Content-Type: application/json

{ "dias": [3,7,14,21,28,35] }
```

#### Consideraciones de validación
- DTOs con `class-validator` y `class-transformer` para sanitizar, validar y documentar con Swagger.
- Restricción única `(tipo_ensayo_id_fk, variable_id_fk)` evita duplicar variables por tipo. El servicio retorna 400 si se intenta duplicar.

#### Integración en AppModule
- `TiposEnsayoModule` importado en `src/app.module.ts`.

#### Swagger
- Etiqueta: "Catálogo - Tipos de Ensayo" con `@ApiTags`.
- Autenticación: `@ApiBearerAuth()`; se heredan guards globales (JWT + Roles).

#### Impacto en el cliente (dropdowns)
- Tipos activos: `GET /catalogos/tipos-ensayo` y filtrar `activo` desde el cliente o agregar filtro en backend si se requiere.
- Variables por tipo: `GET /catalogos/tipos-ensayo/:id/variables` devuelve la relación con unidad efectiva via `unidadOverride` (si presente) + metadatos de escala/rangos.
- Días planificados: `GET /catalogos/tipos-ensayo/:id/dias` para vector ordenado; o leer `evaluacionCsv` desde `GET /catalogos/tipos-ensayo/:id`.

#### Próximos pasos sugeridos
- Filtros y paginación para `GET /catalogos/tipos-ensayo` (por `activo` y texto).
- Endpoint de reordenamiento masivo de variables.
- Validaciones numéricas en captura de mediciones según `escala/rango_min/rango_max` en el backend.
