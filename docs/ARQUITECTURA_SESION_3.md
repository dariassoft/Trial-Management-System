# 🏗️ ARQUITECTURA SESIÓN 3 - CRUD TRATAMIENTOS

## 📐 Diagrama de Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Nuxt 3 + Vue 3)                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  /protocolos                      /protocolos/[id]                 │
│  ┌──────────────────┐            ┌──────────────────────┐          │
│  │ ProtocoloList    │            │ Protocolo Detail     │          │
│  │                  │            │                      │          │
│  │ • Listado Grid   │────────→   │ • Tratamientos      │          │
│  │ • Búsqueda       │            │ • Productos         │          │
│  │ • Filtros        │            │ • Edición inline    │          │
│  └──────────────────┘            └──────────────────────┘          │
│         ▲                                 ▲                         │
│         │                                 │                         │
│  ┌──────┴──────────────────────────────────┴──┐                     │
│  │  useTratamientos() Composable              │                     │
│  │  ┌────────────────────────────────────┐   │                     │
│  │  │ • formulario management            │   │                     │
│  │  │ • búsqueda & filtros               │   │                     │
│  │  │ • validación                       │   │                     │
│  │  │ • generadores helpers              │   │                     │
│  │  └────────────────────────────────────┘   │                     │
│  └───────────────────┬────────────────────────┘                     │
│                      ▼                                              │
│  ┌────────────────────────────────────────────────┐                 │
│  │  Pinia Store: tratamientos.ts                  │                 │
│  │  ┌──────────────────────────────────────────┐  │                 │
│  │  │ State:                                   │  │                 │
│  │  │ • tratamientos[], protocolos[]           │  │                 │
│  │  │ • paginación, filtros                    │  │                 │
│  │  │ • loading, error                         │  │                 │
│  │  └──────────────────────────────────────────┘  │                 │
│  │  ┌──────────────────────────────────────────┐  │                 │
│  │  │ Actions:                                 │  │                 │
│  │  │ • fetch* (GET)                           │  │                 │
│  │  │ • create/update/delete (POST/PATCH/DEL) │  │                 │
│  │  │ • agregarProducto, deleteProducto       │  │                 │
│  │  └──────────────────────────────────────────┘  │                 │
│  └────────────────┬───────────────────────────────┘                 │
│                   ▼                                                 │
│  Componentes:                                                       │
│  • ProtocoloList.vue          (Listado de protocolos)             │
│  • TratamientoForm.vue        (Form crear/editar)                 │
│  • ProductosTratamiento.vue   (CRUD productos) ✨ PRINCIPAL         │
│                                                                     │
└─────────────────────┬─────────────────────────────────────────────┘
                      │
                      │ HTTP (REST JSON)
                      │ Authorization: Bearer TOKEN
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (NestJS)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Controllers:                                                       │
│  ┌────────────────────────┬────────────────────┐                   │
│  │ TratamientosController │ TratProductController                 │
│  ├────────────────────────┼────────────────────┤                   │
│  │ POST /tratamientos     │ POST /trat-prod    │                   │
│  │ GET  /tratamientos     │ GET  /trat-prod    │                   │
│  │ GET  /tratamientos/:id │ GET  /trat-prod/:id                  │
│  │ PATCH /:id             │ PATCH /:id         │                   │
│  │ DELETE /:id            │ DELETE /:id        │                   │
│  └────────────────────────┴────────────────────┘                   │
│           ▲                         ▲                              │
│           │                         │                              │
│  ┌────────┴─────────────────────────┴──────────┐                   │
│  │ Services (Business Logic)                    │                   │
│  ├────────────────────────────────────────────┤                   │
│  │ • TratamientosService                       │                   │
│  │   - findAll(options) with filters           │                   │
│  │   - create/update/delete                    │                   │
│  │                                              │                   │
│  │ • TratamientosProductoService ✨ MEJORADO   │                   │
│  │   - agregar producto (con estadio)          │                   │
│  │   - update (dosis, unidad, ESTADIO)         │                   │
│  │   - delete                                  │                   │
│  └────────────────────────────────────────────┘                   │
│           ▲                                                        │
│           │                                                        │
│  ┌────────┴──────────────────────────────────┐                     │
│  │ Entities (TypeORM)                         │                     │
│  ├────────────────────────────────────────────┤                    │
│  │ @Entity Tratamiento                        │                    │
│  │ ├─ id                                      │                    │
│  │ ├─ protocolo_id_fk (FK)                    │                    │
│  │ ├─ numero_trat                             │                    │
│  │ ├─ descripcion                             │                    │
│  │ └─ es_testigo                              │                    │
│  │                                            │                    │
│  │ @Entity TratamientoProducto                │                    │
│  │ ├─ id                                      │                    │
│  │ ├─ tratamiento_id_fk (FK)                  │                    │
│  │ ├─ producto_id_fk (FK)                     │                    │
│  │ ├─ dosis                                   │                    │
│  │ ├─ unidad_dosis                            │                    │
│  │ └─ estadio ✨ NUEVO                        │                    │
│  └────────────────────────────────────────────┘                   │
│           ▲                                                        │
│           │                                                        │
└───────────┼───────────────────────────────────────────────────────┘
            │
            │ TypeORM Query
            │
            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MySQL Database                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Table: Protocolo                                                   │
