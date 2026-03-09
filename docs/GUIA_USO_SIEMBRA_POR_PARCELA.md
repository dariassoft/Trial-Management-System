# 📋 GUÍA RÁPIDA: Cómo Usar los Datos de Siembra por Parcela

## ✅ Estado: IMPLEMENTACIÓN COMPLETADA Y FUNCIONAL

Se han solucionado todos los errores. La nueva funcionalidad está lista para usar.

---

## 🚀 Cómo Empezar

### 1. **Reiniciar el servidor de desarrollo**

Si el servidor está ejecutando, detenlo y reinicia:

```bash
# En la terminal del frontend (tms-client-vue)
Ctrl+C  # Detener servidor actual
npm run dev  # Reiniciar
```

El error "Invalid end tag" debe haber desaparecido.

### 2. **Navegar a la página de mediciones**

```
http://localhost:3001/mediciones/63
```

Reemplaza `63` con el ID del ensayo que desees.

---

## 📱 Flujo de Uso Paso a Paso

### Paso 1️⃣: Desde la página de Mediciones

```
Mediciones → Tab "🌱 Siembra"
```

Verás un botón verde: **"→ Ir a Siembra"**

### Paso 2️⃣: Acceder a la página de Siembra

Click en el botón → Te llevará a:

```
http://localhost:3001/siembra?ensayoId=63
```

Automáticamente filtra por el ensayo actual.

### Paso 3️⃣: Ver la tabla de parcelas

La página muestra una tabla con:
- **ID** de parcela
- **Ensayo** (nombre y código)
- **Bloque** (número)
- **Nombre** de parcela
- **Tratamiento** (descripción)
- **Posición** (X, Y en grilla)
- **Acciones** (botones Editar y Eliminar)

### Paso 4️⃣: Editar datos de siembra

Para cada parcela, haz click en el botón **✏️** (Editar)

Se abrirá un modal con estos campos:

```
Información de la Parcela (lectura)
├─ Ensayo: [Nombre del ensayo]
├─ Bloque: [Número de bloque]
└─ Tratamiento: [Descripción]

Datos de Siembra (editable)
├─ Fecha de Siembra: [selector de fecha]
├─ Semillas/m²: [número]
├─ Densidad (plantas/ha): [número]
├─ Germinación (%): [número 0-100]
├─ Vigor Plantas (1-10): [número 1-10]
└─ Observaciones: [texto libre]

Botones
├─ Cancelar (descarta cambios)
└─ ✓ Guardar Siembra (guarda)
```

### Paso 5️⃣: Guardar datos

Llena los campos que desees (todos son opcionales) y haz click en:

**"✓ Guardar Siembra"**

Los datos se guardarán **SOLO para esa parcela**.

### Paso 6️⃣: Verificar que se guardó

Cierra el modal y vuelve a abrir la misma parcela.

Los datos que guardaste deben estar allí. ✅

---

## 🔄 Editar Datos Existentes

Si una parcela ya tiene datos de siembra:

1. Click en **✏️** (Editar)
2. El modal cargará los datos previos
3. Modifica lo que necesites
4. Click en **"✓ Guardar Siembra"**
5. Los datos se **actualizarán** (no se crearán nuevos)

---

## 🗑️ Eliminar Datos de Siembra

Si deseas borrar los datos de siembra de una parcela:

1. Click en **🗑️** (Eliminar)
2. Confirma la eliminación en el diálogo
3. Los datos se borrarán inmediatamente
4. La parcela volverá a estar "vacía" de siembra

---

## 🔍 Filtros y Búsqueda

### Filtro por Ensayo

En la parte superior izquierda:

```
Ensayo: [Dropdown con todos los ensayos]
```

Automáticamente está pre-seleccionado con el ensayo actual (desde mediciones).

Para cambiar a otro ensayo, selecciona del dropdown.

### Buscar por Nombre

Campo de búsqueda:

```
Buscar: [Ingresa nombre o código]
```

Filtra parcelas por:
- Nombre de parcela
- Nombre del ensayo
- Código del ensayo

---

## ⚠️ Notas Importantes

### ✅ Datos Independientes

Cada parcela tiene sus propios datos de siembra. Si cambias los datos de siembra de la **Parcela 1**, no afectará la **Parcela 2**.

### ✅ Datos por Parcela, No por Ensayo

Anteriormente, los datos de siembra se guardaban para todo el ensayo. **Ahora se guardan por parcela**.

Esto significa:
- Puedes tener diferentes fechas de siembra por parcela
- Puedes tener diferentes densidades por parcela
- Cada parcela tiene su propia información

### ✅ Acceso desde Dos Lugares

Puedes acceder a los datos de siembra desde:

1. **Mediciones** → Tab "Siembra" → Botón "Ir a Siembra"
2. Directamente en `/siembra` o `/siembra?ensayoId=63`

---

## 🐛 Si Hay Errores

### Error: "Invalid end tag"

✅ **YA ESTÁ SOLUCIONADO**

Si aún ves este error:
1. Limpia caché del navegador (Ctrl+Shift+Delete)
2. Reinicia el servidor de desarrollo
3. Recarga la página (Ctrl+F5)

### Error: "No se pudo guardar"

Verifica:
- ✅ Estés autenticado (no haya expirado la sesión)
- ✅ Tengas permisos de TECNICO o superior (no INVITADO)
- ✅ La parcela exista en la base de datos
- ✅ No haya conflictos de red

---

## 📊 Estructura de Datos Guardados

Cuando guardas datos de siembra, se almacena:

```json
{
  "id": 1,
  "parcela_id_fk": 1,
  "fecha_siembra": "2025-10-15",
  "semillas_por_metro": 150.00,
  "densidad_siembra": 300000,
  "germinacion_pct": 85.50,
  "vigor_plantas_escala": 8,
  "observaciones": "..."
}
```

**Nota:** Solo hay UN registro de siembra por parcela (constraint UNIQUE en parcela_id_fk).

---

## 🔐 Permisos Requeridos

Para **crear/editar/eliminar** datos de siembra necesitas ser:

- ✅ TECNICO
- ✅ MANAGER
- ✅ ADMIN
- ✅ SUPERADMIN

❌ Usuarios INVITADO no pueden editar (solo ver).

---

## 📞 Soporte

Si encuentras problemas:

1. Verifica que el servidor está corriendo
2. Recarga la página (Ctrl+F5)
3. Revisa la consola del navegador (F12)
4. Revisa los logs del servidor

---

## 🎉 ¡Listo para Usar!

Tu nueva página de siembra está funcional. ¡A registrar datos! 🌱

**Última actualización:** 2026-03-07

