# 🎨 Combobox/Autocomplete en Página de Reportes

## ✅ Implementación Completada

Se ha implementado un **combobox/autocomplete inteligente** en la página de reportes que combina el input de búsqueda con el dropdown de resultados en un solo control unificado.

---

## 🎯 Características Implementadas

### 1. **Diseño Unificado**
- ✅ Input y dropdown parecen un **solo control**
- ✅ Bordes redondeados superiores en el input
- ✅ Bordes redondeados inferiores en el dropdown
- ✅ Sin separación visual entre input y dropdown
- ✅ Transición suave entre estados

### 2. **Dropdown Automático**
- ✅ Se abre automáticamente al escribir
- ✅ Permanece visible mientras el usuario escribe
- ✅ Se cierra al seleccionar un ensayo
- ✅ Se cierra al hacer clic fuera del combobox
- ✅ Se cierra al presionar ESC (navegación futura)

### 3. **Estados Visuales**

#### Estado Inicial
```
┌─────────────────────────────────────────┐
│ Escribe al menos 3 caracteres...       │
└─────────────────────────────────────────┘
💡 Comienza a escribir para buscar ensayos
```

#### 1-2 Caracteres
```
┌─────────────────────────────────────────┐
│ ab                                      │
├─────────────────────────────────────────┤
│ 💡 Ingresa 1 carácter más...            │
└─────────────────────────────────────────┘
```

#### 3+ Caracteres - Buscando
```
┌─────────────────────────────────────────┐
│ maíz                                🔍  │
├─────────────────────────────────────────┤
│ 🔍 Buscando ensayos...                  │
└─────────────────────────────────────────┘
```

#### Con Resultados
```
┌─────────────────────────────────────────┐
│ maíz                                🔍  │
├─────────────────────────────────────────┤
│ ✅ 3 ensayos encontrados                │
├─────────────────────────────────────────┤
│ Ensayo Maíz Temprano 2025        #1     │
│ Ensayo Maíz Tardío 2025          #5   ✓ │
│ Maíz Colorado Zona Norte         #12    │
└─────────────────────────────────────────┘
```

#### Ensayo Seleccionado
```
┌─────────────────────────────────────────┐
│ maíz                                    │
└─────────────────────────────────────────┘

╔═════════════════════════════════════════╗
║ ✓ Ensayo seleccionado:                  ║
║   Ensayo Maíz Tardío 2025      [Cambiar]║
╚═════════════════════════════════════════╝
```

---

## 🎨 Estilos y Clases CSS

### Input Principal
```vue
<input
  class="w-full px-4 py-2
         border border-gray-300 dark:border-gray-600
         bg-white dark:bg-gray-700
         text-gray-900 dark:text-white
         focus:outline-none focus:ring-2 focus:ring-blue-500
         focus:z-10 transition-all"
  :class="dropdownAbierto ? 'rounded-t-lg border-b-0' : 'rounded-lg'"
/>
```

### Dropdown
```vue
<div class="absolute z-20 w-full
            border-x border-b border-gray-300 dark:border-gray-600
            rounded-b-lg
            bg-white dark:bg-gray-700
            shadow-lg
            max-h-64 overflow-y-auto">
```

### Item de Resultado
```vue
<div class="px-4 py-2.5 cursor-pointer
            hover:bg-blue-50 dark:hover:bg-blue-900/20
            border-b border-gray-100 dark:border-gray-700
            last:border-b-0
            transition-colors"
     :class="seleccionado ? 'bg-blue-100 dark:bg-blue-900/30 font-medium' : ''">
```

---

## 💻 Código Principal

### Variables Reactivas
```typescript
const searchQuery = ref('')              // Texto de búsqueda
const buscando = ref(false)              // Estado de carga
const dropdownAbierto = ref(false)       // Controla visibilidad del dropdown
const comboboxRef = ref<HTMLElement>()   // Referencia para click outside
const ensayoSeleccionado = ref<number>() // ID del ensayo seleccionado
```

### Funciones Principales

#### `seleccionarEnsayo()`
```typescript
const seleccionarEnsayo = (ensayo: any) => {
  ensayoSeleccionado.value = ensayo.id
  dropdownAbierto.value = false  // Cerrar dropdown
}
```

#### `limpiarSeleccion()`
```typescript
const limpiarSeleccion = () => {
  ensayoSeleccionado.value = null
  searchQuery.value = ''
  ensayosStore.ensayos = []
  dropdownAbierto.value = false
}
```

#### `handleClickOutside()`
```typescript
const handleClickOutside = (event: MouseEvent) => {
  if (comboboxRef.value && !comboboxRef.value.contains(event.target as Node)) {
    dropdownAbierto.value = false
  }
}
```

