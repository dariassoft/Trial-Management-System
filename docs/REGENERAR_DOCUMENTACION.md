# 📚 REGENERAR DOCUMENTACIÓN SWAGGER Y POSTMAN

## 🎯 Para Actualizar la Documentación OpenAPI y Postman

Si necesitas regenerar los archivos de documentación (openapi.json y Postman collections), sigue estos pasos:

### Opción 1: Dentro del Contenedor Backend

```bash
# 1. Ir al directorio del backend
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend

# 2. Asegurar que está compilado
npm run build

# 3. Generar OpenAPI (desde el repositorio raíz, en la terminal local)
node scripts/generate-openapi.js

# 4. Convertir OpenAPI a Postman (opcional)
node scripts/openapi-to-postman.js
```

### Opción 2: Usar Swagger UI en Runtime

Si el backend está corriendo, puedes acceder a Swagger en:

```
http://localhost:3000/api/docs
```

Swagger generará la documentación automáticamente desde los decoradores @ApiProperty en los DTOs.

---

## 📁 Archivos de Documentación

### Ubicación de Archivos

```
docs/
├── openapi.json                      # Especificación OpenAPI 3.0
├── TMS_Postman_2025.postman_collection.json
├── tms-postman.postman_collection.json
├── TMS_Environment.postman_environment.json
└── tms-postman.environment.json
```

### Contenido Esperado en OpenAPI

El archivo `openapi.json` debe incluir:

#### Endpoint: POST /api/v1/ensayos
```json
{
  "post": {
    "summary": "Crear un nuevo ensayo",
    "requestBody": {
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "nombreEnsayo": { "type": "string", "example": "Ensayo de Maíz Tardío 2025" },
              "codigoLabor": { "type": "string", "example": "LAB-2025-003" },
              "laboratorioId": { "type": "number", "example": 1 },
              "tipoEnsayoId": { "type": "number", "example": 4 },
              "responsableId": { "type": "number", "example": 5 },
              "provincia": { "type": "string", "example": "Córdoba" },
              "departamento": { "type": "string", "example": "Río Cuarto" },
              "establecimiento": { "type": "string", "example": "El Progreso" },
              "lote": { "type": "string", "example": "Lote 7A" },
              "latitud": { "type": "number", "example": -33.1306 },
              "longitud": { "type": "number", "example": -64.349 },
              "cultivoId": { "type": "number", "example": 1 },
              "variedadId": { "type": "number", "example": 1 },
              "tipoSiembraId": { "type": "number", "example": 1 },
              "distSurcosCm": { "type": "number", "example": 52.5 },
              "fechaInicio": { "type": "string", "format": "date", "example": "2025-12-10" },
              "fechaSiembra": { "type": "string", "format": "date", "example": "2025-12-15" },
              "fechaCosecha": { "type": "string", "format": "date", "example": "2026-05-20" },
              "status": { "type": "string", "example": "Por Iniciar" }
            },
            "required": ["nombreEnsayo"]
          }
        }
      }
    }
  }
}
```

#### Endpoint: GET /api/v1/ensayos
```json
{
  "get": {
    "summary": "Listar todos los ensayos (paginado y filtrado)",
    "parameters": [
      { "name": "page", "in": "query", "type": "number" },
      { "name": "limit", "in": "query", "type": "number" },
      { "name": "sort", "in": "query", "type": "string" },
      { "name": "order", "in": "query", "type": "string", "enum": ["ASC", "DESC"] },
      { "name": "q", "in": "query", "type": "string", "description": "Búsqueda general" },
      { "name": "laboratorio", "in": "query", "type": "string" },
      { "name": "variedad", "in": "query", "type": "string" },
      { "name": "fechaSiembraStart", "in": "query", "type": "string", "format": "date" },
      { "name": "fechaSiembraEnd", "in": "query", "type": "string", "format": "date" }
    ]
  }
}
```

---

## 🔄 Sincronización Backend-Frontend

### DTOs en Backend → API Contracts
Los DTOs definen exactamente qué campos acepta la API:
- `CreateEnsayoDto` - POST /ensayos
- `UpdateEnsayoDto` - PATCH /ensayos/:id

### Swagger Documentation
Generada automáticamente desde:
- `@ApiProperty()` decorators
- `@ApiPropertyOptional()` decorators
- `@ApiBody()` con ejemplos
- `@ApiQuery()` parameters

### Postman Collection
Puede ser generado desde OpenAPI:
```bash
node scripts/openapi-to-postman.js
```

---

## ✅ Verificación de Campos de Fecha

### En Backend
```typescript
// DTOs
@IsDateString()
fechaInicio?: string | null;      // ISO format YYYY-MM-DD
@IsDateString()
fechaSiembra?: string | null;
@IsDateString()
fechaCosecha?: string | null;

// Service (filtering)
if (query.fechaSiembraStart) {
  qb.andWhere('DATE(e.fechaSiembra) >= :fechaSiembraStart', { ... });
}
```

### En Frontend
```typescript
// Input HTML
<input v-model="dateStart" type="date" />     // Devuelve YYYY-MM-DD

// Display (formatDate)
const formatDate = (date: string): string => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;  // Muestra DD/MM/YYYY
}
```

### En Base de Datos
```sql
CREATE TABLE Ensayo (
  fecha_inicio DATE,
  fecha_siembra DATE,
  fecha_cosecha DATE
);

-- Filtrando
SELECT * FROM Ensayo
WHERE DATE(fecha_siembra) >= '2024-08-15'
  AND DATE(fecha_siembra) <= '2024-12-31';
```

---

## 📊 Resumen de Sincronización

| Componente | Formato | Descripción |
|-----------|---------|------------|
| Base de Datos | DATE | Almacena fecha sin hora |
| Backend DTO | string (ISO) | YYYY-MM-DD |
| API Request | string (ISO) | YYYY-MM-DD |
| Frontend Input | string (ISO) | YYYY-MM-DD |
| Frontend Display | string | DD/MM/YYYY |
| Filtro Backend | DATE comparison | Usa DATE() function |

---

## 🚀 Estado Actual

✅ Backend completamente documentado en código  
✅ DTOs incluyen todos los ejemplos  
✅ Campos de fecha correctamente tipados  
✅ Scripts de generación disponibles  
✅ Swagger UI disponible en runtime  
✅ Frontend sincronizado con backend  

**No requiere cambios** - Todo está correcto y actualizado.


