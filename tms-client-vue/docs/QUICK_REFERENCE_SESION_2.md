# ⚡ QUICK REFERENCE - SESIÓN 2

**Uso**: Referencia rápida de lo implementado en Sesión 2

---

## 📁 ARCHIVOS NUEVOS CREADOS

### Stores
```
stores/ensayos.ts
```

### Composables
```
composables/useEnsayos.ts
```

### Componentes
```
components/ensayos/EnsayoTable.vue
components/ensayos/EnsayoForm.vue
components/ensayos/EnsayoDetail.vue
components/ensayos/DeleteConfirm.vue
```

### Páginas
```
pages/ensayos/index.vue
pages/ensayos/new.vue
pages/ensayos/[id].vue
pages/ensayos/[id]/edit.vue
```

### Documentación
```
docs/GUIA_ENSAYOS_CRUD.md
docs/STATUS_SESION_2.md
docs/PLAN_MAESTRO.md
docs/QUICK_REFERENCE.md (este archivo)
```

---

## 🚀 RUTAS DISPONIBLES

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/ensayos` | EnsayoTable | Listar ensayos |
| `/ensayos/new` | EnsayoForm | Crear nuevo |
| `/ensayos/:id` | EnsayoDetail | Ver detalle |
| `/ensayos/:id/edit` | EnsayoForm | Editar |

---

## 🔧 MÉTODOS PRINCIPALES

### Store: `useEnsayosStore()`

```typescript
// Fetch
ensayosStore.fetchEnsayos(params)        // GET lista
ensayosStore.fetchEnsayoById(id)         // GET detalle

// CRUD
ensayosStore.createEnsayo(data)          // POST crear
ensayosStore.updateEnsayo(id, data)      // PATCH editar
ensayosStore.deleteEnsayo(id)            // DELETE eliminar

// Limpieza
ensayosStore.clearError()                // Limpiar error
ensayosStore.clearCurrent()              // Limpiar actual

// State
ensayosStore.ensayos                     // Array de ensayos
ensayosStore.currentEnsayo               // Ensayo actual
ensayosStore.loading                     // Boolean cargando
ensayosStore.error                       // String error
ensayosStore.total                       // Total de registros
ensayosStore.currentPage                 // Página actual
ensayosStore.pageSize                    // Tamaño página
```

### Composable: `useEnsayos()`

```typescript
// Métodos
useEnsayos().fetchCultivos()             // Cargar cultivos
useEnsayos().fetchVariedades(id)         // Cargar variedades
useEnsayos().validateForm(data)          // Validar datos
useEnsayos().formatDateForInput(date)    // Para input[type=date]
useEnsayos().formatDateForDisplay(date)  // Para mostrar
useEnsayos().getCultivoById(id)          // Buscar cultivo
useEnsayos().getVariedadById(id)         // Buscar variedad

// State reactivo
useEnsayos().cultivos                    // Array cultivos
useEnsayos().variedades                  // Array variedades
useEnsayos().searchQuery                 // String búsqueda
useEnsayos().filteredEnsayos             // Ensayos filtrados
useEnsayos().loadingCultivos             // Boolean carga
```

---

## 💾 MODELO DE DATOS: Ensayo

```typescript
interface Ensayo {
  id?: string
  nombreEnsayo: string              // ⭐ Requerido
  versionProtocolo: string          // ⭐ Requerido
  responsable?: string
  provincia: string                 // ⭐ Requerido
  departamento: string              // ⭐ Requerido
  establecimiento?: string
  lote?: string
  latitud?: number
  longitud?: number
  cultivoEspecie: string            // ⭐ Requerido
  cultivoVariedad: string           // ⭐ Requerido
  tipoSiembra?: string
  distSurcosCm?: number
  fechaSiembra: string              // ⭐ Requerido (YYYY-MM-DD)
  createdAt?: string
  updatedAt?: string
}
```

---

## 📡 ENDPOINTS API

```
GET    /api/v1/ensayos?limit=10&page=1
GET    /api/v1/ensayos/:id
POST   /api/v1/ensayos
PATCH  /api/v1/ensayos/:id
DELETE /api/v1/ensayos/:id

GET    /api/v1/catalogos/cultivos
GET    /api/v1/catalogos/variedades?cultivoId=:id
```

---

## 🎨 COMPONENTES

### EnsayoTable.vue
Props:
- `ensayos: Ensayo[]` - Array de ensayos
- `loading: boolean` - Estado carga
- `currentPage: number` - Página actual
- `pageSize: number` - Tamaño página
- `total: number` - Total de registros

Emits:
- `@create` - Nuevo ensayo
- `@view(id)` - Ver detalle
- `@edit(id)` - Editar
- `@delete(id)` - Eliminar
- `@next-page` - Siguiente
- `@previous-page` - Anterior

---

### EnsayoForm.vue
Props:
- `initialData?: Ensayo` - Datos iniciales (edición)
- `isEditing?: boolean` - Modo edición

Emits:
- `@submit(data: Ensayo)` - Enviar formulario
- `@cancel` - Cancelar

---

### EnsayoDetail.vue
Props:
- `ensayo: Ensayo` - Datos del ensayo

Emits:
- `@edit` - Editar
- `@delete` - Eliminar
- `@back` - Volver

---

### DeleteConfirm.vue
Props:
- `isOpen: boolean` - Mostrar/ocultar
- `title?: string` - Título
- `message?: string` - Mensaje

Emits:
- `@confirm` - Confirmar eliminación
- `@cancel` - Cancelar

---

## 🎯 VALIDACIONES

```typescript
// En composable useEnsayos.validateForm()