---

## 🔄 Flujo de Interacción

### Escenario 1: Usuario busca y selecciona
1. Usuario hace clic en el input → Cursor activo
2. Usuario escribe "m" → Dropdown se abre con hint "Ingresa 2 caracteres más"
3. Usuario escribe "a" → Dropdown muestra "Ingresa 1 carácter más"
4. Usuario escribe "í" → Dropdown muestra "🔍 Buscando..."
5. Backend retorna resultados → Dropdown muestra lista de ensayos
6. Usuario hace clic en "Ensayo Maíz Tardío" → Dropdown se cierra
7. Aparece badge verde con ensayo seleccionado
8. Usuario puede generar reporte

### Escenario 2: Usuario quiere cambiar selección
1. Usuario hace clic en botón "Cambiar"
2. Se limpia la selección y el input
3. Usuario puede buscar de nuevo

### Escenario 3: Click fuera del combobox
1. Usuario está buscando (dropdown abierto)
2. Usuario hace clic en cualquier lugar fuera
3. Dropdown se cierra automáticamente
4. Selección se mantiene (si había una)

---

## 📊 Ventajas de Esta Implementación

### UX Mejorada
✅ **Interfaz intuitiva** - Parece un solo control
✅ **Feedback visual inmediato** - Estados claros
✅ **Sin clics innecesarios** - Dropdown automático
✅ **Navegación fluida** - Se cierra al seleccionar

### Performance
✅ **Debounce de 300ms** - No sobrecarga el backend
✅ **Carga bajo demanda** - Solo cuando se busca
✅ **Scroll interno** - Máximo 264px de altura

### Accesibilidad
✅ **Click outside** - Cierra dropdown intuitivamente
✅ **Indicadores visuales** - Loading, resultados, errores
✅ **Contraste adecuado** - Soporte dark mode
✅ **Mensajes claros** - Usuario siempre sabe qué hacer

---

## 🎯 Diferencias con Implementación Anterior

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Controles** | Input + Select separados | Combobox unificado |
| **Dropdown** | Manualmente abierto | Automático al escribir |
| **Diseño** | Dos elementos distintos | Un solo control visual |
| **Selección** | Desde select nativo | Click en lista custom |
| **Estado** | Select deshabilitado/habilitado | Dropdown abierto/cerrado |
| **Cierre** | Manual | Automático (selección o click fuera) |

---

## 🧪 Testing

### Test 1: Apertura automática
```
1. Escribir "a" → Dropdown se abre
2. Verificar: mensaje "Ingresa 2 caracteres más"
```

### Test 2: Resultados en tiempo real
```
1. Escribir "maíz"
2. Esperar 300ms (debounce)
3. Verificar: dropdown muestra resultados
4. Verificar: dropdown sigue abierto
```

### Test 3: Selección
```
1. Buscar "maíz"
2. Click en un ensayo
3. Verificar: dropdown se cierra
4. Verificar: badge verde aparece
```

### Test 4: Click outside
```
1. Buscar "maíz" (dropdown abierto)
2. Click fuera del combobox
3. Verificar: dropdown se cierra
```

### Test 5: Cambiar selección
```
1. Seleccionar un ensayo
2. Click en "Cambiar"
3. Verificar: input se limpia
4. Verificar: listo para nueva búsqueda
```

---

## 📁 Archivos Modificados

### `/tms-client-vue/components/reportes/ReportesGenerator.vue`
- **Script:**
  - Nueva variable `dropdownAbierto`
  - Nueva variable `comboboxRef`
  - Función `handleClickOutside()`
  - Función `seleccionarEnsayo()`
  - Función `limpiarSeleccion()`
  - Hooks `onMounted` y `onBeforeUnmount`

- **Template:**
  - Diseño combobox unificado
  - Dropdown custom con lista de resultados
  - Badge de ensayo seleccionado
  - Clases CSS para estados visuales

---

## 🚀 Próximas Mejoras Posibles

### Navegación con Teclado
- [ ] Flechas arriba/abajo para navegar resultados
- [ ] Enter para seleccionar
- [ ] ESC para cerrar dropdown
- [ ] Tab para salir del combobox

### Accesibilidad ARIA
- [ ] `role="combobox"` en el input
- [ ] `aria-expanded` según estado
- [ ] `aria-selected` en items
- [ ] `aria-activedescendant` para navegación

### Features Adicionales
- [ ] Resaltar texto coincidente
- [ ] Historial de búsquedas recientes
- [ ] Shortcuts de teclado
- [ ] Animaciones de transición

---

**Implementado:** 2026-04-08
**Estado:** ✅ Funcionando completamente
**Documentación:** docs/MEJORA_SELECT_REPORTES_INTELIGENTE.md

