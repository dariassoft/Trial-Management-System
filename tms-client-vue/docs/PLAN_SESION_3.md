# 📝 PLAN SESIÓN 3 - CRUD TRATAMIENTOS

**Fecha Prevista**: Próxima sesión  
**Objetivo**: Crear funcionalidad completa de CRUD para Tratamientos  
**Duración Estimada**: 2-3 horas  
**Status**: ⏳ Pendiente de inicio

---

## 🎯 OBJETIVO PRINCIPAL

Crear una pantalla completa donde usuarios puedan:
1. ✅ **Ver lista** de tratamientos (tabla con paginación)
2. ✅ **Crear** nuevo tratamiento (formulario con productos)
3. ✅ **Ver detalles** de un tratamiento
4. ✅ **Editar** tratamiento existente
5. ✅ **Eliminar** tratamiento con confirmación

---

## 📊 DIFERENCIA CON ENSAYOS

### Ensayos (Sesión 2)
```
Campos simples:
- Texto (nombre, versión, responsable, etc.)
- Números (latitud, longitud, distancia)
- Fecha (fecha siembra)
- Selects (cultivo, variedad)
```

### Tratamientos (Sesión 3)
```
Campos con relaciones:
- Producto (select con lista de productos)
- Dosis (número + unidad)
- Momento de aplicación (select)
- Comentarios (texto)
- Múltiples productos por tratamiento

Complejidad: MAYOR
```

---

## 📋 DETALLE TÉCNICO

### Modelo de Datos: Tratamiento

```typescript
interface Tratamiento {
  id?: string
  nombreTratamiento: string     // Requerido
  descripcion?: string
  ensayoId: string              // Requerido (FK)
  productos: ProductoAplicado[]  // Requerido (relación)
  momentoAplicacion?: string
  observaciones?: string
  createdAt?: string
  updatedAt?: string
}

interface ProductoAplicado {
  id?: string
  productoId: string            // Requerido (FK)
  dosis: number                 // Requerido
  unidad: string                // Requerido (ml, kg, L, etc.)
  tratamientoId?: string
}
```

---

## 🏗️ ESTRUCTURA DE ARCHIVOS A CREAR

```
tms-client-vue/

stores/
└── tratamientos.ts             # Pinia store CRUD

composables/
└── useTratamientos.ts          # Utilidades y validación

components/tratamientos/
├── TratamientoTable.vue        # Tabla listado
├── TratamientoForm.vue         # Formulario crear/editar
├── TratamientoDetail.vue       # Detalle
├── ProductoRow.vue             # Fila de producto agregado
└── DeleteConfirm.vue           # (Reutilizable)

pages/tratamientos/
├── index.vue                   # Listado
├── new.vue                     # Crear
├── [id].vue                    # Detalle
└── [id]/
    └── edit.vue                # Editar

docs/
└── GUIA_TRATAMIENTOS_CRUD.md   # Documentación
```

---

## 🔗 API ENDPOINTS

```
GET    /api/v1/tratamientos              # Listar
GET    /api/v1/tratamientos/:id          # Obtener
POST   /api/v1/tratamientos              # Crear
PATCH  /api/v1/tratamientos/:id          # Actualizar
DELETE /api/v1/tratamientos/:id          # Eliminar

GET    /api/v1/productos                 # Catálogo productos
GET    /api/v1/ensayos/:id/tratamientos # Tratamientos de un ensayo
```

---

## 🎨 PANTALLA: Listar Tratamientos

**Ruta**: `/tratamientos`

**Componentes**:
- Tabla responsive
- Búsqueda por nombre
- Filtro por ensayo
- Paginación (limit, page)
- Botón "Nuevo Tratamiento"
- Acciones por fila (Ver, Editar, Eliminar)

**Datos a mostrar**:
- ID
- Nombre
- Ensayo asociado
- Cantidad de productos
- Fecha de creación
- Acciones

---

## 🎨 PANTALLA: Nuevo Tratamiento

**Ruta**: `/tratamientos/new`

**Formulario**:
```
┌─────────────────────────────────────┐
│ CREAR NUEVO TRATAMIENTO             │
├─────────────────────────────────────┤
│                                     │
│ Nombre *              [___________]│
│ Ensayo *              [Dropdown  ▼]│
│ Momento Aplicación    [___________]│
│ Observaciones         [Textarea  ▼]│
│                                     │
│ --- PRODUCTOS ---                  │
│ [+ Agregar Producto]               │
│                                     │
│ Productos Agregados:               │
│ ┌─────────────────────────────────┐│
│ │ Producto | Dosis | Unidad | ✕  ││
│ ├─────────────────────────────────┤│
│ │ Producto 1 | 2.5 | ml | [x]    ││
│ │ Producto 2 | 1.0 | kg | [x]    ││
│ └─────────────────────────────────┘│
│                                     │
│ [Cancelar]  [Crear Tratamiento]    │
└─────────────────────────────────────┘
```

