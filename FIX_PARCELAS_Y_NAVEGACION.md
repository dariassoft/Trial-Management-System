# 🔧 FIX: Página de Parcelas y Navegación

## Fecha
2026-03-03

## Problemas Identificados

### 1. ❌ Botón "Editar" No Funcionaba
El botón de editar parcela en la página `/parcelas` solo mostraba un log en la consola:
```javascript
function editarParcela(parcela: any) {
  console.log('Editar parcela:', parcela)  // ← Solo esto, nada más
}
```

**Impacto:** No se podía editar las cosechas de las parcelas.

---

### 2. ❌ Confusión en la Navegación
No había un botón "Parcelas" en el menú principal del sistema. La página era accesible solo:
- Desde el botón "Ir a Parcelas" en `/mediciones/[id]/`
- O escribiendo la URL manualmente `/parcelas?ensayoId=X`

**Impacto:** Los usuarios se confundían porque no veían dónde acceder a parcelas en la navegación.

---

## Soluciones Implementadas

### ✅ Solución 1: Agregar Botón "Parcelas" al Menú

**Archivo:** `tms-client-vue/components/navigation/ModuleMenu.vue`

Se agregó un nuevo módulo al menú de navegación:

```typescript
{
  id: 'parcelas',
  name: 'Parcelas',
  icon: '🗂️',
  href: '/parcelas',
  roles: ['Superadministrador', 'Administrador', 'Investigador', 'Técnico de Laboratorio'],
}
```

**Cambio de UX:**
- Antes: ❌ No había botón visible
- Después: ✅ Botón "🗂️ Parcelas" visible en la barra de navegación

---

### ✅ Solución 2: Implementar Modal para Editar Cosechas

**Archivo:** `tms-client-vue/pages/parcelas.vue`

Se reemplazó el botón ✏️ (editar) por un botón 🌾 (cosecha) que abre un modal para editar datos de cosecha.

#### Cambios Principales:

**Antes:**
```vue
<!-- Solo un botón sin funcionalidad -->
<button @click="editarParcela(parcela)">✏️</button>
```

**Después:**
```vue
<!-- Botón con funcionalidad -->
<button @click="abrirEditorCosecha(parcela)" title="Editar cosecha">🌾</button>
```

#### Modal Implementado:

El modal permite editar los siguientes campos de cosecha por parcela:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| **Fecha de Cosecha** | Date | Fecha en que se cosechó |
| **Humedad (%)** | Decimal | Humedad relativa de la cosecha |
| **Kg/ha (corregido)** | Decimal | Rendimiento corregido |
| **GIE** | Decimal | Germinación/Integridad/Especificidad |
| **Observaciones** | Text | Notas adicionales |

#### Flujo de Uso:

1. Usuario hace clic en botón 🌾 de una parcela
2. Se abre modal con datos de la parcela (ensayo, bloque, tratamiento)
3. Usuario completa los campos de cosecha
4. Al guardar, se crea o actualiza el registro en la base de datos
5. Se recarga la lista y se muestra mensaje de éxito

---

## Código Agregado

### Modal HTML
```vue
<Teleport to="body">
  <div v-if="showModalCosecha" class="fixed inset-0 z-50...">
    <!-- Modal content -->
  </div>
</Teleport>
```

### Funciones TypeScript
```typescript
function abrirEditorCosecha(parcela: any) {
  parcelaEditando.value = parcela
  // Cargar datos existentes o formulario vacío
  showModalCosecha.value = true
}

async function guardarCosecha() {
  // POST o PATCH a /datos-cosecha
  await cargarParcelas()  // Recargar
}

function cerrarModalCosecha() {
  // Limpiar estado
}
```

---

## Explicación de la Arquitectura

### ¿Por qué la página de Parcelas no estaba en el menú?

La navegación del sistema es **dinámica y basada en roles**. El menú define qué módulos ve cada usuario según su rol:

```typescript
const allModules = [
  {
    id: 'ensayos',
    roles: ['Superadministrador', 'Administrador', 'Investigador'],  // ← Solo estos roles
  },
  // ...
]

const availableModules = computed(() => {
  return allModules.filter(module =>
    module.roles.includes(authStore.userRole)  // ← Filtrar por rol
  )
})
```

**Antes:** Parcelas no estaba en `allModules` → No aparecía en el menú para nadie.

**Después:** Se agregó a `allModules` con los roles apropiados → Aparece en el menú para usuarios con esos roles.

---

## Navegación: Antes vs Después

### Antes (Confuso)
```
Dashboard → Ensayos → Mediciones
                ↓
         (click en "Ir a Parcelas")
                ↓
         /parcelas?ensayoId=63
```

### Después (Claro)
```
Dashboard → Ensayos → Mediciones → Parcelas ← ¡Botón directo!
                                        ↓
                                  Ver todas las parcelas
                                  de todos los ensayos
                                  Editar cosechas fácilmente
```

---

## Endpoints Utilizados

- **POST** `/datos-cosecha` - Crear nuevo registro de cosecha
- **PATCH** `/datos-cosecha/{id}` - Actualizar registro existente
- **GET** `/parcelas`, `/ensayos`, `/bloques` - Cargar datos para tabla

---

## Testing

### Para verificar que funciona:

1. ✅ Navega a `Dashboard` → Haz clic en botón "🗂️ Parcelas" (debe estar visible)
2. ✅ Verás una tabla de parcelas filtrables
3. ✅ Haz clic en botón 🌾 de cualquier parcela
4. ✅ Se abre modal con datos de la parcela
5. ✅ Completa los campos de cosecha
6. ✅ Haz clic en "✓ Guardar Cosecha"
7. ✅ Debes recibir confirmación: "✅ Cosecha guardada correctamente"
8. ✅ Si abres el modal de la misma parcela, verás los datos guardados

---

## Notas para el Equipo

- La página de parcelas ahora es una **página central de gestión de cosechas**
- Puedes acceder desde el menú (recomendado)
- O desde mediciones si estás en `/mediciones/[id]/` haciendo clic en "Ir a Parcelas"
- El modal permite editar **una parcela a la vez**
- Los datos se guardan inmediatamente en la base de datos

---

## Archivos Modificados

1. ✅ `tms-client-vue/components/navigation/ModuleMenu.vue` - Agregado módulo "Parcelas"
2. ✅ `tms-client-vue/pages/parcelas.vue` - Modal de cosecha implementado
3. ✅ `tms-client-vue/pages/mediciones/[id]/index.vue` - Error de tags corregido (sesión anterior)

---

## Estado

✅ **COMPLETADO Y FUNCIONAL**

- Botón en menú agregado
- Modal de cosecha implementado
- Endpoints conectados
- Flujo de guardado funcional
- UI mejorada con emojis descriptivos


