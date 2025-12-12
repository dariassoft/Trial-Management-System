# 📚 DOCUMENTACIÓN API ENSAYOS - ACTUALIZADA

**Fecha**: 10 de Diciembre, 2025  
**Versión**: 2.0 (Con columna status)  
**Status**: ✅ Actualizado

---

## 🔗 ENDPOINTS ENSAYOS

### Base URL
```
http://localhost:3000/api/v1/ensayos
```

### 1. LISTAR ENSAYOS
```
GET /api/v1/ensayos
```

**Parámetros Query**:
- `limit` (integer, default: 10) - Cantidad de registros
- `page` (integer, default: 1) - Número de página

**Respuesta**: 200 OK
```json
{
  "data": [
    {
      "ensayo_id": 1,
      "nombre_ensayo": "Ensayo Soja Temprana 2024",
      "responsable": "Juan García",
      "cultivo_especie": "Soja",
      "cultivo_variedad": "Asgrow MG4.2",
      "fecha_siembra": "2024-11-01",
      "status": "En Ejecución",
      "provincia": "Córdoba",
      "departamento": "Río Cuarto"
    }
  ],
  "total": 10,
  "limit": 10,
  "page": 1
}
```

**Headers Requeridos**:
```
Authorization: Bearer {token}
```

---

### 2. VER DETALLE DE ENSAYO
```
GET /api/v1/ensayos/{id}
```

**Parámetros Path**:
- `id` (integer, **REQUERIDO**) - ID del ensayo (ensayo_id)

**Ejemplo**:
```
GET /api/v1/ensayos/1
```

**Respuesta**: 200 OK
```json
{
  "data": {
    "ensayo_id": 1,
    "nombre_ensayo": "Ensayo Soja Temprana 2024",
    "version_protocolo": "v1.0",
    "responsable": "Juan García",
    "provincia": "Córdoba",
    "departamento": "Río Cuarto",
    "establecimiento": "La Estancia",
    "lote": "Lote A",
    "latitud": -38.7465,
    "longitud": -64.2419,
    "cultivo_especie": "Soja",
    "cultivo_variedad": "Asgrow MG4.2",
    "tipo_siembra": "Directa",
    "dist_surcos_cm": 52,
    "fecha_siembra": "2024-11-01",
    "status": "En Ejecución",
    "lab_id_fk": 1
  }
}
```

**Errores**:
- 400: Bad Request (ID inválido)
- 401: Unauthorized (Token inválido)
- 404: Not Found (Ensayo no existe)

**Headers Requeridos**:
```
Authorization: Bearer {token}
```

---

### 3. CREAR ENSAYO
```
POST /api/v1/ensayos
```

**Body (JSON)**:
```json
{
  "nombreEnsayo": "Ensayo Maíz 2025",
  "versionProtocolo": "v1.0",
  "responsable": "María López",
  "provincia": "Córdoba",
  "departamento": "Río Cuarto",
  "establecimiento": "San Juan",
  "lote": "Lote B",
  "latitud": -38.7500,
  "longitud": -64.2400,
  "cultivoEspecie": "Maíz",
  "cultivoVariedad": "DK 7710",
  "tipoSiembra": "Mecánica",
  "distSurcosCm": 75,
  "fechaSiembra": "2024-10-15"
}
```

**Respuesta**: 201 Created
```json
{
  "data": {
    "ensayo_id": 11,
    "nombre_ensayo": "Ensayo Maíz 2025",
    "status": "Activo"
  }
}
```

**Headers Requeridos**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

### 4. EDITAR ENSAYO
```
PATCH /api/v1/ensayos/{id}
```

**Parámetros Path**:
- `id` (integer, **REQUERIDO**) - ID del ensayo

**Ejemplo**:
```
PATCH /api/v1/ensayos/1
```

**Body (JSON)** - Solo campos a actualizar:
```json
{
  "responsable": "Juan García Updated",
  "status": "Completado",
  "fechaSiembra": "2024-11-05"
}
```

**Respuesta**: 200 OK
```json
{
  "data": {
    "ensayo_id": 1,
    "nombre_ensayo": "Ensayo Soja Temprana 2024",
    "responsable": "Juan García Updated",
    "status": "Completado",
    "fechaSiembra": "2024-11-05"
  }
}
```

**Errores**:
- 400: Bad Request (ID inválido)
- 404: Not Found (Ensayo no existe)

**Headers Requeridos**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

### 5. ELIMINAR ENSAYO
```
DELETE /api/v1/ensayos/{id}
```

**Parámetros Path**:
- `id` (integer, **REQUERIDO**) - ID del ensayo

