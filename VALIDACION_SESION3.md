# 📋 INSTRUCCIONES PARA VALIDAR CORRECCIONES

**Fecha**: Diciembre 12, 2025  
**Objetivo**: Verificar que todos los errores de Sesión 3 fueron resueltos

---

## ⚙️ Paso 1: Reiniciar el Frontend Docker

Ejecuta desde la raíz del proyecto:

```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml down

docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml up -d
```

---

## 🔍 Paso 2: Verificar que compile sin errores

```bash
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml logs -f nuxt
```

**Busca por**:
- ❌ **NO DEBE HABER**: `WARN  Duplicated imports "TratamientoProductoItem"`
- ❌ **NO DEBE HABER**: `ERROR  Pre-transform error`
- ✅ **DEBE HABER**: `✔ Vite server built` o similar

**Espera 30-60 segundos** para que compile completamente. Cuando veas que se estabiliza, presiona `CTRL+C` para salir.

---

## 🌐 Paso 3: Probar en Navegador

### 3.1 - Abrir la aplicación
```
http://localhost:3001/protocolos
```

### 3.2 - Verificar que cargue
- La página debe cargar sin errores JavaScript
- Debe ver el encabezado "Protocolos"
- Debe ver botón "+ Nuevo Protocolo"

### 3.3 - Crear un Protocolo
1. Click en "+ Nuevo Protocolo"
2. Nombre: `Test Protocol`
3. Descripción: `Testing Session 3`
4. Click "Guardar"
5. **Verificar**: El protocolo aparece en la lista

### 3.4 - Expandir Protocolo
1. Click en la tarjeta del protocolo creado
2. **Verificar**: Se expande y muestra "Tratamientos (0)"
3. Click en "+ Agregar Tratamiento"

### 3.5 - Crear Tratamiento Testigo
1. Número: `1`
2. Check "Es testigo"
3. Descripción: `Control sin aplicación`
4. Click "Guardar"
5. **Verificar**: Aparece en la lista con badge "TESTIGO"

### 3.6 - Crear Tratamiento con Productos
1. Click "+ Agregar Tratamiento" nuevamente
2. Número: `2`
3. Descripción: `Fomesafen`
4. Click "+ Agregar Producto"
5. Producto: Selecciona cualquiera
6. Dosis: `800`
7. Unidad: `cc/ha`
8. Estadio: `V4`
9. Click "Agregar"
10. Click "Guardar"
11. **Verificar**: Aparece en la lista

---

## ✅ Checklist de Validación

Marca cada item cuando lo completes:

**Compilación**:
- [ ] Frontend compila sin ERROR
- [ ] No hay WARN sobre imports duplicados
- [ ] Vite server se inicia correctamente

**Página de Protocolos**:
- [ ] Carga sin errores JavaScript
- [ ] Título visible
- [ ] Botón "+ Nuevo Protocolo" funciona

**CRUD Protocolos**:
- [ ] Puedo crear protocolo
- [ ] Protocolo aparece en lista
- [ ] Puedo expandir protocolo
- [ ] Puedo editar protocolo
- [ ] Puedo eliminar protocolo

**CRUD Tratamientos**:
- [ ] Puedo crear tratamiento
- [ ] Número se guarda correctamente
- [ ] Checkbox testigo funciona
- [ ] Puedo crear testigo (sin productos)
- [ ] Puedo crear con productos
- [ ] Puedo editar tratamiento
- [ ] Puedo eliminar tratamiento

**CRUD Productos**:
- [ ] Modal agregar producto aparece
- [ ] Puedo seleccionar producto
- [ ] Puedo ingresar dosis
- [ ] Puedo seleccionar unidad
- [ ] Puedo seleccionar estadio
- [ ] Producto se agrega a la lista
- [ ] Puedo quitar producto

**Funcionalidad General**:
- [ ] Dark mode funciona
- [ ] Responsive en mobile
- [ ] Responsive en tablet
- [ ] Responsive en desktop

---

## 🐛 Si hay errores

### Si ves: "WARN Duplicated imports"
**Solución**: El import de protocolos.ts no es correcto. Verifica:
```typescript
// protocolos.ts debe tener:
import type { TratamientoProductoItem, TratamientoItem } from './tratamientos'

// y NO debe tener:
export type TratamientoProductoItem = { ... }
```

### Si ves: "ERROR Pre-transform error"
**Solución**: Hay un archivo Vue incompleto. Verifica que todos los .vue en `/components/protocolos/` tengan `<template>` y `<script>`.

### Si ves: "Cannot find module"
**Solución**: Reinicia el contenedor completamente:
```bash
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml down
docker system prune -f
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml up -d
```

---

## 📝 Reporte Final

Cuando hayas completado todo, prepara un reporte con:
- ✅ Todos los items del checklist marcados
- 📸 Screenshots de funcionamiento
- 🐛 Cualquier error encontrado
- ✔️ Confirmar que TODO funciona

---

**Nota**: No marques Sesión 3 como COMPLETADA hasta que hayas validado TODO.

---

*Instrucciones de Validación - Diciembre 12, 2025*

