# 🚀 GUÍA RÁPIDA SESIÓN 3 - PROTOCOLOS Y TRATAMIENTOS

## ⚡ Inicio Rápido (5 minutos)

### 1. Iniciar Servicios Docker

**Backend + MySQL**:
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose up -d
```

**Frontend**:
```bash
docker-compose -f tms-client-vue/docker-compose.frontend.yml up -d
```

**Esperar 20 segundos y verificar**:
```bash
docker-compose ps
```

---

### 2. Aplicar Migration (Campo `estadio`)

**Opción A**: TypeORM ejecutará automáticamente en desarrollo
```bash
# No requiere acción manual
```

**Opción B**: Ejecutar SQL manualmente
```bash
docker-compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD tms_db < docs/12_add_estadio_tratamiento_producto.sql
```

---

### 3. Acceder a la Aplicación

**Frontend**:
```
http://localhost:3001
Usuario: tu_usuario
Contraseña: tu_contraseña
```

**Backend Swagger**:
```
http://localhost:3000/api/docs
```

---

## 📋 FLUJO DE PRUEBA

### 1. Navegar a Protocolos
```
Menú → "Protocolos" (📋 icono)
```

### 2. Ver Protocolo Existente
```
Click en tarjeta de protocolo
Click "Ver Detalles"
```

### 3. Crear Tratamiento
```
Click "+ Nuevo Tratamiento"
Llenar formulario:
  - Protocolo: Seleccionar
  - Número: Auto-incremento
  - Tipo: Testigo o Con Producto(s)
  - Descripción: Ingresar
Click "Crear"
```

### 4. Agregar Producto
```
En la sección "Productos del Tratamiento"
Click "+ Agregar Producto"
Seleccionar:
  - Producto: Select
  - Dosis: "800"
  - Unidad: "cc/ha"
  - Estadio: "V4" ← NUEVO CAMPO
Click "Guardar Producto"
```

### 5. Buscar y Filtrar
```
Dentro del protocolo:
- Buscar por descripción
- Filtrar por Tipo (Testigo/Con Producto)
- Click "Filtrar"
```

---

## 🔄 ENDPOINTS DE PRUEBA (Postman/curl)

### Listar Tratamientos
```bash
curl -X GET "http://localhost:3000/api/v1/tratamientos?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Crear Tratamiento
```bash
curl -X POST "http://localhost:3000/api/v1/tratamientos" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "protocoloId": 1,
    "numeroTrat": 2,
    "descripcion": "Fomesafen 25% - 800 cc/ha - V4",
    "esTestigo": false
  }'
```

### Agregar Producto a Tratamiento
```bash
curl -X POST "http://localhost:3000/api/v1/tratamientos-producto" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tratamientoId": 2,
    "productoId": 10,
    "dosis": "800",
    "unidadDosis": "cc/ha",
    "estadio": "V4"
  }'
```

### Actualizar Producto (Cambiar Estadio)
```bash
curl -X PATCH "http://localhost:3000/api/v1/tratamientos-producto/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dosis": "800",
    "unidadDosis": "cc/ha",
    "estadio": "V3"
  }'
```

---

## 🛠️ Solución de Problemas

### Frontend no carga
```bash
# Reiniciar frontend
docker-compose -f tms-client-vue/docker-compose.frontend.yml restart nuxt

# Ver logs
docker-compose -f tms-client-vue/docker-compose.frontend.yml logs -f nuxt
```

### Backend no compila
```bash
# Entrar al contenedor
docker-compose exec app bash

# Compilar
npm run build

# Si hay errores TypeScript, revisar archivos
npm run lint
```

### Error en base de datos
```bash
# Ver logs MySQL
docker-compose logs -f mysql

# Conectar a MySQL
docker-compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD tms_db

# Verificar tabla
DESCRIBE Tratamiento_Producto;
SHOW COLUMNS FROM Tratamiento_Producto;
```

### Limpiar todo y reiniciar
```bash
# Detener servicios
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache

# Iniciar nuevamente
docker-compose up -d
```

---

## 📂 ARCHIVOS IMPORTANTES

### Backend
```
src/
├── entities/tratamiento-producto.entity.ts ✨ (Modificado)
├── database/migrations/
│   └── 1765500000000-AddEstadioToTratamientoProducto.ts ✨ (Nuevo)
├── tratamientos/
│   ├── dto/
│   │   ├── create-tratamiento.dto.ts
│   │   └── update-tratamiento.dto.ts
│   ├── tratamientos.controller.ts ✨ (Mejorado)
│   └── tratamientos.service.ts ✨ (Mejorado)
└── tratamientos-producto/
    ├── dto/
    │   ├── create-tratamiento-producto.dto.ts ✨ (Actualizado)
    │   └── update-tratamiento-producto.dto.ts
    ├── tratamientos-producto.controller.ts
    └── tratamientos-producto.service.ts ✨ (Actualizado)

docs/
├── ENDPOINTS_TRATAMIENTOS_S3.md ✨ (Nuevo)
├── 12_add_estadio_tratamiento_producto.sql ✨ (Nuevo)
└── STATUS_SESION_3.md ✨ (Este archivo)
```

