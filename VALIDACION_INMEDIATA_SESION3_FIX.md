# ✅ VALIDACIÓN INMEDIATA - Sesión 3 Fix v-if/v-else

## 🚀 PASOS PARA VERIFICAR QUE TODO FUNCIONA

**IMPORTANTE**: Todos los comandos ejecutar en Docker, DESDE LA RAÍZ DEL PROYECTO

### 1️⃣ Ubicación Correcta

```bash
# 📍 UBICARSE AQUÍ:
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# ❌ NO aquí:
# cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
```

### 2️⃣ Verificar que los servicios están corriendo

```bash
# Ver estado de contenedores
docker-compose -f tms-backend/docker-compose.yml ps
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml ps

# Esperado:
# app    (backend)  → STATUS: Up
# nuxt   (frontend) → STATUS: Up
```

### 3️⃣ Entrar al contenedor FRONTEND y recompilar

```bash
# Entrar al contenedor frontend
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml exec nuxt bash

# Dentro del contenedor (bash interactivo):
npm run dev
```

**Esperado**:
```
NUXT v3.x.x ready in xxx ms

➜  Local:    http://localhost:3001/
➜  Binding to all addresses with --host
```

**Si ves errores**: Revisar la sección "Troubleshooting" abajo

### 4️⃣ Verificar en navegador

Abre: **http://localhost:3001/protocolos**

**Checklist**:
- [ ] Página carga sin errores en consola
- [ ] Se ve el título "Protocolos"
- [ ] Se ve el botón "+ Nuevo Protocolo"
- [ ] Se ve la barra de búsqueda y filtros
- [ ] Si hay protocolos:
  - [ ] Desktop (>1024px): Se ve tabla
  - [ ] Mobile (<768px): Se ve tarjetas
  - [ ] No hay mensaje de error
- [ ] Si NO hay protocolos: Se ve mensaje "No hay protocolos disponibles"

### 5️⃣ Testing CRUD

**Crear nuevo protocolo:**
1. Click en "+ Nuevo Protocolo"
2. Completar nombre (ej: "Protocolo Test")
3. Completar descripción (opcional)
4. Click "Crear"
5. **Esperado**: Se cierra modal, aparece protocolo en listado

**Editar protocolo:**
1. Click en "Editar" en un protocolo
2. Cambiar algún campo
3. Click "Actualizar"
4. **Esperado**: Modal se cierra, cambios visibles

**Eliminar protocolo:**
1. Click en "Eliminar"
2. Confirmar en alert
3. **Esperado**: Protocolo desaparece

**Búsqueda:**
1. Escribir en campo búsqueda
2. Click "Buscar" o presionar Enter
3. **Esperado**: Resultados filtrados

---

## 🔧 TROUBLESHOOTING

### Error: `v-else/v-else-if has no adjacent v-if`
**Status**: ✅ FIXED en este update

Si sigue apareciendo:
- Revisa que el archivo `ProtocoloList.vue` fue reemplazado correctamente
- Ejecuta `npm run dev` nuevamente (fuerza recompilación)

### Error: `$fetch is not a function`
**Ubicación**: En los stores o composables

**Solución**:
- Revisar que `useApi()` está importado en `stores/protocolos.ts`
- Verificar que `useApi.ts` existe en `composables/`
- Ejecutar `npm install` nuevamente dentro del contenedor

### Error: No se conecta a backend (http://localhost:3000)
**Solución**:
```bash
# Verificar que backend está corriendo
docker-compose -f tms-backend/docker-compose.yml logs app

# Si no está corriendo:
docker-compose -f tms-backend/docker-compose.yml up -d app
docker-compose -f tms-backend/docker-compose.yml logs app
```

### Error: Puerto 3001 ya en uso
```bash
# Matar proceso en el puerto
lsof -i :3001  # Ver qué está usando el puerto
kill -9 <PID>  # Matar ese proceso

# O reiniciar el contenedor
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml restart nuxt
```

### Error: `npm: command not found` dentro del contenedor
**Solución**:
```bash
# El contenedor debe tener node/npm instalado
# Verificar en Dockerfile

# Si el contenedor está corrupto:
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml down
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml build --no-cache
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml up -d
```

---

## 📊 QUÉ CAMBIÓ EN ESTE FIX

### Antes ❌
```vue
<!-- Error: v-else sin v-if anterior -->
<div class="hidden md:block">
  <table>
    <!-- ... tabla ... -->
  </table>
  <div v-if="items.length === 0">Sin datos</div>
</div>
<div v-else class="md:hidden"><!-- Tarjetas --></div>
```

### Después ✅
```vue
<!-- Correcto: v-if/v-else-if/v-else anidados -->
<div v-if="cargando">Cargando...</div>
<div v-else-if="error">Error</div>
<template v-else>
  <div v-if="items.length > 0" class="hidden md:block">Tabla</div>
  <div v-else-if="items.length > 0" class="md:hidden">Tarjetas</div>
  <div v-else>Sin datos</div>
</template>
```

---

## 🎯 SIGUIENTE SESIÓN (S3 Fase 2)

Una vez que Protocolos CRUD está 100% funcional:

1. Crear componente `TratamientoList.vue`
2. Crear formulario `TratamientoForm.vue`
3. Integrar con Productos
4. Agregar campo `estadio` (V2, V3, V4...)

Consulta: `/tms-backend/QUICK_START_SESION_3_FASE_2.md`

---

**Fecha Fix**: Diciembre 12, 2025  
**Status**: ✅ COMPLETADO  
**Próximo paso**: Verificar que todo funciona en navegador

