# Análisis Completo de la API TMS Backend

## 1. Resumen Ejecutivo

**Trial Management System (TMS)** es un sistema REST API desarrollado con **NestJS 11.x**, **TypeScript 5.x** y **MySQL** mediante **TypeORM**. 

La API está diseñada para gestionar **ensayos agronómicos** (pruebas de campo para cultivos) con un enfoque modular, escalable y bien documentado.

---

## 2. Tecnologías Utilizadas

### Backend Stack
- **Framework**: NestJS 11.x
- **Lenguaje**: TypeScript 5.x
- **Base de Datos**: MySQL (via TypeORM 0.3.x)
- **Autenticación**: JWT (PassportJS + @nestjs/jwt)
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI (swagger-ui-express)
- **Seguridad**: bcrypt para hash de contraseñas

### Infraestructura
- **Docker**: Containerización (Dockerfile + docker-compose.yml)
- **Variables de Entorno**: @nestjs/config
- **Servidor**: Express.js (via NestJS)

---

## 3. Estructura Modular

### Módulos Principales

#### 3.1 **Autenticación (auth/)**
- **Endpoints**:
  - `POST /api/v1/auth/login` - Iniciar sesión
  - `POST /api/v1/auth/bootstrap-hash` - Hashear contraseña (bootstrap)
- **Características**:
  - JWT Bearer Token
  - Guards: JwtAuthGuard, RolesGuard
  - Decorador @Public() para rutas públicas
  - Validación de credenciales

#### 3.2 **Usuarios (users/)**
- Gestión de usuarios del sistema
- Asignación de roles y laboratorios
- CRUD completo con paginación

#### 3.3 **Ensayos (ensayos/)**
- Gestión de ensayos agronómicos
- Endpoints CRUD con búsqueda y filtrado
- `GET /api/v1/ensayos` - Listar (paginado)
- `POST /api/v1/ensayos` - Crear ensayo

#### 3.4 **Catalogos (catalogos/)**
- `cultivos/` - Especies de cultivo
- `cultivo-variedades/` - Variedades específicas
- `tipos-ensayo/` - Tipos de ensayos

