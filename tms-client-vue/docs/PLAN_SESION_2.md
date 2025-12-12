# 📝 PLAN SESIÓN 2 - PANTALLA DE ENSAYOS CRUD

**Fecha Prevista**: Próxima sesión  
**Objetivo**: Crear funcionalidad completa de CRUD para Ensayos  
**Duración Estimada**: 2-3 horas

---

## 🎯 OBJETIVO PRINCIPAL

Crear una pantalla completa donde usuarios puedan:
1. ✅ **Ver lista** de ensayos (tabla con paginación)
2. ✅ **Crear** nuevo ensayo (formulario)
3. ✅ **Ver detalles** de un ensayo
4. ✅ **Editar** ensayo existente
5. ✅ **Eliminar** ensayo con confirmación

---

## 📊 DETALLES TÉCNICOS

### 1. Pantalla: Listado de Ensayos

**Ruta**: `/ensayos`

**Componentes**:
- Tabla responsive
- Búsqueda por nombre
- Filtro por estado
- Paginación (limit, page)
- Botón "Nuevo Ensayo"
- Acciones por fila (Ver, Editar, Eliminar)

**API Endpoint**:
```
GET /api/v1/ensayos
Query params: ?limit=10&page=1&sort=nombre&order=ASC&q=<búsqueda>
```

**Datos a mostrar**:
- ID
- Nombre del ensayo
- Versión protocolo
- Responsable
- Cultivo
- Ubicación (Provincia, Departamento)
- Fecha de siembra
- Fecha de creación
- Acciones

---

### 2. Pantalla: Nuevo Ensayo

**Ruta**: `/ensayos/new`

**Formulario**:
```
┌─────────────────────────────────────┐
│ CREAR NUEVO ENSAYO                  │
├─────────────────────────────────────┤
│                                     │
│ Nombre Ensayo *       [___________]│
│ Versión Protocolo     [___________]│
│ Responsable           [___________]│
│                                     │
│ --- UBICACIÓN ---                  │
│ Provincia *           [___________]│
│ Departamento *        [___________]│
│ Establecimiento       [___________]│
│ Lote                  [___________]│
│ Latitud               [___________]│
│ Longitud              [___________]│
│                                     │
│ --- CULTIVO ---                    │
│ Especie *             [Dropdown  ▼]│
│ Variedad *            [Dropdown  ▼]│
│ Tipo de Siembra       [___________]│
│ Distancia Surcos (cm) [___________]│
│ Fecha Siembra *       [Picker    ▼]│
│                                     │
│ [Cancelar]  [Crear Ensayo]         │
└─────────────────────────────────────┘
```

**Validaciones**:
- Nombre: requerido, max 255
- Versión: requerido, max 20
- Provincia: requerido
- Departamento: requerido
- Cultivo: requerido
- Variedad: requerido
- Fecha siembra: requerido, fecha válida

**API Endpoint**:
```
POST /api/v1/ensayos
Body: {
  "nombreEnsayo": "string",
  "versionProtocolo": "string",
  "responsable": "string",
  "provincia": "string",
  "departamento": "string",
  "establecimiento": "string",
  "lote": "string",
  "latitud": number,
  "longitud": number,
  "cultivoEspecie": "string",
  "cultivoVariedad": "string",
  "tipoSiembra": "string",
  "distSurcosCm": number,
  "fechaSiembra": "YYYY-MM-DD"
}
```

---

### 3. Pantalla: Detalle de Ensayo

**Ruta**: `/ensayos/:id`

**Contenido**:
- Datos básicos del ensayo
- Información de ubicación
- Datos del cultivo
- Botones: Editar, Eliminar, Volver
- Tabs:
  - Información general
  - Aplicaciones
  - Tratamientos
  - Datos de campo
  - Cosecha

**API Endpoints**:
```
GET /api/v1/ensayos/:id                 # Detalle
PATCH /api/v1/ensayos/:id               # Actualizar
DELETE /api/v1/ensayos/:id              # Eliminar
GET /api/v1/ensayos/:id/aplicaciones    # Aplicaciones
```

---

### 4. Pantalla: Editar Ensayo

**Ruta**: `/ensayos/:id/edit`

**Contenido**:
- Mismo formulario que "Crear"
- Pre-poblado con datos actuales
- Validaciones iguales
- Botones: Cancelar, Guardar cambios

**API Endpoint**:
```
PATCH /api/v1/ensayos/:id
Body: { campos actualizados }
```

---

## 🏗️ ESTRUCTURA DE ARCHIVOS A CREAR

```
tms-client-vue/
├── pages/
│   └── ensayos/
│       ├── index.vue                 # Listado
│       ├── new.vue                   # Crear
│       ├── [id].vue                  # Detalle
│       └── [id]/
│           └── edit.vue              # Editar
│
├── components/
│   └── ensayos/
│       ├── EnsayoTable.vue           # Tabla listado
│       ├── EnsayoForm.vue            # Formulario crear/editar
│       ├── EnsayoDetail.vue          # Detalle ensayo
│       └── DeleteConfirm.vue         # Diálogo confirmación
│
├── composables/
│   └── useEnsayos.ts                 # Lógica CRUD ensayos
│
├── stores/
│   └── ensayos.ts                    # Pinia store ensayos
│
└── docs/
    └── GUIA_ENSAYOS_CRUD.md          # Documentación
```

