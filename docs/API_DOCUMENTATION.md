# 📚 Documentación de API - TMS

**Trial Management System - API REST completa con autenticación JWT**

---

## 🌐 URLs Disponibles

| Servicio | URL | Estado |
|----------|-----|--------|
| **API REST** | http://localhost:3000/api/v1 | ✅ Operativo |
| **Swagger UI** | http://localhost:3000/docs | ✅ Disponible |
| **OpenAPI JSON** | http://localhost:3000/api/json | ✅ Disponible |
| **Frontend** | http://localhost:3001 | ✅ Operativo |

---

## 🔐 Autenticación

### JWT Bearer Token
Todos los endpoints (excepto login y bootstrap-hash) requieren:

```
Authorization: Bearer <jwt_token>
```

### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "dariassoft@gmail.com",
  "password": "123456"
}
```

**Respuesta exitosa (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "dariassoft@gmail.com",
    "nombre": "Dario",
    "apellido": "Assoft",
    "rol": {
      "id": 2,
      "nombre": "Superadministrador"
    },
    "laboratoriosAsignados": [...]
  }
}
```

---

## 📋 Endpoints Disponibles

### 🔒 Autenticación (`/auth`)
- `POST /auth/login` - Iniciar sesión
- `POST /auth/bootstrap-hash` - Hashear contraseña (admin)

### 📊 Ensayos (`/ensayos`)
- `POST /ensayos` - Crear ensayo
- `GET /ensayos` - Listar ensayos (con paginación)
- `GET /ensayos/:id` - Obtener ensayo
- `PATCH /ensayos/:id` - Actualizar ensayo
- `DELETE /ensayos/:id` - Eliminar ensayo
- `GET /ensayos/:id/aplicaciones` - Aplicaciones del ensayo
- `POST /ensayos/:id/aplicaciones` - Crear aplicación

### 👥 Usuarios (`/users`)
- `POST /users` - Crear usuario
- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario
- `POST /users/:id/laboratorios` - Asignar laboratorio
- `DELETE /users/:id/laboratorios/:labId` - Remover laboratorio

### 🏥 Laboratorios (`/laboratorios`)
- `POST /laboratorios` - Crear laboratorio
- `GET /laboratorios` - Listar laboratorios
- `GET /laboratorios/:id` - Obtener laboratorio
- `PATCH /laboratorios/:id` - Actualizar laboratorio
- `DELETE /laboratorios/:id` - Eliminar laboratorio

### 🧪 Productos (`/productos`)
- `POST /productos` - Crear producto
- `GET /productos` - Listar productos
- `GET /productos/:id` - Obtener producto
- `PATCH /productos/:id` - Actualizar producto
- `DELETE /productos/:id` - Eliminar producto

### 📦 Catálogos (`/catalogos`)

#### Cultivos
- `POST /catalogos/cultivos` - Crear cultivo
- `GET /catalogos/cultivos` - Listar cultivos
- `GET /catalogos/cultivos/:id` - Obtener cultivo
- `GET /catalogos/cultivos/:id/variedades` - Variedades
- `PATCH /catalogos/cultivos/:id` - Actualizar
- `DELETE /catalogos/cultivos/:id` - Eliminar

#### Variedades
- `POST /catalogos/cultivo-variedades` - Crear variedad
- `GET /catalogos/cultivo-variedades` - Listar variedades
- `GET /catalogos/cultivo-variedades/:id` - Obtener
- `PATCH /catalogos/cultivo-variedades/:id` - Actualizar
- `DELETE /catalogos/cultivo-variedades/:id` - Eliminar

#### Tipos de Ensayo
- `POST /catalogos/tipos-ensayo` - Crear tipo
- `GET /catalogos/tipos-ensayo` - Listar tipos
- `GET /catalogos/tipos-ensayo/:id` - Obtener
- `GET /catalogos/tipos-ensayo/:id/variables` - Variables
- `POST /catalogos/tipos-ensayo/:id/variables` - Agregar variable
- `GET /catalogos/tipos-ensayo/:id/dias` - Días evaluación
- `PUT /catalogos/tipos-ensayo/:id/evaluacion` - Actualizar días
- `PATCH /catalogos/tipos-ensayo/:id` - Actualizar
- `DELETE /catalogos/tipos-ensayo/:id` - Eliminar

