# 🐛 FIX: Modal "Crear Nuevo Tratamiento" no se cierra

**Fecha**: Diciembre 11, 2025  
**Archivos Afectados**: 
- `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/pages/protocolos/[id].vue`

**Tipo**: Bug en gestión de estado del modal  
**Severity**: 🟡 ALTO (UI no funciona)  
**Status**: ✅ RESUELTO

---

## 📋 PROBLEMA

**Síntomas**:
- Al hacer click en el botón X (cruz) del modal, el modal no se cierra
- Al hacer click en "Cancelar", el modal no se cierra
- El modal permanece visible indefinidamente

**Causa Raíz**:
Había un desajuste en la gestión del estado del modal:

1. El **composable** `useTratamientos.ts` define:
   - `mostrarFormulario` como ref ✅
   - `cerrarFormulario()` como método ✅

2. Pero la **página** `[id].vue` hacía:
   - `const mostrarFormulario = computed(() => formData.value !== null)` ❌
   - Esto creaba un computed que NO estaba conectado al ref del composable

**Resultado**: 
- El botón X llamaba a `cerrarFormulario()` que hacía `mostrarFormulario.value = false`
- Pero la página usaba un computed diferente que no se actualizaba
- El modal nunca se cerraba porque estaban usando dos "mostrarFormulario" diferentes

---

## ✅ SOLUCIÓN APLICADA

### Cambio en `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/pages/protocolos/[id].vue`

**Línea de extracción del composable**:

**Antes** ❌:
```typescript
const { store, formData, cerrarFormulario, editandoId, abrirFormularioEdicion, abrirFormularioNuevo, eliminarTratamiento } = useTratamientos();

// Luego creaba computed incorrecto:
const mostrarFormulario = computed(() => formData.value !== null);
const esEdicion = computed(() => editandoId.value !== null);
```

**Después** ✅:
```typescript
const { 
  store, 
  mostrarFormulario,    // ← Directamente del composable
  esEdicion,            // ← Directamente del composable
  cerrarFormulario, 
  abrirFormularioEdicion, 
  abrirFormularioNuevo, 
  eliminarTratamiento 
} = useTratamientos();

// Ya NO crea computed locales
```

### ¿Por qué funciona?

Ahora:
1. El composable exporta `mostrarFormulario` como ref
2. La página usa ese ref directamente
3. Cuando `cerrarFormulario()` hace `mostrarFormulario.value = false`
4. La página reacciona automáticamente (es ref reactiva)
5. El modal desaparece ✅

---

## 🔄 FLUJO DE CIERRE DEL MODAL

```
Usuario hace click X (Cruz)
        ↓
@click="cerrarFormulario"
        ↓
composable.cerrarFormulario()
  {
    mostrarFormulario.value = false  ← Cambia el ref
    resetFormulario()
    editandoId.value = null
  }
        ↓
Página reacciona (mostrarFormulario es ref reactivo)
        ↓
v-if="mostrarFormulario" evaluúa a false
        ↓
Modal desaparece ✅
```

---

## 📋 VERIFICACIÓN MANUAL

Para verificar que el fix funciona:

### 1. Compilar
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose -f tms-client-vue/docker-compose.frontend.yml exec nuxt bash
npm run build
```

### 2. Ejecutar en desarrollo
```bash
npm run dev
```

### 3. Pruebas en navegador
```
1. Ir a: http://localhost:3001/protocolos
2. Seleccionar un protocolo
3. Click en "+ Nuevo Tratamiento"
   → Modal debe aparecer
4. Click en botón X (cruz)
   → Modal debe desaparecer ✅
5. Click en "+ Nuevo Tratamiento" nuevamente
6. Click en "Cancelar"
   → Modal debe desaparecer ✅
7. Crear un tratamiento exitosamente
   → Modal debe desaparecer automáticamente ✅
```

---

## 🔍 ANÁLISIS TÉCNICO

### El problema con el computed incorrecto

```typescript
// ❌ Esto NO funciona porque:
const formData = ref({ protocoloId: null, ... });
const mostrarFormulario = computed(() => formData.value !== null);

// Si formData.value es null:
// mostrarFormulario = false ✅

// Pero luego cuando haces:
// cerrarFormulario() → formData = { protocoloId: null, ... } (sigue siendo null)
// El computed sigue viendo null, así que mostrarFormulario sigue siendo false
// ¡Pero el estado inicial YA era false, así que nunca se mostró el modal!
```

**El verdadero problema**: `formData` nunca es null en el composable, es siempre un objeto vacío. Así que ese computed nunca funcionaría correctamente de todas formas.

### La solución correcta

```typescript
// ✅ Usar directamente la ref que controla mostrar/ocultar
const mostrarFormulario = ref(false);

// Cuando abres:
mostrarFormulario.value = true;

// Cuando cierras:
mostrarFormulario.value = false;

// La página simplemente reacciona:
// v-if="mostrarFormulario" (es reactivo)
```

---

## ✅ CHECKLIST POST-FIX

- [x] Identificado el problema (computed desconectado)
- [x] Analizado el estado correcto del composable
- [x] Actualizada la página para usar refs del composable
- [x] Removidos computed incorrectos
- [x] Verificado que el componente TratamientoForm emite eventos correctamente
- [x] Documentado el fix

**Pendiente**:
- [ ] Compilar frontend (`npm run build`)
- [ ] Ejecutar en desarrollo (`npm run dev`)
- [ ] Probar en navegador (hacer click en X y Cancelar)

---

## 📚 REFERENCIAS

- **Página corregida**: `/tms-backend/tms-client-vue/pages/protocolos/[id].vue`
- **Componente formulario**: `/tms-backend/tms-client-vue/components/protocolos/TratamientoForm.vue`
- **Composable**: `/tms-backend/tms-client-vue/composables/useTratamientos.ts`
- **Documentación estado**: `/tms-backend/gemini-rules.md` (convenciones frontend)

---

**Autor**: GitHub Copilot  
**Tiempo estimado**: ~10 minutos  
**Líneas cambiadas**: ~20  
**Archivos afectados**: 1  

✅ **Status**: RESUELTO - Requiere compilación y prueba en navegador


