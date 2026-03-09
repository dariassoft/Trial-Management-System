# Implementación: Datos de Siembra por Parcela

## Resumen de Cambios

Se ha refactorizado completamente la forma en que se registran los datos de siembra. Anteriormente, se guardaban para todo el ensayo (aplicándose a todas las parcelas simultáneamente). Ahora, cada parcela tiene sus propios datos de siembra independientes.

---

## 📁 Cambios en Backend

### 1. **Servicio: `src/datos-siembra/datos-siembra.service.ts`**

- ✅ Agregado método `findByEnsayoId(ensayoId: number)`
  - Obtiene todos los datos de siembra de las parcelas pertenecientes a un ensayo
  - Retorna datos ordenados por ID de parcela
  - Incluye relaciones: ensayo, bloque, tratamiento
  - Implementa seguridad: usuarios INVITADO solo ven datos de sus laboratorios

### 2. **Controlador: `src/datos-siembra/datos-siembra.controller.ts`**

- ✅ Mejorado con decoradores de seguridad y documentación OpenAPI
- ✅ Agregado decorador `@Roles()` para endpoints POST, PATCH, DELETE
- ✅ Agregado parámetro query `ensayoId` al endpoint GET `/datos-siembra`
- ✅ Agregada documentación Swagger completa
- ✅ Tipo correcto para parámetros: `ParseIntPipe`

### 3. **Entity: `src/entities/datos-siembra.entity.ts`**

- ✅ Sin cambios requeridos (ya tiene estructura correcta con `parcela_id_fk`)
- ✅ La tabla ya tiene constraint `UNIQUE` en `parcela_id_fk`

---

## 🎨 Cambios en Frontend

### 1. **Nueva Página: `tms-client-vue/pages/siembra.vue`** ✨

Página completamente nueva que funciona de forma similar a `cosecha.vue`:

**Características:**
- ✅ Tabla de parcelas con filtros (búsqueda, ensayo)
- ✅ Mostrar datos del ensayo, bloque, parcela y tratamiento
- ✅ Botón "Editar Siembra" (✏️) que abre un modal
- ✅ Botón "Eliminar" (🗑️) para borrar datos de siembra
- ✅ Modal para registrar/editar datos de siembra por parcela
- ✅ Campos de siembra:
  - Fecha de Siembra
  - Semillas/m²
  - Densidad (plantas/ha)
  - Germinación (%)
  - Vigor Plantas (1-10)
  - Observaciones
- ✅ Paginación
- ✅ Validación y manejo de errores
- ✅ Soporte para crear nuevos datos o actualizar existentes

**URL:** `/siembra` o `/siembra?ensayoId=63` (filtro automático por ensayo)

### 2. **Página Modificada: `tms-client-vue/pages/mediciones/[id]/index.vue`**

**Tab "Siembra" (línea ~85-127):**
- ❌ Removido: Formulario anterior que guardaba para todas las parcelas
- ✅ Agregado: Botón "Ir a Siembra" que redirige a `/siembra?ensayoId={ensayoId}`
- ✅ Mensaje informativo que explica el nuevo flujo
- ✅ Iconografía mejorada (verde para siembra)

**Script:**
- ❌ Removido: Función `guardarSiembra()` (ahora en página de siembra)
- ❌ Removido: Variable `guardandoSiembra`
- ❌ Removido: Variable `formSiembra`
- ✅ Mantiene funcionalidad de cosecha sin cambios

---

## 📊 Flujo de Uso

### Antes (Incorrecto)
```
Mediciones [ID] → Tab "Siembra" → Llena formulario → Guarda para TODAS las parcelas
```
❌ Problema: Todas las parcelas tenían los mismos datos

### Ahora (Correcto)
```
Mediciones [ID] → Tab "Siembra" → Botón "Ir a Siembra"
    ↓
Página Siembra → Tabla de parcelas → Selecciona parcela → Editar
    ↓
Modal → Registra datos SOLO para esa parcela
```
✅ Cada parcela tiene datos independientes