### Frontend
```
stores/
└── tratamientos.ts ✨ (Nuevo)

composables/
└── useTratamientos.ts ✨ (Nuevo)

components/protocolos/ ✨ (Nueva carpeta)
├── ProtocoloList.vue ✨ (Nuevo)
├── TratamientoForm.vue ✨ (Nuevo)
└── ProductosTratamiento.vue ✨ (Nuevo)

pages/protocolos/ ✨ (Nueva carpeta)
├── index.vue ✨ (Nuevo)
└── [id].vue ✨ (Nuevo)

components/navigation/
└── ModuleMenu.vue ✨ (Modificado)
```

---

## ✨ CARACTERÍSTICAS NUEVAS

### Campo `estadio`
- **Ubicación**: Tabla `Tratamiento_Producto`
- **Tipo**: VARCHAR(20), nullable
- **Ejemplos**: V2, V3, V4, V5, R1, R2, etc.
- **Formulario**: Input de texto libre en ProductosTratamiento.vue
- **Validación**: Máximo 20 caracteres

### Búsqueda y Filtros
```
GET /api/v1/tratamientos?
  page=1
  limit=10
  sort=numeroTrat
  order=ASC
  q=Fomesafen           (buscar por descripción)
  protocoloId=1         (filtro por protocolo)
  esTestigo=false       (filtro por tipo)
```

### Tratamientos Testigo
- Marcados como `es_testigo = true`
- No pueden tener productos asociados
- Usados como grupo de control
- Color diferente en interfaz (verde)

---

## 🎯 CASOS DE USO

### Caso 1: Crear Protocolo con 4 Tratamientos
```
1. Ir a /protocolos
2. Crear protocolo (future feature)
3. Crear 4 tratamientos:
   - T1: Testigo (control)
   - T2: Fomesafen 25% - 800 cc/ha - V4
   - T3: Fomesafen + GZ - 800+500 cc/ha - V4
   - T4: Fomesafen + Sogix - 800+300 cc/ha - V4
```

### Caso 2: Cambiar Dosis Después de Crear
```
1. Entrar en protocolo
2. Click en tratamiento
3. Click "Editar" en producto
4. Cambiar dosis y estadio
5. Click "Guardar"
```

### Caso 3: Duplicar Tratamiento
```
1. Editar tratamiento
2. Cambiar número
3. Guardar como nuevo
4. Editar productos según necesidad
```

---

## 📊 DATOS DE EJEMPLO (Para SQL)

```sql
-- Protocolo
INSERT INTO Protocolo (nombre, descripcion) VALUES 
('Herbicidas Post-Emergentes', 'Evaluación de herbicidas en estadios V3-V5');

-- Tratamientos
INSERT INTO Tratamiento (protocolo_id_fk, numero_trat, descripcion, es_testigo) VALUES 
(1, 1, 'Testigo (Sin aplicación)', 1),
(1, 2, 'Fomesafen 25% - 800 cc/ha - V4', 0),
(1, 3, 'Fomesafen 25% + GZ - 800+500 cc/ha - V4', 0),
(1, 4, 'Fomesafen 25% + Sogix - 800+300 cc/ha - V4', 0);

-- Productos en Tratamientos
INSERT INTO Tratamiento_Producto (tratamiento_id_fk, producto_id_fk, dosis, unidad_dosis, estadio) VALUES 
(2, 10, '800', 'cc/ha', 'V4'),
(3, 10, '800', 'cc/ha', 'V4'),
(3, 11, '500', 'cc/ha', 'V4'),
(4, 10, '800', 'cc/ha', 'V4'),
(4, 12, '300', 'cc/ha', 'V4');
```

---

## 🔐 ROLES PERMITIDOS

Para acceder a Protocolos desde menú:
- ✅ Superadministrador
- ✅ Administrador
- ✅ Investigador
- ✅ Técnico de Laboratorio
- ❌ Analista
- ❌ Invitado

---

## 📞 CONTACTO Y AYUDA

**Documentación Completa**:
- Backend: `/docs/ENDPOINTS_TRATAMIENTOS_S3.md`
- Status: `/docs/STATUS_SESION_3.md`
- Reglas: `/gemini-rules.md`

**Logs para Debug**:
```bash
# Backend
docker-compose logs -f app

# Frontend
docker-compose -f tms-client-vue/docker-compose.frontend.yml logs -f nuxt

# MySQL
docker-compose logs -f mysql
```

---

## ✅ CHECKLIST ANTES DE USAR

- [ ] Docker iniciado
- [ ] Migrations ejecutadas
- [ ] Frontend compilado
- [ ] Datos de prueba cargados
- [ ] Usuario autenticado
- [ ] Menú visible
- [ ] Protocolos accesibles

---

**Última actualización**: Diciembre 11, 2025  
**Versión**: 1.0 - SESIÓN 3 COMPLETA ✅