**Ejemplo**:
```
DELETE /api/v1/ensayos/1
```

**Respuesta**: 200 OK
```json
{
  "deleted": true,
  "id": 1
}
```

**Errores**:
- 400: Bad Request (ID inválido)
- 404: Not Found (Ensayo no existe)

**Headers Requeridos**:
```
Authorization: Bearer {token}
```

---

## 📊 CAMPOS TABLA ENSAYO

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `ensayo_id` | INT | ✅ | ID único (Primary Key, auto-increment) |
| `nombre_ensayo` | VARCHAR(255) | ✅ | Nombre descriptivo del ensayo |
| `version_protocolo` | VARCHAR(20) | ✅ | Versión del protocolo (ej: v1.0) |
| `responsable` | VARCHAR(100) | ❌ | Persona responsable |
| `provincia` | VARCHAR(100) | ✅ | Provincia de ubicación |
| `departamento` | VARCHAR(100) | ✅ | Departamento de ubicación |
| `establecimiento` | VARCHAR(100) | ❌ | Nombre del establecimiento |
| `lote` | VARCHAR(50) | ❌ | Identificación del lote |
| `latitud` | DECIMAL(10,8) | ❌ | Coordenada de latitud |
| `longitud` | DECIMAL(11,8) | ❌ | Coordenada de longitud |
| `cultivo_especie` | VARCHAR(100) | ✅ | Tipo de cultivo (Soja, Maíz, etc) |
| `cultivo_variedad` | VARCHAR(100) | ✅ | Variedad específica |
| `tipo_siembra` | VARCHAR(50) | ❌ | Tipo (Directa, Mecánica, Manual) |
| `dist_surcos_cm` | DECIMAL(5,2) | ❌ | Distancia entre surcos en cm |
| `fecha_siembra` | DATE | ✅ | Fecha de siembra |
| `status` | VARCHAR(50) | ❌ | Estado (En Ejecución, Completado, Por Iniciar) |
| `lab_id_fk` | INT | ✅ | Foreign Key a Laboratorio |
| `created_at` | TIMESTAMP | ✅ | Fecha de creación |
| `updated_at` | TIMESTAMP | ✅ | Fecha de actualización |

---

## 🔐 AUTENTICACIÓN

### Token JWT
Todos los endpoints requieren un token Bearer válido.

**Obtener Token**:
```
POST /api/v1/auth/login
```

**Body**:
```json
{
  "email": "dariassoft@gmail.com",
  "password": "123456"
}
```

**Respuesta**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

---

## 🧪 EJEMPLOS CON CURL

### Listar Ensayos
```bash
curl -X GET "http://localhost:3000/api/v1/ensayos?limit=10&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Ver Detalles
```bash
curl -X GET "http://localhost:3000/api/v1/ensayos/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Crear Ensayo
```bash
curl -X POST "http://localhost:3000/api/v1/ensayos" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreEnsayo": "Nuevo Ensayo",
    "versionProtocolo": "v1.0",
    "provincia": "Córdoba",
    "departamento": "Río Cuarto",
    "cultivoEspecie": "Soja",
    "cultivoVariedad": "Asgrow",
    "fechaSiembra": "2024-11-01"
  }'
```

### Editar Ensayo
```bash
curl -X PATCH "http://localhost:3000/api/v1/ensayos/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "responsable": "Nuevo Responsable",
    "status": "Completado"
  }'
```

### Eliminar Ensayo
```bash
curl -X DELETE "http://localhost:3000/api/v1/ensayos/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 CÓDIGOS DE RESPUESTA

| Código | Significado | Descripción |
|--------|-------------|-------------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Solicitud inválida (datos incompletos o ID inválido) |
| 401 | Unauthorized | Token no autenticado o expirado |
| 403 | Forbidden | Usuario sin permisos |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

---

## 🎯 ROLES PERMITIDOS

- ✅ TECNICO - Puede crear, leer, actualizar y eliminar
- ✅ ADMIN - Puede crear, leer, actualizar y eliminar
- ✅ SUPERADMIN - Acceso total

---

## 📌 NOTAS IMPORTANTES

1. **ID Parámetro**: El `id` en las rutas debe ser el valor de `ensayo_id` de la BD
2. **Status Campo**: Nuevo campo agregado (En Ejecución, Completado, Por Iniciar)
3. **Validación**: Se valida que campos requeridos no sean nulos
4. **Paginación**: Por defecto devuelve 10 registros por página
5. **Token**: Válido por 1 hora (3600 segundos)

---

**✅ Documentación Actualizada: 10 de Diciembre, 2025**

