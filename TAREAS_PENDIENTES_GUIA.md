# 📋 TAREAS PENDIENTES TMS - GUÍA DE IMPLEMENTACIÓN

**Fecha**: 29 de Enero, 2026  
**Versión**: 1.0  
**Propósito**: Documento guía para completar las funcionalidades pendientes

---

## 📊 RESUMEN DE PENDIENTES

| Categoría | Items | Estimación | Prioridad |
|-----------|-------|------------|-----------|
| ABMs Catálogos | 8 módulos | 6-8 horas | Media |
| Mediciones Campo | 5 módulos | 15-20 horas | **ALTA** |
| Reportes | 3 tipos | 4-6 horas | Media |
| Dashboard | 4 widgets | 2-3 horas | Baja |
| Admin Panel | 3 secciones | 3-4 horas | Baja |

**Total estimado**: 30-40 horas de desarrollo

---

## 🟡 PARTE 1: ABMs DE CATÁLOGOS SIMPLES

Estos son módulos CRUD simples que siguen el mismo patrón ya implementado en Protocolos y Tratamientos.

### 1.1 Laboratorios

**Backend**: ✅ Endpoints existentes
```
GET    /api/v1/laboratorios
POST   /api/v1/laboratorios
PATCH  /api/v1/laboratorios/:id
DELETE /api/v1/laboratorios/:id
```

**Frontend pendiente**:
- [ ] Página `pages/admin/laboratorios.vue`
- [ ] Store `stores/laboratorios.ts` (si no existe)
- [ ] Modal crear/editar
- [ ] Tabla con búsqueda y paginación

**Campos**:
- `id`: number (auto)
- `nombre`: string (required, unique)
- `ubicacion`: string (optional)
- `activo`: boolean

**Tiempo estimado**: 45 min

---

### 1.2 Productos

**Backend**: ✅ Endpoints existentes
```
GET    /api/v1/productos
POST   /api/v1/productos
PATCH  /api/v1/productos/:id
DELETE /api/v1/productos/:id
```

**Frontend pendiente**:
- [ ] Página `pages/admin/productos.vue`
- [ ] Store `stores/productos.ts`
- [ ] Modal crear/editar con select de laboratorio
- [ ] Filtro por laboratorio

**Campos**:
- `id`: number
- `nombre`: string
- `tipo`: string (herbicida, fungicida, insecticida, etc.)
- `laboratorio`: FK a Laboratorio
- `activo`: boolean

**Tiempo estimado**: 1 hora

---

### 1.3 Usuarios

**Backend**: ✅ Endpoints existentes
```
GET    /api/v1/users
POST   /api/v1/users
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
```

**Frontend pendiente**:
- [ ] Página `pages/admin/usuarios.vue`
- [ ] Store actualizado con CRUD completo
- [ ] Modal crear/editar
- [ ] Asignación de rol (select)
- [ ] Asignación de laboratorios (multi-select)
- [ ] Cambio de contraseña

**Campos**:
- `id`: number
- `username`: string
- `email`: string
- `nombre`: string
- `apellido`: string
- `rol`: FK a Rol
- `laboratorios`: M:N via UsuarioLaboratorio
- `activo`: boolean

**Tiempo estimado**: 1.5 horas (más complejo por roles y labs)

---

### 1.4 Roles

**Backend**: ✅ Endpoints existentes
```
GET    /api/v1/roles
```

**Frontend pendiente**:
- [ ] Vista solo lectura (no editable normalmente)
- [ ] Opcional: página de administración si se requiere

**Campos**:
- `id`: number
- `nombre`: string (SUPERADMIN, ADMIN, TECNICO, INVITADO)

**Tiempo estimado**: 15 min (solo vista)

---

### 1.5 Tipos de Siembra

**Backend**: ✅ Endpoints existentes
```
GET    /api/v1/catalogos/tipos-siembra
POST   /api/v1/catalogos/tipos-siembra
```

