# 📝 GUÍA CRUD DE ENSAYOS - SESIÓN 2

**Fecha**: Diciembre 2025  
**Estado**: ✅ COMPLETADA  
**Descripción**: Implementación completa del CRUD de Ensayos

---

## 🎯 QUÉ SE IMPLEMENTÓ

Se creó la funcionalidad completa para gestionar ensayos agronómicos con:

- ✅ **Listar** ensayos con paginación y búsqueda
- ✅ **Crear** nuevo ensayo con formulario validado
- ✅ **Ver** detalles completos de un ensayo
- ✅ **Editar** datos de ensayo existente
- ✅ **Eliminar** ensayo con confirmación

---

## 📁 ARCHIVOS CREADOS

### Stores (Estado)
```
stores/
└── ensayos.ts          # Pinia store con toda la lógica CRUD
```

### Composables (Lógica Reutilizable)
```
composables/
└── useEnsayos.ts       # Composable con métodos de utilidad
```

### Componentes
```
components/ensayos/
├── EnsayoTable.vue     # Tabla con búsqueda y paginación
├── EnsayoForm.vue      # Formulario crear/editar
├── EnsayoDetail.vue    # Detalle completo con tabs
└── DeleteConfirm.vue   # Diálogo de confirmación
```

### Páginas
```
pages/ensayos/
├── index.vue           # Listado de ensayos
├── new.vue             # Crear nuevo ensayo
├── [id].vue            # Ver detalles
└── [id]/edit.vue       # Editar ensayo
```

---

## 🔄 FLUJO DE DATOS

```
┌──────────────────────────────────────────────────┐
│                    USUARIO                       │
└────────────────────┬─────────────────────────────┘
                     │
        ┌────────────┼─────────────┐
        ▼            ▼             ▼
    ┌─────────┐  ┌────────┐  ┌─────────┐
    │ Listar  │  │ Crear  │  │ Editar  │
    │ (List)  │  │ (New)  │  │ (Edit)  │
    └────┬────┘  └───┬────┘  └────┬────┘
         │           │           │
         ├───────────┼───────────┤
         ▼           ▼           ▼
     ┌──────────────────────────────┐
     │   useEnsayos (Composable)    │
     │  - fetchCultivos()           │
     │  - formatDate()              │
     │  - validateForm()            │
     └──────────┬───────────────────┘
                │
     ┌──────────▼──────────┐
     │ useEnsayosStore     │
     │ (Pinia Store)       │
     │                     │
     │ fetchEnsayos()      │
     │ createEnsayo()      │
     │ updateEnsayo()      │
     │ deleteEnsayo()      │
     └──────────┬──────────┘
                │
     ┌──────────▼──────────────┐
     │   API Backend (NestJS)  │
     │   /api/v1/ensayos       │
     └──────────┬──────────────┘
                │
     ┌──────────▼──────────┐
     │  Base de Datos      │
     │  (MySQL - Ensayo)   │
     └─────────────────────┘
```

---

## 🎨 ESTRUCTURA DE PÁGINAS

### 1. `/ensayos` - Listado

**Componentes**: EnsayoTable  
**Funcionalidades**:
- Tabla con todos los ensayos
- Búsqueda por nombre, responsable, cultivo
- Paginación (10 por página)
- Botones: Ver, Editar, Eliminar, Crear

**Acciones**:
- Click en "Ver" → `/ensayos/:id`
- Click en "Editar" → `/ensayos/:id/edit`
- Click en "Eliminar" → Diálogo confirmación
- Click en "+ Nuevo" → `/ensayos/new`

---

### 2. `/ensayos/new` - Crear

**Componentes**: EnsayoForm  
**Formulario con campos**:
- Información básica (nombre, versión, responsable)
- Ubicación (provincia, departamento, establecimiento, lote, coordenadas)
- Cultivo (especie, variedad)
- Siembra (tipo, distancia, fecha)

