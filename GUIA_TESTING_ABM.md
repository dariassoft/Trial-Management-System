# 🧪 GUÍA DE TESTING RÁPIDO - ABM IMPLEMENTADOS

**Última actualización:** 11/02/2026

---

## 🚀 INICIO RÁPIDO

### 1. Asegurar que todo está compilado

```bash
# Backend
cd tms-backend
npm run build

# Frontend  
cd tms-client-vue
npm install
npm run build
```

### 2. Verificar endpoints con Swagger

```bash
# Generar Swagger
cd tms-backend
npm run openapi:gen

# Acceder a Swagger UI
http://localhost:3000/api/docs
```

---

## 🧪 TESTING BACKEND

### ROLES Endpoints

#### Crear Rol
```bash
curl -X POST http://localhost:3000/api/v1/roles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Administrador",
    "descripcion": "Acceso administrativo completo"
  }'
```

**Respuesta esperada (201):**
```json
{
  "id": 1,
  "nombre": "Administrador",
  "descripcion": "Acceso administrativo completo"
}
```

#### Listar Roles con Búsqueda
```bash
curl -X GET "http://localhost:3000/api/v1/roles?page=1&limit=10&q=admin&sort=nombre&order=ASC" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta esperada (200):**
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Administrador",
      "descripcion": "Acceso administrativo completo",
      "usuariosCount": 2
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pageCount": 1
  }
}
```

#### Obtener Rol por ID
```bash
curl -X GET http://localhost:3000/api/v1/roles/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Actualizar Rol
```bash
curl -X PATCH http://localhost:3000/api/v1/roles/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Descripción actualizada"
  }'
```

#### Eliminar Rol (sin usuarios asignados)
```bash
curl -X DELETE http://localhost:3000/api/v1/roles/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta esperada (200):**
```json
{
  "deleted": true
}
```

---

### USUARIOS Endpoints (Mejorados)

#### Crear Usuario con Laboratorios
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan@example.com",
    "password": "S3gura123",
    "rolId": 2,
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "3875789133",
    "fecha_nacimiento": "1990-05-21",
    "esta_activo": true,
    "laboratorioIds": [1, 2]
  }'
```

#### Listar Usuarios con Búsqueda
```bash
curl -X GET "http://localhost:3000/api/v1/users?page=1&limit=10&q=juan&sort=username&order=ASC" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Asignar Laboratorios a Usuario
```bash
curl -X POST http://localhost:3000/api/v1/users/5/laboratorios \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "laboratorioIds": [1, 2, 3]
  }'
```

#### Quitar Laboratorio del Usuario
```bash
curl -X DELETE http://localhost:3000/api/v1/users/5/laboratorios/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### LABORATORIOS Endpoints (Mejorados)

#### Crear Laboratorio
```bash
curl -X POST http://localhost:3000/api/v1/laboratorios \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Lab Central",
    "descripcion": "Laboratorio principal de análisis",
    "direccion": "Calle Principal 123, Ciudad",
    "telefono": "3875000000",
    "email": "lab@example.com",
    "contacto": "Ing. García",
    "esta_activo": true
  }'
```

#### Listar Laboratorios (con filtro activo)
```bash
curl -X GET "http://localhost:3000/api/v1/laboratorios?page=1&limit=10&activo=true&sort=nombre" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Actualizar Laboratorio
```bash
curl -X PATCH http://localhost:3000/api/v1/laboratorios/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "telefono": "3875111111",
    "esta_activo": false
  }'
```

---

## 🎨 TESTING FRONTEND

### 1. Autenticación
1. Ir a `http://localhost:3000`
2. Login con credenciales admin
3. Verificar token en localStorage: `open DevTools > Application > localStorage`

### 2. ABM Roles
**URL:** `/admin/roles`

#### Test Crear
1. Click "Nuevo Rol"
2. Seleccionar "Administrador" en dropdown
3. Agregar descripción: "Test rol"
4. Click Crear
5. ✅ Debe aparecer en la lista

#### Test Buscar
1. En campo Buscar, escribir: "admin"
2. Click "Aplicar"
3. ✅ Debe filtrar resultados

#### Test Editar
1. Click "Editar" en cualquier rol
2. Cambiar descripción
3. Click Actualizar
4. ✅ Cambios deben reflejarse

#### Test Eliminar
1. Click "Eliminar" en un rol sin usuarios
2. Confirmar en modal
3. ✅ Debe desaparecer de la lista
4. Nota: Los roles con usuarios no se pueden eliminar

#### Test Paginación
1. Si hay más de 10 roles, hacer click en página 2
2. ✅ Debe cambiar el listado

### 3. ABM Usuarios
**URL:** `/admin/usuarios`

#### Test Crear
1. Click "Nuevo Usuario"
2. Llenar:
   - Email: `test@example.com`
   - Nombre: `Test`
   - Apellido: `User`
   - Teléfono: `3875000000`
   - Rol: `Administrador`
   - Laboratorios: seleccionar algunos
3. Click Crear
4. ✅ Debe aparecer en la lista

#### Test Asignar Laboratorios
1. En la lista, hacer click "Editar" en un usuario
2. En sección "Laboratorios Asignados", seleccionar/desseleccionar
3. Click Actualizar
4. ✅ Los laboratorios deben cambiar