│  ├─ protocolo_id (PK)                                              │
│  ├─ nombre (VARCHAR 255)                                           │
│  └─ descripcion (TEXT)                                             │
│         │                                                          │
│         └──→ (1:N) Tratamiento                                    │
│              ├─ tratamiento_id (PK)                               │
│              ├─ protocolo_id_fk (FK)                              │
│              ├─ numero_trat (INT)                                 │
│              ├─ descripcion (TEXT)                                │
│              └─ es_testigo (BOOLEAN)                              │
│                    │                                              │
│                    └──→ (1:N) Tratamiento_Producto                │
│                         ├─ trat_prod_id (PK)                      │
│                         ├─ tratamiento_id_fk (FK)                 │
│                         ├─ producto_id_fk (FK)                    │
│                         ├─ dosis (VARCHAR 50)                     │
│                         ├─ unidad_dosis (VARCHAR 20)              │
│                         └─ estadio (VARCHAR 20) ✨ NUEVO           │
│                              │                                    │
│                              └──→ (N:1) Producto                  │
│                                   ├─ producto_id (PK)             │
│                                   ├─ nombre (VARCHAR 255)         │
│                                   └─ tipo (VARCHAR 100)           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE DATOS: Crear Tratamiento con Producto

```
Usuario                 Frontend                Backend              Database
  │                        │                       │                    │
  ├──→ Click Protocolo     │                       │                    │
  │    Ver Detalles        │                       │                    │
  │                        ├──→ GET /protocolos/1  │                    │
  │                        │    Accept: application/json              │
  │                        │                       ├──→ QueryBuilder   │
  │                        │                       │    JOIN tratamientos
  │                        │                       │    JOIN productos
  │                        │                       │                    ├──→ SELECT *
  │                        │                       │←── Protocolo + Trats←──┤
  │                        │←── {data, meta}       │                    │
  │                        │                       │                    │
  ├──→ Click "+ Nuevo"     │                       │                    │
  │                        ├─→ Form Modal          │                    │
  │                        │   (clientside)        │                    │
  │                        │                       │                    │
  ├──→ Fill form           │                       │                    │
  │    Click "Crear"       │                       │                    │
  │                        ├──→ POST /tratamientos │                    │
  │                        │    {                  │                    │
  │                        │      protocoloId: 1,  │                    │
  │                        │      numeroTrat: 2,   │                    │
  │                        │      descripcion: "...",│                  │
  │                        │      esTestigo: false │                    │
  │                        │    }                  │                    │
  │                        │    Authorization: Bearer │                │
  │                        │                       ├──→ Validar (DTO) │
  │                        │                       ├──→ create()      │
  │                        │                       │                  ├──→ INSERT
  │                        │                       │←── Tratamiento    ←──┤
  │                        │←── 201 Created        │                    │
  │                        │    {id: 5, ...}       │                    │
  │                        │                       │                    │
  ├──→ Sec Productos       │                       │                    │
  │    Click Agregar       │                       │                    │
  │                        ├─→ Form (clientside)  │                    │
  │                        │   Select Producto    │                    │
  │                        │   Ingresa Dosis      │                    │
  │                        │   Ingresa Unidad     │                    │
  │                        │   Ingresa Estadio ✨ │                    │
  │                        │                       │                    │
  ├──→ Click "Guardar      │                       │                    │
  │    Producto"           │                       │                    │
  │                        ├──→ POST /trat-prod   │                    │
  │                        │    {                  │                    │
  │                        │      tratamientoId: 5,│                   │
  │                        │      productoId: 10,  │                    │
  │                        │      dosis: "800",    │                    │
  │                        │      unidadDosis: "cc/ha",│               │
  │                        │      estadio: "V4" ✨ │                    │
  │                        │    }                  │                    │
  │                        │                       ├──→ Validar        │
  │                        │                       ├──→ create()       │
  │                        │                       │                   ├──→ INSERT
  │                        │                       │←── TratProd        ←──┤
  │                        │←── 201 Created        │                    │
  │                        │    {id: 123, ...}     │                    │
  │                        │                       │                    │
  ├──→ Actualización       │                       │                    │
  │    del componente      │   • Tabla actualiza  │                    │
  │                        │   • Sin recarga       │                    │
  │                        │   • Estado reactivo   │                    │
  │                        │                       │                    │
```