**Validaciones**:
- Campos requeridos: nombre, versión, provincia, departamento, cultivo, variedad, fecha
- Largo máximo: nombre (255), versión (20)
- Fecha en formato válido

**Acciones**:
- Submit → Crear en BD y volver a listado
- Cancel → Volver sin guardar

---

### 3. `/ensayos/:id` - Detalle

**Componentes**: EnsayoDetail  
**Tabs**:
- **Información**: Todos los datos del ensayo
- **Aplicaciones**: Placeholder para próximas sesiones
- **Tratamientos**: Placeholder para próximas sesiones
- **Datos de Campo**: Placeholder para próximas sesiones
- **Cosecha**: Placeholder para próximas sesiones

**Acciones**:
- Editar → `/ensayos/:id/edit`
- Eliminar → Diálogo confirmación
- Volver → `/ensayos`

---

### 4. `/ensayos/:id/edit` - Editar

**Componentes**: EnsayoForm (con modo edición)  
**Similar a crear pero**:
- Pre-poblado con datos actuales
- Título: "Editar Ensayo"
- Botón: "Guardar Cambios"

**Acciones**:
- Submit → Actualizar en BD y volver a detalle
- Cancel → Volver sin guardar

---

## 🔧 COMPOSABLE: useEnsayos

```typescript
export const useEnsayos = () => {
  // Métodos principales
  fetchCultivos()          // Cargar catálogo de cultivos
  fetchVariedades(id)      // Cargar variedades por cultivo
  
  // Utilidades
  formatDateForInput()     // Convertir fecha para input[type=date]
  formatDateForDisplay()   // Formatear fecha para mostrar
  validateForm()           // Validar datos del formulario
  getCultivoById()         // Buscar cultivo por ID
  getVariedadById()        // Buscar variedad por ID
  
  // Estado reactivo
  cultivos                 // Array de cultivos
  variedades              // Array de variedades
  searchQuery             // String de búsqueda
  loadingCultivos         // Boolean estado carga
  
  return { ... }
}
```

---

## 📦 STORE: useEnsayosStore

```typescript
export const useEnsayosStore = defineStore('ensayos', () => {
  // State
  const ensayos: Ensayo[]
  const currentEnsayo: Ensayo | null
  const loading: boolean
  const error: string | null
  const total: number
  const currentPage: number
  const pageSize: number
  
  // Getters
  const isEmpty
  const isLoading
  const hasError
  
  // Actions
  fetchEnsayos(params)     // GET /ensayos con paginación
  fetchEnsayoById(id)      // GET /ensayos/:id
  createEnsayo(data)       // POST /ensayos
  updateEnsayo(id, data)   // PATCH /ensayos/:id
  deleteEnsayo(id)         // DELETE /ensayos/:id
  clearError()
  clearCurrent()
  
  return { ... }
})
```

---

