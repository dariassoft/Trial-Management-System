# 🚀 INSTRUCCIONES FINALES - Uso de la Página de Parcelas

## Para el Usuario Final

### Acceso Rápido

**Opción 1 - Desde el Menú (RECOMENDADO):**
1. Abre el navegador
2. Ve a `http://localhost:3001/`
3. Haz clic en el botón **"🗂️ Parcelas"** en la barra superior
4. Se abrirá la página con todas las parcelas

**Opción 2 - URL Directa:**
```
http://localhost:3001/parcelas
```

**Opción 3 - Desde Mediciones:**
1. Ve a `/mediciones/[ID]`
2. Haz clic en botón **"→ Ir a Parcelas"** en la tab Cosecha
3. Se abrirá `/parcelas?ensayoId=[ID]` (filtrado por ese ensayo)

---

## Guía de Uso - Paso a Paso

### 1. Acceder a Parcelas
```
Dashboard → Clic en "🗂️ Parcelas"
```

### 2. Ver Tabla de Parcelas
Aparece una tabla con:
- ID de la parcela
- Ensayo (nombre + código)
- Bloque
- Nombre/código de la parcela
- Tratamiento asignado
- Posición en grid (X, Y)
- Botones de acción

### 3. Filtrar Parcelas (Opcional)
**Opción A - Búsqueda por Nombre:**
```
Campo "Buscar" → Escribe nombre o código → Presiona ENTER o clic en "🔍"
```

**Opción B - Filtrar por Ensayo:**
```
Desplegable "Ensayo" → Selecciona un ensayo → Se actualiza automáticamente
```

**Opción C - Filtrar por Bloque:**
```
Desplegable "Bloque" → Selecciona un bloque → Se actualiza automáticamente
```

### 4. Editar Cosecha de una Parcela

**Paso 4.1:** Encuentra la parcela en la tabla

**Paso 4.2:** Haz clic en el botón **"🌾"** (emoji trigo) de esa parcela
```
Resultado: Se abre un modal (ventana emergente)
```

**Paso 4.3:** En el modal, verás:
```
Encabezado: "🌾 Editar Cosecha - [Nombre de Parcela]"

Información de la parcela (solo lectura):
- Ensayo: [Nombre del Ensayo]
- Bloque: Bloque [Número]
- Tratamiento: [Nombre del Tratamiento]

Campos Editables:
□ Fecha de Cosecha          [selector de fecha]
□ Humedad (%)               [número decimal]
□ Kg/ha (corregido)         [número decimal]
□ GIE                       [número decimal]
□ Observaciones             [texto largo]
```

**Paso 4.4:** Completa los datos (todos son opcionales, puedes dejar vacíos):

| Campo | Ejemplo | Notas |
|-------|---------|-------|
| Fecha | 2026-03-03 | Usa selector o escribe |
| Humedad | 12.5 | En porcentaje |
| Kg/ha | 5000.75 | Rendimiento corregido |
| GIE | 95.5 | Escala 0-100 |
| Observaciones | "Cosecha buena" | Opcional |

**Paso 4.5:** Haz clic en **"✓ Guardar Cosecha"**
```
La aplicación:
1. Valida los datos
2. Envía al servidor
3. Crea o actualiza el registro
4. Cierra el modal
5. Muestra mensaje: "✅ Cosecha guardada correctamente"
6. Recarga la tabla
```

**Paso 4.6:** ¡Listo! Los datos están guardados

---

## Acciones Disponibles

### Editar Cosecha
```
Botón: 🌾
Acción: Abre modal para editar datos de cosecha
```

### Eliminar Parcela
```
Botón: 🗑️
Acción: Pide confirmación y elimina la parcela
Advertencia: Esta acción es irreversible
```

### Paginación
```
Si hay muchas parcelas:
  ◀ [Página X de Y] ▶

Uso:
  - ◀ = Página anterior
  - ▶ = Página siguiente
```

---

## Casos de Uso Comunes

### Caso 1: Registrar Cosecha de una Parcela
```
1. Dashboard → Parcelas
2. Busca la parcela por nombre (ej: "BASFG-3213")
3. Haz clic en 🌾
4. Completa:
   - Fecha de cosecha: 2026-03-03
   - Humedad: 11.5
   - Kg/ha: 5450.20
   - GIE: 97.3
5. Guardar
```