#### 3.5 **Otros Módulos Especializados**
- **laboratorios/** - Gestión de laboratorios (empresas)
- **productos/** - Químicos, biológicos
- **tratamientos/** - Tratamientos experimentales
- **bloques/** - Bloques del ensayo
- **parcelas/** - Unidades experimentales
- **aplicaciones/** - Eventos de aplicación de productos
- **momentos/** - Momentos de evaluación (3DDA, 7DDA, etc.)
- **datos-campo/** - Mediciones de campo
- **datos-cosecha/** - Datos de cosecha
- **fotos/** - Gestión de imágenes
- **protocolo-variables/** - Variables medidas

---

## 4. Modelo de Datos

### Entidades Principales

#### **Usuario (Usuario)**
```
usuario_id (PK)
username (email, único)
password_hash (bcrypt)
nombre, apellido, teléfono
fecha_nacimiento
esta_activo
rol_id_fk (FK -> Rol)
```

#### **Rol (Rol)**
- Superadministrador
- Administrador
- Manager
- Técnico
- Invitado

#### **Ensayo (Ensayo)**
```
ensayo_id (PK)
nombre_ensayo, version_protocolo
responsable
ubicación: provincia, departamento, establecimiento, lote, latitud, longitud
cultivo: especie, variedad, tipo_siembra, dist_surcos_cm, fecha_siembra
```

#### **Estructura de Diseño Experimental**
```
Ensayo 1:N Bloque 1:N Parcela
Ensayo 1:N Tratamiento
Tratamiento M:N Producto (via Tratamiento_Producto)
Parcela 1:N Datos_Campo
Datos_Campo 1:N Datos_Campo_Medicion
```

#### **Aplicaciones y Evaluaciones**
```
Ensayo 1:N Aplicacion
Aplicacion 1:N Momento_Evaluacion
Momento_Evaluacion 1:N Datos_Campo_Medicion
```

#### **Cosecha**
```
Parcela 1:1 Datos_Cosecha (fecha, humedad%, kg/ha, observaciones)
```

---

## 5. Autenticación y Autorización

### Flujo de Autenticación

1. **Login**: `POST /auth/login` con credenciales
   ```json
   {
     "username": "usuario@email.com",
     "password": "password"
   }
   ```

2. **Respuesta**: JWT Token + Información del usuario
   ```json
   {
     "accessToken": "eyJhbGc...",
     "user": { ... }
   }
   ```

3. **Uso**: Header: `Authorization: Bearer <token>`

### Roles y Permisos

| Rol | Permisos |
|-----|----------|
| Superadministrador | Acceso total |
| Administrador | Gestiona usuarios y roles |
| Manager | Crea laboratorios/productos, ve ensayos |
| Técnico | Carga datos de campo |
| Invitado | Lectura de laboratorios/ensayos asignados |

---

## 6. Configuración Global

### CORS
- Habilitado: `app.enableCors()`
- Origen: Por defecto, todos los orígenes

### Validación
```typescript
new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
})
```

### Prefijo API
- `api/v1` - Todos los endpoints

---

## 7. Documentación Swagger

- **Disponible en**: `http://localhost:3000/docs`
- **Autenticación**: BearerAuth (JWT)
- **Esquemas**: Todos los DTOs documentados
- **Ejemplos**: Ejemplos de request/response

---

## 8. Variables de Entorno

```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=nest_db
TYPEORM_SYNCHRONIZE=true
DOCKERIZED=true (en Docker)
GENERATE_OPENAPI=true (para generar OpenAPI sin DB)
```

---

## 9. Endpoints Disponibles

### Autenticación
- `POST /api/v1/auth/login` - Login

### Usuarios
- `GET /api/v1/users` - Listar
- `POST /api/v1/users` - Crear
- `GET /api/v1/users/{id}` - Obtener
- `PATCH /api/v1/users/{id}` - Actualizar
- `DELETE /api/v1/users/{id}` - Eliminar

### Ensayos
- `GET /api/v1/ensayos` - Listar (filtrado, paginado)
- `POST /api/v1/ensayos` - Crear
- `GET /api/v1/ensayos/{id}` - Obtener
- `PATCH /api/v1/ensayos/{id}` - Actualizar
- `DELETE /api/v1/ensayos/{id}` - Eliminar

### Laboratorios
- Endpoints CRUD estándar

### Productos
- Endpoints CRUD estándar

### (Otros módulos similares)

---

## 10. Flujo de Uso Típico

1. **Login**: Obtener JWT token
2. **Crear Ensayo**: POST con datos del ensayo
3. **Crear Bloques**: Asociar a ensayo
4. **Crear Tratamientos**: Asociar productos
5. **Crear Parcelas**: Combinar Bloque + Tratamiento
6. **Registrar Aplicaciones**: Eventos de aplicación
7. **Crear Momentos de Evaluación**: 3DDA, 7DDA, etc.
8. **Cargar Datos de Campo**: Mediciones en cada parcela
9. **Registrar Cosecha**: Datos finales de rendimiento

---

## 11. Notas de Implementación

- **Idempotencia**: Seeds usan `INSERT ... SELECT ... WHERE NOT EXISTS`
- **Transacciones**: QueryRunner para operaciones multi-tabla
- **Paginación**: Skip/Take con meta (total, page, limit, pageCount)
- **Búsqueda**: LIKE en múltiples campos (ILIKE en PostgreSQL)
- **Multer**: Soporte para carga de imágenes en fotos/
- **ServeStatic**: Servir archivos desde `/uploads` en ruta `/uploads`

---

## 12. Consideraciones para el Frontend

### CORS
- API habilita CORS globalmente
- Frontend puede hacer requests directamente

### Autenticación
- Guardar JWT en localStorage/sessionStorage
- Incluir en header `Authorization: Bearer <token>`
- Manejar expiración y refresh (no implementado en v1)

### Paginación
- Parámetros: `page`, `limit`, `sort`, `order`
- Respuesta: estructura `{ data: [], meta: {...} }`

### Búsqueda
- Parámetro `q` en endpoints que lo soportan
- Búsqueda por múltiples campos

### Manejo de Errores
- Status HTTP: 400, 401, 403, 404, 500
- Body: `{ message: "...", statusCode: ... }`