#### Test Filtros
1. Escribir en "Buscar": parte del email o nombre
2. Click "Aplicar"
3. ✅ Debe filtrar correctamente

### 4. ABM Laboratorios
**URL:** `/admin/laboratorios`

#### Test Crear
1. Click "Nuevo Laboratorio"
2. Llenar todos los campos (solo nombre es requerido)
3. Click Crear
4. ✅ Debe aparecer en tarjeta

#### Test Editar
1. Click "Editar"
2. Cambiar teléfono o email
3. Click Actualizar
4. ✅ Cambios visibles en tarjeta

#### Test Filtro Activo
1. Desactivar un laboratorio (en edit)
2. Volver a lista
3. ✅ Debe seguir visible (mostrar como inactivo)

### 5. Menú de Navegación
**Verificar visibilidad:**

| Usuario | Ve Roles | Ve Usuarios | Ve Laboratorios |
|---------|:--------:|:-----------:|:---------------:|
| SuperAdmin | ✅ | ✅ | ✅ |
| Admin | ❌ | ✅ | ✅ |
| Manager | ❌ | ❌ | ✅ |
| Invitado | ❌ | ❌ | ✅* |

*Invitado solo ve laboratorios asignados

---

## ✅ CHECKLIST COMPLETO

### Backend
- [ ] POST /roles - Crear nuevo rol
- [ ] GET /roles - Listar con búsqueda
- [ ] GET /roles/:id - Obtener por ID
- [ ] PATCH /roles/:id - Actualizar
- [ ] DELETE /roles/:id - Eliminar (sin usuarios)
- [ ] GET /users - Búsqueda mejorada
- [ ] POST /users - Con laboratorios
- [ ] POST /users/:id/laboratorios - Asignar labs
- [ ] GET /laboratorios - Con filtro activo
- [ ] POST /laboratorios - Con campos extendidos
- [ ] PATCH /laboratorios/:id - Actualizar
- [ ] DELETE /laboratorios/:id - Eliminar

### Frontend Roles
- [ ] Página carga correctamente
- [ ] Crear nuevo rol funciona
- [ ] Buscar filtra correctamente
- [ ] Editar rol actualiza
- [ ] Eliminar rol (sin usuarios) funciona
- [ ] Paginación funciona
- [ ] Botones deshabilitados cuando corresponde
- [ ] Error handling funciona
- [ ] Responsive en mobile

### Frontend Usuarios
- [ ] Página carga correctamente
- [ ] Crear usuario con laboratorios funciona
- [ ] Búsqueda filtra por email/nombre
- [ ] Editar usuario actualiza
- [ ] Asignar/quitar laboratorios funciona
- [ ] Eliminar usuario funciona
- [ ] Tabla desktop vs tarjetas mobile
- [ ] Mensajes de error claros

### Frontend Laboratorios
- [ ] Página carga correctamente
- [ ] Crear laboratorio con todos los campos
- [ ] Búsqueda por nombre/email/contacto
- [ ] Editar laboratorio actualiza
- [ ] Eliminar laboratorio (sin usuarios)
- [ ] Filtro activo funciona
- [ ] Tarjetas muestran información correcta
- [ ] Dark mode funciona

### Integración
- [ ] Menú de navegación actualizado
- [ ] Links funcionan correctamente
- [ ] Visibilidad por rol funciona
- [ ] Auth middleware protege páginas
- [ ] Tokens se envían correctamente
- [ ] 401 redirige a login

---

## 🐛 TROUBLESHOOTING

### Error 401 Unauthorized
- Verificar que token es válido
- Verificar header: `Authorization: Bearer TOKEN`
- Hacer login nuevamente

### Error 403 Forbidden
- Verificar rol del usuario
- ROLES: solo ADMIN y SUPERADMIN
- USUARIOS: solo ADMIN y SUPERADMIN
- LABORATORIOS: ADMIN, MANAGER, SUPERADMIN

### Error 400 Bad Request
- Verificar DTOs (campos requeridos)
- Verificar validaciones (email, length, etc)
- Ver mensaje de error en respuesta

### Error 404 Not Found
- Verificar ID existe en BD
- Verificar URL correcta
- Chequear logs del backend

### Frontend no conecta con backend
- Verificar CORS en main.ts
- Verificar API_BASE en .env
- Verificar que backend está ejecutándose

---

## 📊 DATOS DE PRUEBA

### Usuarios
```
email: admin@example.com
password: Admin123!

email: manager@example.com
password: Manager123!

email: tecnico@example.com
password: Tecnico123!
```

### Roles
- Superadministrador (ID: 1)
- Administrador (ID: 2)
- Manager (ID: 3)
- Técnico (ID: 4)
- Invitado (ID: 5)

### Laboratorios
Crear en el frontend:
- Lab Central
- Lab Secundario
- Lab Análisis

---

## 📈 MÉTRICAS A VERIFICAR

- **Rendimiento:** GET /roles debe responder en <500ms
- **Paginación:** Máximo 100 registros por request
- **Búsqueda:** Case-insensitive, parcial
- **Validación:** Email válido, teléfono formato
- **Integridad:** No permitir eliminar si tiene relaciones

---

**Última actualización:** 11/02/2026  
**Versión:** 1.0  
**Status:** LISTO PARA TESTING

