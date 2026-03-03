# 📊 Diagrama de Navegación Actualizado

## Árbol de Navegación del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         INICIO (Login)                          │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         Dashboard                               │
│  [📊] [🌾] [📐] [📋] [🔬] [📱] [🗂️] [🏭] [🌾] [🌱] ...         │
└─────────────────────────────┬───────────────────────────────────┘
        │       │       │       │      │      │      │
        │       │       │       │      │      │      │
   ┌────┴───┐  │       │   ┌───┴──┐  │  ┌───┴───┐  │
   │         │  │       │   │      │  │  │       │  │
   ↓         ↓  ↓       ↓   ↓      ↓  ↓  ↓       ↓  ↓
┌────┐  ┌────┐┌───┐ ┌────┐┌────┐┌────┐┌──┐ ┌────┐┌──┐
│📊 │  │🌾 ││📐 │ │📋 ││🔬 ││📱 ││🗂️ ││...│
│Dash│  │Ens││Blo│ │Prot││Tipo││Med││Par││   │
│    │  │ayo││que│ │  o ││    ││iciones││   │
└────┘  └────┘└───┘ └────┘└────┘└────┘└──┘ └────┘└──┘
            │                                  ▲
            │                                  │
            ↓                                  │
        ┌────────────┐            ┌────────────┴──────┐
        │ Ensayos    │            │ Parcelas (NUEVO)  │
        │ ┌────────┐ │            │ ┌──────────────┐  │
        │ │ Crear  │ │            │ │ Tabla        │  │
        │ │ Editar │ │            │ │ ┌──────────┐ │  │
        │ │ Ver    │ │            │ │ │Filtros   │ │  │
        │ │ Detalle│ │◄───┐       │ │ ├──────────┤ │  │
        │ └────────┘ │    │       │ │ │Búsqueda  │ │  │
        └────────────┘    │       │ │ │Ensayo    │ │  │
                          │       │ │ │Bloque    │ │  │
                          │       │ │ └──────────┘ │  │
                          │       │ │ ┌──────────┐ │  │
                          │       │ │ │Parcelas  │ │  │
                          │       │ │ │ID|Ensayo │ │  │
                          │       │ │ │  |Bloque │ │  │
                          │       │ │ │  |Parce. │ │  │
                          │       │ │ │  |Trata. │ │  │
                          │       │ │ │  |Posic. │ │  │
                          │       │ │ │  |[🌾][🗑] │ │  │
                          │       │ │ └──────────┘ │  │
                          │       │ │              │  │
                          │       │ └──────────────┘  │
                          │       └──────────────────┘
                          │               ▲
                          │               │
                          │ "Ir a Parcelas" (botón)
                          │               │
                    ┌─────┴───────────────┘
                    │
                    ↓
        ┌────────────────────────┐
        │ /mediciones/[id]       │
        │ ┌────────────────────┐ │
        │ │ Tab: Siembra       │ │
        │ │ Tab: Momentos      │ │
        │ │ Tab: Cosecha       │ │ ← Click en "→ Ir a Parcelas"
        │ │ ┌────────────────┐ │ │
        │ │ │Botón "Ir a     │ │ │
        │ │ │Parcelas"       │ │ │
        │ │ └────────────────┘ │ │
        │ └────────────────────┘ │
        └────────────────────────┘
```

---

## Flujo de Edición de Cosecha

```
┌─────────────────────────┐
│  Dashboard/Parcelas     │
│  (Tabla visible)        │
└────────┬────────────────┘
         │
         │ 1. Usuario ve tabla de parcelas
         │    con botones 🌾 y 🗑️
         │
         ↓
┌─────────────────────────┐
│ Haz clic en botón 🌾    │
│ de una parcela          │
└────────┬────────────────┘
         │
         │ 2. Se dispara función abrirEditorCosecha()
         │
         ↓
┌──────────────────────────────────┐
│ Modal se abre (Teleport a body) │
├──────────────────────────────────┤
│ 🌾 Editar Cosecha - [Parcela]   │ Header
├──────────────────────────────────┤
│ Ensayo: XXX                      │
│ Bloque: X                        │ Info (read-only)
│ Tratamiento: XXX                 │
├──────────────────────────────────┤
│ Fecha de Cosecha:      [DATE]    │
│ Humedad (%):           [NUMBER]  │ Campos
│ Kg/ha (corregido):     [NUMBER]  │ editables
│ GIE:                   [NUMBER]  │
│ Observaciones:         [TEXT]    │
├──────────────────────────────────┤
│        [Cancelar] [✓ Guardar]   │ Botones
└──────────────────────────────────┘
         │
    3. Usuario elige:
    ├─ CANCELAR → Modal cierra sin guardar
    │
    └─ GUARDAR →
         │
         ↓
    4. Validación (opcional)
         │
         ↓
    5. POST/PATCH a /datos-cosecha
         │
         ↓
    6. Respuesta del servidor:
         ├─ ✅ SUCCESS: Alert "Cosecha guardada correctamente"
         │            Modal se cierra
         │            Tabla se recarga
         │
         └─ ❌ ERROR: Alert con mensaje de error
                     Modal permanece abierto