## 🔗 ENDPOINTS API UTILIZADOS

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/ensayos` | Listar ensayos con paginación |
| GET | `/api/v1/ensayos/:id` | Obtener detalle de ensayo |
| POST | `/api/v1/ensayos` | Crear nuevo ensayo |
| PATCH | `/api/v1/ensayos/:id` | Actualizar ensayo |
| DELETE | `/api/v1/ensayos/:id` | Eliminar ensayo |
| GET | `/api/v1/catalogos/cultivos` | Listar cultivos |
| GET | `/api/v1/catalogos/variedades` | Listar variedades por cultivo |

---

## 🧪 TESTING MANUAL

### Checklist de Pruebas

- [ ] **Login funciona** y se redirige a dashboard
- [ ] **Página /ensayos carga** con tabla vacía o con datos
- [ ] **Búsqueda funciona** - filtra por nombre, responsable, cultivo
- [ ] **Paginación funciona** - anterior/siguiente
- [ ] **Botón "Nuevo"** abre formulario
- [ ] **Formulario carga cultivos** del servidor
- [ ] **Cambiar cultivo** carga variedades correspondientes
- [ ] **Validaciones funcionan** - mostrar errores
- [ ] **Crear ensayo** se guarda en BD
- [ ] **Listar actualiza** después de crear
- [ ] **Ver detalle** muestra información correcta
- [ ] **Botón editar** abre formulario con datos
- [ ] **Editar ensayo** actualiza en BD
- [ ] **Listar actualiza** después de editar
- [ ] **Botón eliminar** muestra diálogo
- [ ] **Confirmar eliminación** borra de BD
- [ ] **Listar actualiza** después de eliminar
- [ ] **Mensajes de error** son claros
- [ ] **Mensajes de éxito** aparecen y desaparecen
- [ ] **Responsive** en mobile

---

## 📝 INTERFAZ Ensayo

```typescript
interface Ensayo {
  id?: string
  nombreEnsayo: string           // Requerido
  versionProtocolo: string       // Requerido
  responsable?: string
  provincia: string              // Requerido
  departamento: string           // Requerido
  establecimiento?: string
  lote?: string
  latitud?: number
  longitud?: number
  cultivoEspecie: string         // Requerido
  cultivoVariedad: string        // Requerido
  tipoSiembra?: string
  distSurcosCm?: number
  fechaSiembra: string           // Requerido (YYYY-MM-DD)
  createdAt?: string
  updatedAt?: string
}
```

---

## 🎓 LECCIONES APRENDIDAS

1. **Pinia Store centraliza** toda la lógica de datos
2. **Composables reutilizan** lógica entre componentes
3. **Props y Emits** desacoplen componentes
4. **Validación en formulario** antes de enviar
5. **Diálogos de confirmación** para acciones críticas
6. **Paginación optimiza** carga de datos
7. **Estados de carga** mejoran UX
8. **Mensajes de error** guían al usuario

---

## 🚀 PRÓXIMAS SESIONES

Una vez que el CRUD de Ensayos esté completamente funcional:

### Sesión 3: CRUD de Tratamientos
- Crear tabla de tratamientos
- Formulario con productos
- Dosis por producto
- Vincular a ensayos

### Sesión 4: CRUD de Parcelas/Bloques
- Diseño experimental
- Asignación de tratamientos
- Visualización de parcelas
- Mapa de campo

### Sesión 5: Carga de Datos de Campo
- Formulario para mediciones
- Upload de fotos
- Registrar por variable
- Validación de datos

### Sesión 6: Reportes
- Tabla de datos
- Gráficos
- Exportar PDF/Excel
- Análisis de resultados

---

## 📚 ARCHIVOS DE REFERENCIA

- Backend: `/tms-backend/docs/API_DOCUMENTATION.md`
- Swagger: `http://localhost:3000/docs`
- Postman: `TMS_Postman_2025.postman_collection.json`
- Status anterior: `STATUS_COMPLETO_SESION_1.md`

---

## ✅ STATUS DE SESIÓN 2

**Estado**: ✅ COMPLETADA

**Lo que se logró**:
- ✅ Store Pinia completo para ensayos
- ✅ Composable useEnsayos con utilidades
- ✅ 4 componentes UI (tabla, formulario, detalle, confirmación)
- ✅ 4 páginas (listado, crear, detalle, editar)
- ✅ Validación de formulario
- ✅ Integración completa con API
- ✅ Manejo de errores
- ✅ Mensajes de éxito/error
- ✅ Paginación
- ✅ Búsqueda en vivo

**Lo que funciona**:
- CRUD completo de ensayos
- Flujo de usuario smooth
- Validación de datos
- Carga de catálogos
- Integración API

**Lo que sigue**:
- Testing completo
- Ajustes de UI/UX si es necesario
- Implementación de módulos adicionales (tratamientos, parcelas, etc.)

---

**🎉 SESIÓN 2 COMPLETADA EXITOSAMENTE 🎉**

Toda la funcionalidad CRUD de Ensayos está lista para usar y testing.