---

## 🔐 Seguridad

- ✅ Endpoints POST/PATCH/DELETE protegidos con `@Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)`
- ✅ Usuarios INVITADO pueden ver pero no editar datos
- ✅ Filtrado por laboratorio en consultas (usuarios INVITADO)
- ✅ Validación de autenticación con middleware `auth`

---

## 📝 API Endpoints

### Obtener datos de siembra por ensayo
```
GET /datos-siembra?ensayoId=63
```
**Respuesta:**
```json
[
  {
    "id": 1,
    "parcela": {
      "id": 1,
      "nombreParcela": "P1",
      "ensayo": { "id": 63, "nombreEnsayo": "Ensayo X" },
      "bloque": { "id": 1, "nombreBloque": "A" },
      "tratamiento": { "id": 1, "descripcion": "Control" }
    },
    "fechaSiembra": "2025-10-15",
    "semillasPorMetro": 150,
    "densidadSiembra": 300000,
    "germinacionPct": 85.5,
    "vigorPlantasEscala": 8,
    "observaciones": "..."
  }
]
```

### Crear datos de siembra
```
POST /datos-siembra
{
  "parcelaId": 1,
  "fechaSiembra": "2025-10-15",
  "semillasPorMetro": 150,
  "densidadSiembra": 300000,
  "germinacionPct": 85.5,
  "vigorPlantasEscala": 8,
  "observaciones": "..."
}
```

### Actualizar datos de siembra
```
PATCH /datos-siembra/{id}
{
  "fechaSiembra": "2025-10-16",
  "germinacionPct": 86,
  ...
}
```

### Eliminar datos de siembra
```
DELETE /datos-siembra/{id}
```

---

## ✨ Ventajas de la Nueva Implementación

1. **Independencia por parcela**: Cada parcela puede tener datos de siembra diferentes
2. **Interfaz intuitiva**: Similar a la de cosecha, consistente con el resto de la app
3. **Mejor mantenimiento**: Código más limpio y separado por responsabilidad
4. **Escalabilidad**: Fácil agregar campos o lógica en el futuro
5. **UX mejorada**: Modal para editar es más eficiente que formularios en tabs
6. **Datos correctos**: Se respeta la estructura de BD con unique constraint en `parcela_id_fk`

---

## ✅ Testing Manual Recomendado

1. Ir a un ensayo → Tab "Mediciones"
2. Click en tab "Siembra"
3. Click en botón "Ir a Siembra"
4. Filtra por ensayo actual (debería estar pre-seleccionado)
5. Para cada parcela:
   - Click en ✏️ para editar
   - Llena datos de siembra
   - Click en "✓ Guardar Siembra"
6. Verifica que se guardó: Vuelve a abrir el modal, datos deben persistir
7. Click en 🗑️ para eliminar (si deseas probar eliminación)
8. Navega a otra sección y vuelve para confirmar persistencia

---

## 📋 Checklist

- ✅ Backend: Servicio con `findByEnsayoId`
- ✅ Backend: Controlador con endpoint mejorado
- ✅ Backend: Decoradores de seguridad
- ✅ Backend: Documentación OpenAPI
- ✅ Frontend: Nueva página `siembra.vue`
- ✅ Frontend: Tab "Siembra" en mediciones redirige a nueva página
- ✅ Frontend: Modal para editar datos por parcela
- ✅ Frontend: Eliminación de variables innecesarias
- ✅ Frontend: Estilos consistentes (verde para siembra)

---

## 🚀 Próximas Mejoras Opcionales

1. Agregar más campos de siembra si es necesario
2. Validaciones de fechas (fecha de siembra debe ser anterior a cosecha)
3. Historial de cambios en siembra
4. Importación/exportación masiva de datos
5. Reportes de siembra por ensayo