```

---

## Estructura de Datos: Modal → BD

```
┌─────────────────────────────────────────┐
│ DATOS CAPTURADOS EN EL MODAL            │
├─────────────────────────────────────────┤
│ formCosecha = {                         │
│   fechaCosecha: "2026-03-03"           │
│   humedadPct: 12.5                     │
│   kgHaCorregido: 5000.75               │
│   gie: 95.5                            │
│   observaciones: "Nota sobre cosecha"  │
│ }                                       │
└─────────────────────────────────────────┘
              │
              │ Dentro de: abrirEditorCosecha()
              │
              ↓
┌─────────────────────────────────────────┐
│ CONSTRUIR DTO PARA ENVIAR               │
├─────────────────────────────────────────┤
│ dto = {                                 │
│   parcelaId: 30,                       │
│   fechaCosecha: "2026-03-03",          │
│   humedadPct: 12.5,                    │
│   kgHaCorregido: 5000.75,              │
│   gie: 95.5,                           │
│   observaciones: "..."                 │
│ }                                       │
└─────────────────────────────────────────┘
              │
              │ Dentro de: guardarCosecha()
              │
         ┌────┴──────────────────┐
         │                       │
    ¿Edición?              ¿Creación?
    (ya existe)            (no existe)
         │                       │
         ↓                       ↓
    PATCH                   POST
    /datos-cosecha/{id}     /datos-cosecha
         │                       │
         └────────┬──────────────┘
                  │
                  ↓
    ┌─────────────────────────────────────┐
    │ BASE DE DATOS - Tabla Datos_Cosecha │
    ├─────────────────────────────────────┤
    │ id       │ parcelaId │ fechaCosecha  │
    │ 123      │ 30        │ 2026-03-03    │
    ├──────────┼───────────┼───────────────┤
    │ humedadPct│ kgHaCorregido │ gie     │
    │ 12.5     │ 5000.75       │ 95.5    │
    ├──────────┼───────────────┼─────────┤
    │ observaciones      │ createdAt      │
    │ "Nota..."         │ 2026-03-03...  │
    └─────────────────────────────────────┘
              │
              │
         ✅ GUARDADO
```

---

## Comparativa: Antes vs Después

### ANTES (Confuso)

```
Dashboard
    │
    ├─ Ensayos ──► [Ver ensayos]
    │               ├─ Editar ensayo
    │               └─ Ver detalle
    │                   └─ Tab: Cosecha
    │                       └─ "Ir a Parcelas"
    │                           └─ /parcelas?ensayoId=X
    │
    ├─ Mediciones ──► [Ver mediciones]
    │                  ├─ Momento 1
    │                  └─ (También tiene "Ir a Parcelas")
    │
    └─ ❌ NO HAY BOTÓN DIRECTO A PARCELAS

❌ PROBLEMA: Confuso, necesitas navegar por otros módulos
            No hay acceso directo
            No se editaban cosechas fácilmente
```

### DESPUÉS (Claro)

```
Dashboard
    │
    ├─ Ensayos ──► [Ver ensayos]
    │
    ├─ Mediciones ──► [Ver mediciones]
    │
    ├─ 🗂️ Parcelas ◄─ ¡¡¡ NUEVO BOTÓN DIRECTO !!!
    │   │
    │   ├─ [Tabla de Parcelas]
    │   ├─ [Filtros: Búsqueda, Ensayo, Bloque]
    │   ├─ [Botones 🌾 Editar Cosecha]
    │   │   └─ [Modal de Cosecha]
    │   │       ├─ [Campos editables]
    │   │       └─ [Guardar/Cancelar]
    │   │
    │   └─ [Acceso rápido desde Mediciones]
    │       "→ Ir a Parcelas"
    │
    └─ ✅ CLARO: Botón dedicado, acceso directo, UI intuitiva
       FUNCIONAL: Modal para editar cosechas por parcela
       EFICIENTE: Menos clicks para hacer el mismo trabajo
```

---

## Matriz de Roles y Acceso

```
┌──────────────────────────┬─────────┬──────────┬─────────┬──────────┐
│ Módulo                   │ Super   │ Admin    │ Invest. │ Técnico  │
├──────────────────────────┼─────────┼──────────┼─────────┼──────────┤
│ Dashboard                │   ✅    │    ✅    │   ✅    │    ✅    │
│ Ensayos                  │   ✅    │    ✅    │   ✅    │    ❌    │
│ Bloques y Parcelas       │   ✅    │    ✅    │   ✅    │    ✅    │
│ Protocolos               │   ✅    │    ✅    │   ✅    │    ✅    │
│ Tipos de Ensayo          │   ✅    │    ✅    │   ✅    │    ✅    │
│ Mediciones               │   ✅    │    ✅    │   ✅    │    ✅    │
│ 🗂️ Parcelas (NUEVO)      │   ✅    │    ✅    │   ✅    │    ✅    │
│ Productos                │   ✅    │    ✅    │   ❌    │    ❌    │
│ Admin/Usuarios           │   ✅    │    ✅    │   ❌    │    ❌    │
│ Admin/Roles              │   ✅    │    ❌    │   ❌    │    ❌    │
└──────────────────────────┴─────────┴──────────┴─────────┴──────────┘