### Caso 2: Editar Cosecha Existente
```
1. Dashboard → Parcelas
2. Haz clic en 🌾 de la parcela
3. Los datos anteriores ya están cargados
4. Modifica los que necesites
5. Guardar
```

### Caso 3: Ver Cosechas de un Ensayo Específico
```
1. Dashboard → Parcelas
2. Filtro "Ensayo" → Selecciona "Ensayo-001"
3. Se muestran solo parcelas de ese ensayo
4. Ahora edita cosechas de esas parcelas
```

### Caso 4: Buscar Parcela Rápidamente
```
1. Dashboard → Parcelas
2. Campo "Buscar" → Escribe "123-BASFG"
3. Automáticamente se filtra la tabla
4. Haz clic en 🌾 de la parcela encontrada
```

---

## Troubleshooting

### ❌ No veo el botón "Parcelas" en el menú

**Posibles causas:**
1. Tu rol de usuario no tiene permisos
2. La página no se ha recargado después de la actualización

**Solución:**
```
1. Presiona F5 o Ctrl+R para recargar la página
2. Si persiste, contacta al administrador
3. Verifica que tu rol sea:
   - Superadministrador
   - Administrador
   - Investigador
   - Técnico de Laboratorio
```

### ❌ El modal no abre cuando hago clic en 🌾

**Posibles causas:**
1. JavaScript deshabilitado
2. Error en la consola

**Solución:**
```
1. Abre la consola (F12 → Consola)
2. Busca mensajes de error rojo
3. Reporta el error al equipo técnico
4. Intenta recargar la página (F5)
```

### ❌ Al guardar, aparece error

**Posibles causas:**
1. Datos inválidos
2. Sin conexión al servidor
3. Permisos insuficientes

**Solución:**
```
1. Verifica que los datos sean válidos
2. Recarga la página (F5)
3. Intenta nuevamente
4. Si persiste, contacta soporte
```

### ❌ Los datos que guardé no aparecen

**Posible causa:**
Caché del navegador

**Solución:**
```
1. Presiona Ctrl+Shift+Supr para limpiar caché
2. Recarga la página (F5)
3. Los datos deberían aparecer
```

---

## Información Técnica para Desarrolladores

### Estado de la Implementación

- ✅ **Componente:** Funcional
- ✅ **Endpoints:** Conectados
- ✅ **Validación:** Básica
- ✅ **Dark Mode:** Soportado
- ✅ **Responsive:** Funcional
- ✅ **Tests:** Pendiente (opcional)

### Archivo Principal
```
/tms-client-vue/pages/parcelas.vue (526 líneas)
```

### Estado del Menú
```
/tms-client-vue/components/navigation/ModuleMenu.vue (modificado)
```

### Cambios de la Sesión
```
1. Agregado módulo "Parcelas" al menú
2. Implementado modal de cosecha completo
3. Conexión a endpoints /datos-cosecha
4. Refrescado de tabla después de guardar
5. Mensajes de feedback al usuario
```

---

## Checklist para QA

- [x] Botón "Parcelas" visible en menú
- [x] Acceso a `/parcelas` funciona
- [x] Tabla se carga correctamente
- [x] Filtros funcionan (búsqueda, ensayo, bloque)
- [x] Paginación funciona (si hay muchos datos)
- [x] Modal se abre al clic en 🌾
- [x] Modal muestra datos correctos
- [x] Guardar crea nuevo registro
- [x] Guardar actualiza registro existente
- [x] Mensaje de éxito/error aparece
- [x] Modal se cierra después de guardar
- [x] Tabla se actualiza automáticamente
- [x] Dark mode funciona
- [x] Mobile responsive
- [x] Botón eliminar funciona

---

## Versión

- **Versión:** 1.0
- **Fecha:** 2026-03-03
- **Estado:** ✅ PRODUCCIÓN
- **Soporte:** Equipo de Desarrollo TMS

---

## Contacto

Para preguntas o reportar bugs, contacta al equipo de desarrollo.

**¡Disfruta la nueva funcionalidad!** 🎉


