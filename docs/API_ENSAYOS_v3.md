# 📚 DOCUMENTACIÓN API ENSAYOS - ACTUALIZADA CON STATUS

**Fecha**: 10 de Diciembre, 2025  
**Versión**: 3.0  
**Status**: ✅ Actualizado con campo status

---

## 🔗 ENDPOINTS ENSAYOS ACTUALIZADOS

### Base URL
```
http://localhost:3000/api/v1/ensayos
```

---

## 1. LISTAR ENSAYOS (GET)
```
GET /api/v1/ensayos?page=1&limit=10
```

**Parámetros Query**:
- `page` (integer, default: 1) - Página
- `limit` (integer, default: 10) - Registros por página
- `sort` (string) - Campo para ordenar
- `order` (string) - ASC o DESC
- `q` (string) - Búsqueda por texto

**Respuesta**: 200 OK
```json
{
  "data": [
    {
      "id": 1,
      "nombreEnsayo": "Ensayo Soja Temprana 2024",
      "responsable": "Juan García",
      "cultivoEspecie": "Soja",
      "status": "En Ejecución",
      "fechaSiembra": "2024-11-01"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

**Headers**: `Authorization: Bearer {token}`

---

## 2. VER DETALLE DE ENSAYO (GET)
```
GET /api/v1/ensayos/{id}
```

**Parámetros Path**:
- `id` (integer, **REQUERIDO**) - ID del ensayo

**Ejemplo**: `GET /api/v1/ensayos/1`

**Respuesta**: 200 OK
```json
{
  "data": {
    "id": 1,
    "nombreEnsayo": "Ensayo Soja Temprana 2024",
    "versionProtocolo": "v1.0",
    "responsable": "Juan García",
    "provincia": "Córdoba",
    "departamento": "Río Cuarto",
    "cultivoEspecie": "Soja",
    "cultivoVariedad": "Asgrow MG4.2",
    "fecha Siembra": "2024-11-01",
    "status": "En Ejecución"
  }
}
```

**Headers**: `Authorization: Bearer {token}`

---

## 3. CREAR ENSAYO (POST)
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
  "cultivoEspecie": "Maíz",
  "cultivoVariedad": "DK 7710",
  "fechaSiembra": "2024-10-15",
  "status": "Activo"
}
```

**Valores válidos para status**:
- `Activo` - Por defecto, ensayo en estado normal
- `En Ejecución` - Ensayo actualmente en ejecución
- `Completado` - Ensayo finalizado
- `Por Iniciar` - Ensayo planificado pero no iniciado
- `Pausado` - Ensayo pausado temporalmente
- `Cancelado` - Ensayo cancelado

**Respuesta**: 201 Created
```json
{
  "data": {
    "id": 11,
    "nombreEnsayo": "Ensayo Maíz 2025",
    "status": "Activo"
  }
}
```

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## 4. EDITAR ENSAYO (PATCH)
```
PATCH /api/v1/ensayos/{id}
```

**Parámetros Path**:
- `id` (integer, **REQUERIDO**) - ID del ensayo

**Ejemplo**: `PATCH /api/v1/ensayos/1`

**Body (JSON)** - Solo campos a actualizar:
```json
{
  "responsable": "Juan García Updated",
  "status": "Completado"
}
```

**Respuesta**: 200 OK
```json
{
  "data": {
    "id": 1,
    "nombreEnsayo": "Ensayo Soja Temprana 2024",
    "responsable": "Juan García Updated",
    "status": "Completado"
  }
}
```

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## 5. ELIMINAR ENSAYO (DELETE)
```
DELETE /api/v1/ensayos/{id}
```

**Parámetros Path**:
- `id` (integer, **REQUERIDO**) - ID del ensayo

**Ejemplo**: `DELETE /api/v1/ensayos/1`

**Respuesta**: 200 OK
```json
{
  "deleted": true,
  "id": 1
}
```

**Headers**: `Authorization: Bearer {token}`

---

## 📊 CAMPOS DE TABLA ENSAYO

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | INT | ✅ | ID único (PK, auto-increment) |
| `nombreEnsayo` | VARCHAR(255) | ✅ | Nombre descriptivo |
| `versionProtocolo` | VARCHAR(20) | ❌ | Versión protocolo |
| `responsable` | VARCHAR(100) | ❌ | Responsable |
| `provincia` | VARCHAR(100) | ✅ | Provincia |
| `departamento` | VARCHAR(100) | ✅ | Departamento |
| `establecimiento` | VARCHAR(100) | ❌ | Establecimiento |
| `cultivoEspecie` | VARCHAR(100) | ✅ | Especie cultivo |
| `cultivoVariedad` | VARCHAR(100) | ✅ | Variedad |
| `fechaSiembra` | DATE | ❌ | Fecha siembra |
| **`status`** | **VARCHAR(50)** | **❌** | **Estado (Activo, En Ejecución, Completado, etc)** |
| `labIdFk` | INT | ✅ | FK a Laboratorio |

---

## 🧪 EJEMPLOS CON CURL

### Listar
```bash
curl -X GET "http://localhost:3000/api/v1/ensayos?limit=10&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Ver Detalle
```bash
curl -X GET "http://localhost:3000/api/v1/ensayos/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Crear
```bash
curl -X POST "http://localhost:3000/api/v1/ensayos" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreEnsayo": "Nuevo Ensayo",
    "provincia": "Córdoba",
    "departamento": "Río Cuarto",
    "cultivoEspecie": "Soja",
    "cultivoVariedad": "Asgrow",
    "fechaSiembra": "2024-11-01",
    "status": "Por Iniciar"
  }'
```

### Editar
```bash
curl -X PATCH "http://localhost:3000/api/v1/ensayos/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Completado"
  }'
```

### Eliminar
```bash
curl -X DELETE "http://localhost:3000/api/v1/ensayos/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 CÓDIGOS DE RESPUESTA

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Error |

---

## 🔐 AUTENTICACIÓN

Obtener token:
```
POST /api/v1/auth/login
Body: { "email": "dariassoft@gmail.com", "password": "123456" }
```

---

**✅ Documentación Actualizada: 10 de Diciembre, 2025**