**Frontend pendiente**:
- [ ] Página `pages/admin/tipos-siembra.vue`
- [ ] Modal crear/editar simple
- [ ] Lista con búsqueda

**Campos**:
- `id`: number
- `nombre`: string (Directa, Convencional, etc.)

**Tiempo estimado**: 30 min

---

### 1.6 Status Ensayo

**Backend**: ✅ Endpoints existentes
```
GET    /api/v1/status-ensayos
POST   /api/v1/status-ensayos (si existe)
```

**Frontend pendiente**:
- [ ] Página `pages/admin/status-ensayo.vue`
- [ ] Modal crear/editar
- [ ] Orden y color (si aplica)

**Campos**:
- `id`: number
- `nombre`: string (Planificado, En Ejecución, Completado, Cancelado)
- `color`: string (hex, opcional para UI)
- `orden`: number (para ordenar en selects)

**Tiempo estimado**: 30 min

---

### 1.7 Cultivos

**Backend**: ✅ Endpoints existentes
```
GET    /api/v1/catalogos/cultivos
POST   /api/v1/catalogos/cultivos
PATCH  /api/v1/catalogos/cultivos/:id
DELETE /api/v1/catalogos/cultivos/:id
```

**Frontend pendiente**:
- [ ] Página `pages/admin/cultivos.vue`
- [ ] Modal crear/editar
- [ ] Lista de variedades relacionadas

**Campos**:
- `id`: number
- `nombre`: string (Soja, Maíz, Trigo, etc.)

**Tiempo estimado**: 30 min

---

### 1.8 Cultivo Variedad

**Backend**: ✅ Endpoints existentes
```
GET    /api/v1/catalogos/cultivo-variedades
POST   /api/v1/catalogos/cultivo-variedades
PATCH  /api/v1/catalogos/cultivo-variedades/:id
DELETE /api/v1/catalogos/cultivo-variedades/:id
```

**Frontend pendiente**:
- [ ] Incluir en página de Cultivos como sub-sección
- [ ] O página separada `pages/admin/variedades.vue`
- [ ] Filtro por cultivo padre
- [ ] Modal crear/editar

**Campos**:
- `id`: number
- `nombre`: string (DM 4612, NS 4619, etc.)
- `cultivo`: FK a Cultivo
- `ciclo`: string (opcional: Corto, Medio, Largo)

**Tiempo estimado**: 45 min

---

### 📝 Patrón de Implementación ABM

Para cada ABM, seguir este patrón:

```vue
<!-- pages/admin/[entidad].vue -->
<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Gestión de [Entidad]</h1>
      <button @click="openModal()" class="btn-primary">
        + Nuevo
      </button>
    </div>
    
    <!-- Búsqueda -->
    <input v-model="search" placeholder="Buscar..." class="input mb-4" />
    
    <!-- Tabla -->
    <table class="table-auto w-full">
      <thead>...</thead>
      <tbody>
        <tr v-for="item in filteredItems" :key="item.id">
          <td>{{ item.nombre }}</td>
          <td>
            <button @click="edit(item)">Editar</button>
            <button @click="remove(item.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- Modal -->
    <Modal v-if="showModal" @close="closeModal">
      <Form :item="currentItem" @save="save" />
    </Modal>
  </div>
</template>
```

---

## 🔴 PARTE 2: SISTEMA DE MEDICIONES EN CAMPO

**Ver documento detallado**: `PLAN_MEDICIONES_CAMPO.md`

### Resumen de Módulos

| Módulo | Backend | Frontend | Prioridad |
|--------|---------|----------|-----------|
| Aplicaciones | ⏳ Crear | ⏳ Crear | Alta |
| Momentos Evaluación | ⏳ Completar | ⏳ Crear | Alta |
| Datos Campo | ⏳ Completar | ⏳ Crear | Alta |
| Fotos/Videos | ⏳ Crear | ⏳ Crear | Alta |
| Datos Cosecha | ⏳ Completar | ⏳ Crear | Media |

### Flujo Principal