Errores posibles:
- nombreEnsayo: vacío | > 255 chars
- versionProtocolo: vacío | > 20 chars
- provincia: vacío
- departamento: vacío
- cultivoEspecie: vacío
- cultivoVariedad: vacío
- fechaSiembra: vacío | formato inválido
```

---

## 📊 FLUJO DE DATOS

### Crear Ensayo

```
new.vue
  ↓
EnsayoForm
  ↓
handleSubmit()
  ↓
ensayosStore.createEnsayo()
  ↓
API POST /ensayos
  ↓
Respuesta OK
  ↓
navigateTo('/ensayos?success=...')
  ↓
index.vue muestra mensaje
```

### Editar Ensayo

```
[id]/edit.vue
  ↓
EnsayoForm (con initialData)
  ↓
handleSubmit()
  ↓
ensayosStore.updateEnsayo()
  ↓
API PATCH /ensayos/:id
  ↓
Respuesta OK
  ↓
navigateTo('/ensayos/:id?success=...')
  ↓
[id].vue muestra detalle actualizado
```

### Eliminar Ensayo

```
DeleteConfirm modal
  ↓
confirmDelete()
  ↓
ensayosStore.deleteEnsayo()
  ↓
API DELETE /ensayos/:id
  ↓
Respuesta OK
  ↓
navigateTo('/ensayos?success=...')
  ↓
index.vue actualiza lista
```

---

## 🧪 TESTING RÁPIDO

### 1. Listar
```
URL: http://localhost:3001/ensayos
Verifica:
✓ Se cargue tabla
✓ Se muestren ensayos (si existen)
✓ Búsqueda filtre resultados
✓ Paginación funcione
```

### 2. Crear
```
URL: http://localhost:3001/ensayos/new
Verifica:
✓ Se carguen cultivos
✓ Al elegir cultivo, carguen variedades
✓ Validación de campos requeridos
✓ Se guarde y redirija a listado
```

### 3. Ver Detalle
```
URL: http://localhost:3001/ensayos/:id
Verifica:
✓ Se carguen datos correctos
✓ Tabs cambien de contenido
✓ Botones Editar/Eliminar funcionen
```

### 4. Editar
```
URL: http://localhost:3001/ensayos/:id/edit
Verifica:
✓ Formulario pre-poblado
✓ Campos actualizables
✓ Se guarden cambios
✓ Se redirija a detalle
```

### 5. Eliminar
```
En tabla o detalle, click Eliminar
Verifica:
✓ Aparezca diálogo confirmación
✓ Cancelar cierre sin eliminar
✓ Confirmar elimine de BD
✓ Se actualice lista
```

---

## ⚠️ ERRORES COMUNES

### Error: "Could not load module"
**Solución**: Verificar ruta de import correcta

### Error: "API 401 Unauthorized"
**Solución**: Verificar token en localStorage

### Error: "Cultivos no cargan"
**Solución**: Verificar endpoint en Swagger funciona

### Error: "Validación no funciona"
**Solución**: Revisar useEnsayos().validateForm()

---

## 🔄 DEBUGGING

### Ver estado en DevTools
```javascript
// En console del navegador
const ensayosStore = useEnsayosStore()
console.log(ensayosStore.ensayos)
console.log(ensayosStore.loading)
console.log(ensayosStore.error)
```

### Ver API calls
```javascript
// En Network tab del navegador
// Filtrar por /api/
// Ver request/response
```

### Ver errores
```javascript
// En console
// Buscar mensajes rojos de error
// Leer stack trace
```

---

## 📖 DOCUMENTACIÓN COMPLETA

- **GUIA_ENSAYOS_CRUD.md** - Guía detallada
- **STATUS_SESION_2.md** - Estado actual
- **PLAN_MAESTRO.md** - Roadmap completo
- **API_DOCUMENTATION.md** - Backend (en /tms-backend/docs/)
- **Swagger**: http://localhost:3000/docs

---

## 🎯 COMANDOS ÚTILES

### Docker
```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f client-vue

# Detener
docker-compose down

# Reconstruir
docker-compose up -d --build
```

### npm (dentro del contenedor)
```bash
npm install          # Instalar dependencias
npm run dev          # Iniciar dev
npm run build        # Build producción
npm run lint         # Linting
npm run test         # Testing
```

---

## 💡 TIPS

1. **Sempre revisar error en console** - Ahí está la respuesta
2. **Usar Swagger para probar endpoints** - Antes de integrar
3. **Postman para debugging API** - Más fácil que browser
4. **Componentes reutilizables** - No duplicar código
5. **Props tipadas** - TypeScript ayuda mucho

---

## 🚀 PRÓXIMA SESIÓN

Sesión 3: CRUD de Tratamientos

**Plan**: Crear almacenamiento y gestión de tratamientos

**Documentos**:
- PLAN_MAESTRO.md (roadmap)
- API_DOCUMENTATION.md (nuevos endpoints)

---

**¡Referencia rápida lista! 🚀**