---

## 💻 CÓDIGO BASE (Pseudocódigo)

### useApi.ts - Métodos a agregar
```typescript
export const useApi = () => {
  // Ensayos
  const getEnsayos = async (params) => { /* GET */ }
  const getEnsayoById = async (id) => { /* GET */ }
  const createEnsayo = async (data) => { /* POST */ }
  const updateEnsayo = async (id, data) => { /* PATCH */ }
  const deleteEnsayo = async (id) => { /* DELETE */ }
  
  // Catálogos
  const getCultivos = async () => { /* GET cultivos */ }
  const getVariedades = async (cultivoId) => { /* GET variedades */ }
  
  return {
    getEnsayos,
    getEnsayoById,
    createEnsayo,
    updateEnsayo,
    deleteEnsayo,
    getCultivos,
    getVariedades
  }
}
```

### ensayos.ts - Pinia Store
```typescript
export const useEnsayosStore = defineStore('ensayos', () => {
  const ensayos = ref([])
  const currentEnsayo = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const fetchEnsayos = async (params) => { /* */ }
  const fetchEnsayoById = async (id) => { /* */ }
  const addEnsayo = async (data) => { /* */ }
  const updateEnsayoData = async (id, data) => { /* */ }
  const removeEnsayo = async (id) => { /* */ }
  
  return {
    ensayos,
    currentEnsayo,
    loading,
    error,
    fetchEnsayos,
    fetchEnsayoById,
    addEnsayo,
    updateEnsayoData,
    removeEnsayo
  }
})
```

---

## 🎨 COMPONENTES A CREAR

### EnsayoTable.vue
```vue
<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Responsable</th>
          <th>Cultivo</th>
          <th>Fecha Siembra</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ensayo in ensayos" :key="ensayo.id">
          <td>{{ ensayo.nombreEnsayo }}</td>
          <td>{{ ensayo.responsable }}</td>
          <td>{{ ensayo.cultivoEspecie }}</td>
          <td>{{ formatDate(ensayo.fechaSiembra) }}</td>
          <td>
            <button @click="viewEnsayo(ensayo.id)">Ver</button>
            <button @click="editEnsayo(ensayo.id)">Editar</button>
            <button @click="openDeleteDialog(ensayo.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

### EnsayoForm.vue
```vue
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label>Nombre Ensayo *</label>
      <input v-model="form.nombreEnsayo" required />
    </div>
    
    <!-- Más campos -->
    
    <div class="flex gap-2">
      <button type="button" @click="goBack">Cancelar</button>
      <button type="submit">{{ isEditing ? 'Guardar' : 'Crear' }}</button>
    </div>
  </form>
</template>
```

---

## 🧪 TESTING MANUAL

### Checklist de Pruebas
- [ ] Login funciona
- [ ] Página de ensayos carga correctamente
- [ ] Tabla muestra datos de BD
- [ ] Búsqueda filtra correctamente
- [ ] Paginación funciona
- [ ] Botón "Nuevo" abre formulario
- [ ] Validaciones del formulario funcionan
- [ ] Crear ensayo guarda en BD
- [ ] Ver detalle muestra información correcta
- [ ] Editar ensayo actualiza datos
- [ ] Eliminar muestra confirmación
- [ ] Eliminar realmente borra de BD
- [ ] Errores muestran mensajes claros
- [ ] Responsivo en mobile

---

## 🚀 PASOS EJECUCIÓN SESIÓN 2

1. **Preparación** (5 min)
   - Revisar documentación backend
   - Abrir terminal con backend corriendo
   - Revisar Swagger UI

2. **Componentes Base** (30 min)
   - Crear EnsayoTable.vue
   - Crear EnsayoForm.vue
   - Crear pages/ensayos/index.vue

3. **Integración API** (30 min)
   - Agregar métodos a useApi.ts
   - Crear/usar store ensayos.ts
   - Conectar componentes con API

4. **Pantallas Secundarias** (30 min)
   - Crear new.vue
   - Crear [id].vue
   - Crear [id]/edit.vue

5. **Testing y Fixes** (30 min)
   - Probar flujo completo
   - Corregir errores
   - Validar responsividad

---

## 📚 REFERENCIAS

- Backend Docs: `/tms-backend/docs/API_DOCUMENTATION.md`
- Swagger: `http://localhost:3000/docs`
- Frontend Status: `tms-client-vue/docs/STATUS_FRONTEND_SESION_1.md`
- Postman: `TMS_Postman_2025.postman_collection.json`

---

## ✅ CHECKLIST ANTES DE EMPEZAR SESIÓN 2

- [ ] Revisar STATUS_COMPLETO_SESION_1.md
- [ ] Revisar STATUS_FRONTEND_SESION_1.md
- [ ] Familiarizarse con estructura actual
- [ ] Revisar endpoints en Swagger
- [ ] Probar login en frontend
- [ ] Tener backend corriendo
- [ ] Tener frontend corriendo

---

**¡LISTO PARA SESIÓN 2!**