---

## 🎯 Componentes y Responsabilidades

### **ProtocoloList.vue**
```
┌─────────────────────────────────────┐
│     PROTOCOLO LIST COMPONENT        │
├─────────────────────────────────────┤
│ Props: none                          │
│ Emits: none                          │
├─────────────────────────────────────┤
│ Responsabilidades:                   │
│ • Mostrar grid de protocolos         │
│ • Búsqueda y ordenamiento            │
│ • Navegar a detalle                  │
├─────────────────────────────────────┤
│ Uses:                                │
│ • useTratamientos()                  │
│ • useRouter()                        │
│ • store.protocolos                   │
│ • store.loading, error               │
└─────────────────────────────────────┘
```

### **TratamientoForm.vue**
```
┌──────────────────────────────────────┐
│   TRATAMIENTO FORM COMPONENT         │
├──────────────────────────────────────┤
│ Props:                               │
│ • esEdicion: boolean                 │
├──────────────────────────────────────┤
│ Emits:                               │
│ • cerrar                             │
│ • guardado                           │
├──────────────────────────────────────┤
│ Responsabilidades:                   │
│ • Renderizar form (crear/editar)     │
│ • Validar datos                      │
│ • Submit y enviar a store             │
├──────────────────────────────────────┤
│ Fields:                              │
│ • protocolo (select)                 │
│ • numeroTrat (number)                │
│ • esTestigo (radio)                  │
│ • descripcion (textarea)             │
└──────────────────────────────────────┘
```

### **ProductosTratamiento.vue** ✨ COMPONENTE PRINCIPAL
```
┌────────────────────────────────────────┐
│  PRODUCTOS TRATAMIENTO COMPONENT       │
├────────────────────────────────────────┤
│ Props:                                 │
│ • tratamiento: Tratamiento             │
├────────────────────────────────────────┤
│ Responsabilidades:                     │
│ • Listar productos del tratamiento     │
│ • Agregar nuevo producto               │
│ • Editar producto (inline)             │
│ • Eliminar producto                    │
│ • Manejo de campos:                    │
│   - Producto (select FK)               │
│   - Dosis (text)                       │
│   - Unidad (select)                    │
│   - ESTADIO (text) ✨ NUEVO             │
├────────────────────────────────────────┤
│ Features:                              │
│ • Validación selectciones              │
│ • Lógica de testigos                   │
│ • Edición inline                       │
│ • Eliminación con confirm              │
│ • Estados de carga                     │
│ • Manejo de errores                    │
├────────────────────────────────────────┤
│ Uses:                                  │
│ • store.agregarProductoATratamiento    │
│ • store.updateProductoTratamiento      │
│ • store.deleteProductoTratamiento      │
│ • store.productos                      │
│ • Computed: productosDisponibles       │
└────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### Tratamientos
```javascript
// GET con búsqueda y filtros
{
  method: 'GET',
  url: '/api/v1/tratamientos',
  params: {
    page: 1,           // Paginación
    limit: 10,
    sort: 'numeroTrat', // Ordenamiento
    order: 'ASC',
    q: 'Fomesafen',    // Búsqueda
    protocoloId: 1,    // Filtros
    esTestigo: false
  }
}

// Respuesta
{
  data: [{
    id: 5,
    protocolo_id: 1,
    numero_trat: 2,
    descripcion: "Fomesafen 25% - 800 cc/ha - V4",
    es_testigo: false,
    protocolo: { id: 1, nombre: "Proto 1" },
    productos: [...]
  }],
  meta: {
    total: 10,
    page: 1,
    limit: 10,
    pageCount: 1
  }
}

// POST crear
{
  method: 'POST',
  url: '/api/v1/tratamientos',
  body: {
    protocoloId: 1,
    numeroTrat: 2,
    descripcion: "...",
    esTestigo: false
  }
}

// PATCH actualizar
{
  method: 'PATCH',
  url: '/api/v1/tratamientos/5',
  body: {
    descripcion: "Nuevo desc",
    numeroTrat: 3
  }
}