✅ = Acceso permitido
❌ = Acceso denegado
```

---

## Estadísticas de Implementación

```
┌────────────────────────────────────────────┐
│ CAMBIOS REALIZADOS                         │
├────────────────────────────────────────────┤
│ Archivos modificados:        2             │
│ Líneas agregadas:           ~300           │
│ Líneas eliminadas:          ~10            │
│ Componentes nuevos:         1 (Modal)      │
│ Funciones nuevas:           4              │
│ Endpoints utilizados:       5              │
│ Documentación:              3 archivos     │
└────────────────────────────────────────────┘

Desglose de cambios:
1. ModuleMenu.vue
   - Agregado: 1 módulo "Parcelas"
   - Líneas: +8

2. parcelas.vue
   - Refactorización completa
   - Agregado: Modal de cosecha
   - Agregadas funciones: abrirEditorCosecha(), guardarCosecha(), cerrarModalCosecha()
   - Líneas: +290
   - Total actual: 526 líneas
```

---

## Flujo de Datos Detallado

```
USER ACTION
    │
    ├─ Click en "🗂️ Parcelas" (menú)
    │   └─ Navega a: /parcelas
    │       └─ @route.mounted() dispara: cargarParcelas()
    │
    ├─ Click en 🌾 (botón cosecha)
    │   └─ Dispara: abrirEditorCosecha(parcela)
    │       ├─ parcelaEditando.value = parcela
    │       ├─ Si parcela.cosecha existe:
    │       │   └─ formCosecha carga datos existentes
    │       └─ Si no existe:
    │           └─ formCosecha se inicializa vacío
    │       └─ showModalCosecha.value = true
    │
    ├─ Usuario completa formulario
    │   └─ Los datos se vinculan con v-model a formCosecha
    │
    └─ Click en "✓ Guardar"
        └─ Dispara: guardarCosecha()
            ├─ Construye dto con parcelaId
            ├─ Si parcela.cosecha?.id existe:
            │   └─ PATCH /datos-cosecha/{id}
            │       └─ api.patch(`/datos-cosecha/${id}`, dto)
            └─ Si no existe:
                └─ POST /datos-cosecha
                    └─ api.post('/datos-cosecha', dto)
            │
            ├─ Respuesta exitosa:
            │   ├─ cargarParcelas() ← Recarga tabla
            │   ├─ cerrarModalCosecha()
            │   └─ alert('✅ Cosecha guardada correctamente')
            │
            └─ Error:
                ├─ alert('❌ Error: ...')
                └─ Modal permanece abierto
```

---

## Checklist de Validación

```
┌─────────────────────────────────────────────────┐
│ VALIDACIÓN DE IMPLEMENTACIÓN                    │
├─────────────────────────────────────────────────┤
│ ✅ Botón "Parcelas" visible en menú             │
│ ✅ Página /parcelas se abre correctamente       │
│ ✅ Tabla carga con datos de parcelas            │
│ ✅ Filtros funcionan (búsqueda, ensayo, bloque)│
│ ✅ Paginación funciona si hay muchos datos     │
│ ✅ Botón 🌾 abre modal                         │
│ ✅ Modal muestra información correcta           │
│ ✅ Formulario de cosecha es editable           │
│ ✅ Validación de campos (al guardar)           │
│ ✅ POST crea nuevo registro                     │
│ ✅ PATCH actualiza registro existente           │
│ ✅ Modal se cierra después de guardar          │
│ ✅ Tabla se actualiza automáticamente          │
│ ✅ Mensaje de éxito/error aparece              │
│ ✅ Dark mode funciona correctamente             │
│ ✅ Responsive en mobile/tablet/desktop         │
│ ✅ Botón eliminar funciona (si se usa)         │
└─────────────────────────────────────────────────┘

ESTADO FINAL: ✅ LISTO PARA PRODUCCIÓN
```

---

## Notas Importantes

1. **Rol Requerido:** El botón solo aparece para usuarios con:
   - Superadministrador
   - Administrador
   - Investigador
   - Técnico de Laboratorio

2. **Datos Opcionales:** Todos los campos de cosecha son opcionales. Puedes guardar solo algunos.

3. **Actualización Automática:** Al guardar, la tabla se recarga automáticamente.

4. **Mensajes:** Se usan alerts nativos. En futuro se pueden cambiar por notificaciones más elegantes.

5. **Validación:** Mínima actualmente. Se puede mejorar con validaciones más estrictas.

---

**Documento generado:** 2026-03-03
**Versión:** 1.0
**Estado:** ✅ COMPLETO Y FUNCIONAL