**Validaciones**:
- Nombre: requerido, max 255
- Ensayo: requerido
- Productos: mínimo 1 requerido
- Dosis: número requerido, positivo
- Unidad: requerida

---

## 🧪 TESTING MANUAL

### Checklist de Pruebas
- [ ] Login funciona
- [ ] Página de tratamientos carga correctamente
- [ ] Tabla muestra datos de BD
- [ ] Búsqueda filtra correctamente
- [ ] Paginación funciona
- [ ] Botón "Nuevo" abre formulario
- [ ] Validaciones del formulario funcionan
- [ ] Agregar productos funciona
- [ ] Remover productos funciona
- [ ] Crear tratamiento guarda en BD
- [ ] Ver detalle muestra información correcta
- [ ] Editar tratamiento actualiza datos
- [ ] Eliminar muestra confirmación
- [ ] Eliminar realmente borra de BD
- [ ] Errores muestran mensajes claros
- [ ] Responsivo en mobile

---

## 📊 PATRÓN A SEGUIR

**Utilizar EXACTAMENTE el mismo patrón que Sesión 2 (Ensayos)**:

1. **Store Pinia** - Estructura idéntica a ensayos.ts
2. **Composable** - Mismos métodos pero para tratamientos
3. **Componentes** - Mismo diseño UI que ensayos
4. **Páginas** - Misma estructura de rutas
5. **Documentación** - Mismo formato

**Diferencia única**: Relación con productos (más compleja)

---

## 🚀 PASOS EJECUCIÓN

1. **Análisis** (15 min)
   - Revisar plan
   - Revisar Swagger para endpoints
   - Entender relación con productos

2. **Store y Composables** (30 min)
   - Crear stores/tratamientos.ts
   - Crear composables/useTratamientos.ts
   - Copiar patrón de ensayos

3. **Componentes** (60 min)
   - TratamientoTable.vue
   - TratamientoForm.vue
   - TratamientoDetail.vue
   - ProductoRow.vue

4. **Páginas** (30 min)
   - pages/tratamientos/index.vue
   - pages/tratamientos/new.vue
   - pages/tratamientos/[id].vue
   - pages/tratamientos/[id]/edit.vue

5. **Testing** (30 min)
   - Testing manual completo
   - Verificar funcionalidades
   - Responsive design

6. **Documentación** (30 min)
   - GUIA_TRATAMIENTOS_CRUD.md
   - STATUS_SESION_3.md
   - QUICK_REFERENCE_SESION_3.md

---

## 📚 REFERENCIAS

- Backend: `/tms-backend/docs/API_DOCUMENTATION.md`
- Swagger: `http://localhost:3000/docs`
- Sesión 2: `/tms-client-vue/docs/GUIA_ENSAYOS_CRUD.md`
- Sesión 2: `/tms-client-vue/docs/QUICK_REFERENCE_SESION_2.md`

---

## ✅ CHECKLIST ANTES DE EMPEZAR

- [ ] Revisar documentación de Sesión 2
- [ ] Revisar archivos de Sesión 2 (estructura)
- [ ] Revisar endpoints en Swagger
- [ ] Entender relación Tratamiento-Producto
- [ ] Tener backend corriendo
- [ ] Tener frontend corriendo

---

## 🎯 DIFERENCIAS CLAVE CON SESIÓN 2

| Aspecto | Ensayos | Tratamientos |
|--------|---------|--------------|
| Campos | Simples | Con relación |
| Productos | N/A | Múltiples |
| Formulario | Estándar | Dinámico (agregar/quitar) |
| Complejidad | Media | Media-Alta |
| Tablas BD | 1 | 2+ |
| Testing | 12 tests | Similar |

---

## 💡 TIPS IMPORTANTES

1. **Reutiliza código**: 80% igual a Ensayos
2. **Patrón de productos**: Array dinámico
3. **Validación**: Asegura mínimo 1 producto
4. **API**: Espera respuesta anidada con productos
5. **Formulario**: Usa componente ProductoRow reutilizable

---

## 🚀 DESPUÉS DE SESIÓN 3

**Sesión 4**: Diseño Experimental
- Crear bloques
- Crear parcelas
- Asignar tratamientos a parcelas
- Visualización de diseño

---

## 📞 REFERENCIAS RÁPIDAS

### Archivos a copiar/adaptar
```
stores/ensayos.ts          → stores/tratamientos.ts
composables/useEnsayos.ts  → composables/useTratamientos.ts
components/ensayos/*.vue   → components/tratamientos/*.vue
pages/ensayos/*.vue        → pages/tratamientos/*.vue
```

### Endpoints a usar
```
GET    /api/v1/tratamientos?limit=10&page=1
GET    /api/v1/tratamientos/:id
POST   /api/v1/tratamientos
PATCH  /api/v1/tratamientos/:id
DELETE /api/v1/tratamientos/:id
GET    /api/v1/productos
```

---

**¡LISTO PARA SESIÓN 3!** 🚀

Cuando empieces, sigue exactamente el patrón de Sesión 2, pero adaptando para la complejidad de productos.