// DELETE
{
  method: 'DELETE',
  url: '/api/v1/tratamientos/5'
}
```

### Tratamientos-Productos
```javascript
// POST agregar producto ✨
{
  method: 'POST',
  url: '/api/v1/tratamientos-producto',
  body: {
    tratamientoId: 5,
    productoId: 10,
    dosis: "800",
    unidadDosis: "cc/ha",
    estadio: "V4"  // ✨ NUEVO
  }
}

// PATCH actualizar producto ✨
{
  method: 'PATCH',
  url: '/api/v1/tratamientos-producto/123',
  body: {
    dosis: "500",
    unidadDosis: "gr/ha",
    estadio: "V3"  // ✨ ACTUALIZABLE
  }
}

// DELETE
{
  method: 'DELETE',
  url: '/api/v1/tratamientos-producto/123'
}
```

---

## 📊 Estados de Carga (Reactivity Pattern)

```javascript
// Store State
const tratamientos = ref<Tratamiento[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const paginacion = reactive({ page: 1, limit: 10, ... })
const filtros = reactive({ q: '', protocoloId: null, ... })

// Composable Computed
const esEdicion = computed(() => editandoId.value !== null)
const productosDisponibles = computed(() => {
  return store.productos.filter(p => 
    !tratamiento.productos?.map(tp => tp.producto_id).includes(p.id)
  )
})

// Loading & Error Handling
async function guardarTratamiento() {
  guardando.value = true
  erroresFormulario.value = []
  try {
    await store.createTratamiento(...)
  } catch (err) {
    erroresFormulario.value = [err.message]
  } finally {
    guardando.value = false
  }
}
```

---

## 🎨 Patrones de Diseño Implementados

### 1. **Store Pattern (Pinia)**
- Estado centralizado
- Actions para mutaciones
- Getters para computed

### 2. **Composable Pattern**
- Lógica reutilizable
- Separación de concerns
- Encapsulación

### 3. **Modal Component Pattern**
```vue
<div v-if="mostrarFormulario" class="fixed inset-0">
  <!-- Modal backdrop & content -->
</div>
```

### 4. **Inline Editing Pattern**
```vue
<div v-if="editandoId === producto.id">
  <!-- Formulario inline -->
</div>
```

### 5. **Filtros y Búsqueda Reactiva**
```javascript
// Filtros en state
const filtros = reactive({ q: '', protocoloId: null })

// Computed auto-reactivo
const tratamientosFiltrados = computed(() => {
  return aplicarFiltros(store.tratamientos, filtros)
})
```

---

## 🔐 Validaciones

### Frontend
```javascript
// DTO Validation (class-validator)
@IsInt()
@MaxLength(255)
@IsString()
@IsBoolean()

// Composable Validation
function validarFormulario(): string[] {
  const errores: string[] = []
  if (!protocoloId) errores.push('Protocolo obligatorio')
  if (numeroTrat < 1) errores.push('Número debe ser > 0')
  return errores
}

// Component Validation
v-show="erroresFormulario.length > 0"
<div class="bg-red-50">
  <li v-for="error in erroresFormulario">{{ error }}</li>
</div>
```

### Backend
```typescript
// NestJS Pipes & Guards
@Roles(Role.ADMIN, Role.TECNICO)
@Post()
create(@Body() dto: CreateTratamientoDto) {
  // DTO validación automática
}

// Service Validation
async create(dto: CreateTratamientoDto) {
  if (!dto.protocoloId) throw new BadRequestException('...')
  // ...
}
```

---

## 📈 Mejoras Implementadas

| Aspecto | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Campo Estadio** | ❌ No existe | ✅ Agregado | Indica momento de aplicación |
| **Búsqueda** | ❌ No | ✅ Multicampo | Buscar en descripción + protocolo |
| **Filtros** | ❌ No | ✅ 3+ filtros | Por protocolo, tipo, etc. |
| **Paginación** | ❌ No | ✅ Implementada | page, limit, meta |
| **Ordenamiento** | ❌ Fijo | ✅ Dinámico | sort, order ASC/DESC |
| **UX Formularios** | ⚠️ Básica | ✅ Mejorada | Validación, errores claros |
| **Responsive** | ⚠️ Parcial | ✅ Completo | Mobile first, breakpoints |
| **Tema Oscuro** | ⚠️ Parcial | ✅ Completo | Todos los componentes |

---

**Última actualización**: Diciembre 11, 2025