### 📝 Variables (`/protocolo-variables`)
- `POST /protocolo-variables` - Crear variable
- `GET /protocolo-variables` - Listar variables
- `GET /protocolo-variables/:id` - Obtener variable
- `PATCH /protocolo-variables/:id` - Actualizar
- `DELETE /protocolo-variables/:id` - Eliminar

### 🧬 Tratamientos (`/tratamientos`)
- `POST /tratamientos` - Crear tratamiento
- `GET /tratamientos` - Listar tratamientos
- `GET /tratamientos/:id` - Obtener
- `PATCH /tratamientos/:id` - Actualizar
- `DELETE /tratamientos/:id` - Eliminar

### 🔗 Tratamientos-Producto (`/tratamientos-producto`)
- `POST /tratamientos-producto` - Crear vinculación
- `GET /tratamientos-producto` - Listar
- `GET /tratamientos-producto/:id` - Obtener
- `PATCH /tratamientos-producto/:id` - Actualizar
- `DELETE /tratamientos-producto/:id` - Eliminar

---

## 🔧 Importar en Postman

### Opción 1: Importar desde archivo
1. Abre Postman
2. Click en "Import"
3. Selecciona: `TMS_Postman_2025.postman_collection.json`
4. Selecciona environment: `TMS_Environment.postman_environment.json`

### Opción 2: Importar desde URL
```
http://localhost:3000/docs.json
```

### Configurar Variables
Después de importar, configura las variables en el environment:
- `base_url`: http://localhost:3000/api/v1
- `jwt_token`: Se llena automáticamente después de hacer login

---

## 📖 Swagger UI

Accede a la documentación interactiva en:
```
http://localhost:3000/docs
```

Desde ahí puedes:
- Ver todos los endpoints
- Leer descripciones detalladas
- Probar requests en tiempo real
- Ver modelos de datos

---

## 🧪 Ejemplo de Flow Completo

```bash
# 1. Login (obtener token)
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dariassoft@gmail.com",
    "password": "123456"
  }'

# Guardar el accessToken en variable TOKEN
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Listar cultivos
curl -X GET http://localhost:3000/api/v1/catalogos/cultivos \
  -H "Authorization: Bearer $TOKEN"

# 3. Crear ensayo
curl -X POST http://localhost:3000/api/v1/ensayos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreEnsayo": "Ensayo Test",
    "versionProtocolo": "v1",
    "responsable": "Usuario",
    "provincia": "Buenos Aires",
    "departamento": "Tres Arroyos",
    "establecimiento": "La Estancia",
    "lote": "Lote 1",
    "latitud": -38.373737,
    "longitud": -60.273737,
    "cultivoEspecie": "Soja",
    "cultivoVariedad": "Asgrow MG4.2",
    "tipoSiembra": "Siembra convencional",
    "distSurcosCm": 52.5,
    "fechaSiembra": "2025-11-27"
  }'
```

---

## ⚠️ Códigos de Error

| Código | Significado |
|--------|-------------|
| 200 | OK - Éxito |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido/expirado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Duplicado |
| 500 | Internal Server Error |

---

## 📊 Estructura de Datos

### Ensayo
```json
{
  "id": 1,
  "nombreEnsayo": "string",
  "versionProtocolo": "string",
  "responsable": "string",
  "provincia": "string",
  "departamento": "string",
  "establecimiento": "string",
  "lote": "string",
  "latitud": -38.373737,
  "longitud": -60.273737,
  "cultivoEspecie": "string",
  "cultivoVariedad": "string",
  "tipoSiembra": "string",
  "distSurcosCm": 17.5,
  "fechaSiembra": "2025-06-15",
  "createdAt": "2025-11-27T00:00:00Z",
  "updatedAt": "2025-11-27T00:00:00Z"
}
```

---

**API Version**: 1.0  
**OpenAPI**: 3.0.0  
**Last Updated**: 2025-11-27