```
Ensayo → Aplicación → Momentos (DDA) → Parcelas → Mediciones → Fotos
                                                       ↓
                                               Datos Cosecha
```

### Diseño Mobile-First

- Pantalla principal de medición optimizada para móvil
- Navegación por swipe entre parcelas
- Botones grandes para táctil
- Captura de fotos integrada
- Modo offline (futuro)

---

## 🟠 PARTE 3: CONFIGURACIÓN DE TIPOS DE ENSAYO

Antes de poder usar el sistema de mediciones, debe estar configurado:

### 3.1 Gestión de Tipos de Ensayo

**Página**: `pages/admin/tipos-ensayo.vue`

**Funcionalidades**:
- [ ] CRUD de tipos de ensayo
- [ ] Asignar días de evaluación (7, 14, 21, 28...)
- [ ] Asignar variables a medir
- [ ] Configurar orden, requerido, escala, rangos

**UI sugerida**:
```
┌─────────────────────────────────────────────────────┐
│ Tipo de Ensayo: Herbicidas Pre-emergentes Soja     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ DÍAS DE EVALUACIÓN                                  │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           │
│ │  7  │ │ 14  │ │ 21  │ │ 28  │ │ +   │           │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘           │
│                                                     │
│ VARIABLES A MEDIR                                   │
│ ┌─────────────────────────────────────────────┐    │
│ │ 1. % Control Maleza Hoja Ancha              │    │
│ │    Unidad: %  |  Escala: 0-100  |  Requerido│    │
│ ├─────────────────────────────────────────────┤    │
│ │ 2. % Control Gramíneas                      │    │
│ │    Unidad: %  |  Escala: 0-100  |  Requerido│    │
│ ├─────────────────────────────────────────────┤    │
│ │ 3. Fitotoxicidad                            │    │
│ │    Unidad: escala  |  Escala: 0-5  |  Opc.  │    │
│ └─────────────────────────────────────────────┘    │
│                                                     │
│ [+ Agregar Variable]                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Tiempo estimado**: 2-3 horas

---

### 3.2 Catálogo de Variables (Protocolo_Variable)

**Página**: `pages/admin/variables.vue`

**Funcionalidades**:
- [ ] CRUD de variables de medición
- [ ] Nombre, unidad, descripción
- [ ] Vinculación a tipo de ensayo

**Campos**:
- `id`: number
- `nombre_variable`: string (% Control, Fitotoxicidad, Altura, etc.)
- `unidad_medida`: string (%, escala 1-5, cm, kg/ha)
- `descripcion`: string
- `tipoEnsayo`: FK

**Tiempo estimado**: 1 hora

---

## 🟢 PARTE 4: REPORTES

### 4.1 Reporte de Ensayo

**Página**: `pages/reportes/ensayo/[id].vue`

**Contenido**:
- Datos generales del ensayo
- Diseño experimental (bloques, parcelas)
- Tratamientos aplicados
- Resultados por DDA
- Fotos representativas
- Datos de cosecha

**Formatos**:
- [ ] Vista HTML
- [ ] Exportar PDF
- [ ] Exportar CSV/Excel

**Tiempo estimado**: 2-3 horas

---

### 4.2 Reporte Comparativo

**Página**: `pages/reportes/comparativo.vue`

**Contenido**:
- Selección de múltiples ensayos
- Comparación de tratamientos
- Gráficos comparativos
- Análisis estadístico básico

**Tiempo estimado**: 2-3 horas

---

### 4.3 Reporte de Campo

**Página**: `pages/reportes/campo/[id].vue`

**Contenido**:
- Reporte imprimible para llevar a campo
- Lista de parcelas con QR
- Espacios para anotar manualmente
- Checklist de tareas

**Tiempo estimado**: 1-2 horas

---

## 📅 CRONOGRAMA SUGERIDO

### Semana 1: ABMs y Configuración
| Día | Tarea | Horas |
|-----|-------|-------|
| 1 | ABMs: Laboratorios, Productos | 2h |
| 2 | ABMs: Usuarios, Roles | 2h |
| 3 | ABMs: Catálogos menores | 2h |
| 4 | Tipos de Ensayo con variables | 3h |
| 5 | Testing y correcciones | 2h |

### Semana 2: Mediciones Backend
| Día | Tarea | Horas |
|-----|-------|-------|
| 1 | Módulo Aplicaciones | 2h |
| 2 | Módulo Momentos | 2h |
| 3 | Módulo Datos Campo | 3h |
| 4 | Módulo Fotos | 2h |
| 5 | Módulo Cosecha + Testing | 2h |

### Semana 3: Mediciones Frontend
| Día | Tarea | Horas |
|-----|-------|-------|
| 1 | Stores y composables | 2h |
| 2 | Página lista ensayos | 2h |
| 3 | Página medición parcelas | 4h |
| 4 | Captura de fotos | 2h |
| 5 | Optimización mobile | 2h |

### Semana 4: Reportes y Polish
| Día | Tarea | Horas |
|-----|-------|-------|
| 1 | Reporte de ensayo | 3h |
| 2 | Exportación PDF/CSV | 2h |
| 3 | Dashboard mejorado | 2h |
| 4 | Testing completo | 3h |
| 5 | Documentación | 2h |

---

## ✅ CHECKLIST GENERAL

### Pre-requisitos
- [x] Backend NestJS funcionando
- [x] Frontend Nuxt 3 funcionando
- [x] Base de datos con entidades creadas
- [x] Autenticación funcionando
- [x] CRUD Ensayos completo
- [x] CRUD Protocolos completo
- [x] CRUD Tratamientos completo
- [x] CRUD Bloques y Parcelas completo

### ABMs Catálogos
- [ ] Laboratorios
- [ ] Productos
- [ ] Usuarios
- [ ] Roles (vista)
- [ ] Tipos de Siembra
- [ ] Status Ensayo
- [ ] Cultivos
- [ ] Cultivo Variedad

### Configuración Tipos Ensayo
- [ ] CRUD Tipos de Ensayo
- [ ] Gestión de días de evaluación
- [ ] Gestión de variables
- [ ] Configuración requerido/opcional

### Mediciones Campo
- [ ] Backend Aplicaciones
- [ ] Backend Momentos
- [ ] Backend Datos Campo
- [ ] Backend Fotos
- [ ] Backend Cosecha
- [ ] Frontend Lista ensayos
- [ ] Frontend Medición parcelas
- [ ] Frontend Captura fotos
- [ ] Optimización mobile

### Reportes
- [ ] Reporte ensayo HTML
- [ ] Exportar PDF
- [ ] Exportar CSV
- [ ] Reporte comparativo

---

## 📚 DOCUMENTOS RELACIONADOS

1. **STATUS_PROYECTO_ENERO_2026.md** - Estado actual del proyecto
2. **PLAN_MEDICIONES_CAMPO.md** - Plan detallado de mediciones
3. **PLAN_MAESTRO.md** - Roadmap general
4. **gemini-rules.md** - Reglas y convenciones

---

## 🚀 CÓMO EMPEZAR LA PRÓXIMA SESIÓN

1. Leer este documento completo
2. Leer `PLAN_MEDICIONES_CAMPO.md`
3. Decidir si empezar por ABMs (más simples) o Mediciones (más importante)
4. Recomendación: **Empezar con ABMs** para calentar, luego **Mediciones**

### Prompt sugerido para iniciar:

```
Contexto:
- Ver /tms-backend/STATUS_PROYECTO_ENERO_2026.md
- Ver /tms-backend/TAREAS_PENDIENTES_GUIA.md
- Ver /tms-backend/PLAN_MEDICIONES_CAMPO.md
- Ver /tms-backend/gemini-rules.md

Tarea: Implementar ABM de Laboratorios siguiendo el patrón 
establecido en Protocolos. Crear página, store si no existe, 
modal crear/editar, tabla con búsqueda.
```

---

**Documento creado**: 29 de Enero, 2026  
**Última actualización**: 29 de Enero, 2026
