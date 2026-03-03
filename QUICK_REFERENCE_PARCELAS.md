# 🎯 QUICK REFERENCE - Parcelas 2026-03-03

**Tarjeta de Referencia Rápida**
**Imprime esto o guárdalo en móvil** 📱

---

## ⚡ ACCESO RÁPIDO

### Cómo Abrir Parcelas
```
Dashboard → Clic botón "🗂️ Parcelas" en menú
O escriba: http://localhost:3001/parcelas
```

### Cómo Editar Cosecha
```
1. Abre Parcelas
2. Busca parcela (usar campo "Buscar")
3. Clic en botón 🌾 de esa parcela
4. Completa campos en modal
5. Clic "✓ Guardar Cosecha"
6. ✅ Listo
```

---

## 📋 CAMPOS DE COSECHA

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| Fecha | Date | 2026-03-03 |
| Humedad | % | 12.5 |
| Kg/ha | Número | 5000.75 |
| GIE | Número | 95.5 |
| Observ. | Texto | Cosecha buena |

**Todos opcionales** ✅ Puedes dejar vacíos

---

## 🔘 BOTONES PRINCIPALES

| Botón | Acción | Dónde |
|-------|--------|-------|
| 🗂️ | Abrir Parcelas | Menú |
| 🌾 | Editar cosecha | Tabla |
| 🗑️ | Eliminar parcela | Tabla |
| 🔍 | Buscar | Filtros |
| ✓ | Guardar | Modal |

---

## 🔧 FILTROS

```
Campo "Buscar" → Nombre o código
Desplegable "Ensayo" → Filtrar por ensayo
Desplegable "Bloque" → Filtrar por bloque
Botón "🔍" → Aplicar búsqueda
```

---

## 🆘 PROBLEMAS COMUNES

### Problema: No veo botón "🗂️ Parcelas"
```
Solución: Recarga la página (F5)
Si persiste: Contacta admin (rol insuficiente)
```

### Problema: Modal no abre
```
Solución 1: Recarga página (F5)
Solución 2: Abre consola (F12) y busca errores
Solución 3: Prueba en navegador diferente
```

### Problema: Los datos no se guardan
```
Solución 1: Verifica conexión a internet
Solución 2: Recarga (F5) y reintenta
Solución 3: Abre consola (F12) para ver error
```

---

## 📞 DOCUMENTACIÓN

| Necesitas | Lee | Ubicación |
|-----------|-----|-----------|
| Usar | GUIA_USO_PARCELAS_COMPLETA.md | Raíz |
| Entender | FIX_PARCELAS_Y_NAVEGACION.md | Raíz |
| Diagramas | DIAGRAMA_NAVEGACION.md | Raíz |
| Testing | CHECKLIST_IMPLEMENTACION.md | Raíz |
| Deploy | DEPLOYMENT_INSTRUCTIONS.md | Raíz |

---

## 🎨 TEMA OSCURO

Para cambiar a tema oscuro:
```
Haz clic en icono de luna/sol
En esquina superior derecha del header
```

---

## 📱 MOBILE

Funciona en:
- ✅ iPhone iOS
- ✅ Android Chrome
- ✅ Tablets

La tabla es scrolleable horizontalmente en pantallas pequeñas.

---

## ✅ CHECKLIST DE USO

- [ ] Abrí Parcelas desde menú
- [ ] Busqué una parcela
- [ ] Hice clic en 🌾
- [ ] El modal se abrió
- [ ] Completé los campos
- [ ] Guardé exitosamente
- [ ] Recibí confirmación ✅

---

## 🔐 SEGURIDAD

- Solo para usuarios con rol:
  - Superadministrador
  - Administrador
  - Investigador
  - Técnico de Laboratorio

- Necesitas estar logeado para acceder

---

## ⌨️ ATAJOS DE TECLADO

```
F5         = Recargar página
F12        = Abrir consola (debugging)
Ctrl+F     = Buscar en página
Tab        = Navegar entre campos
Enter      = Guardar (en algunos campos)
Escape     = Cerrar modal
```

---

## 🐛 DEBUGGING

Para reportar errores:

1. Abre consola (F12)
2. Busca mensajes rojos
3. Toma screenshot
4. Describe qué hacías cuando pasó
5. Reporta al equipo técnico

---

## 📊 RENDIMIENTO

| Acción | Tiempo esperado |
|--------|-----------------|
| Cargar página | < 3 segundos |
| Abrir modal | < 500ms |
| Guardar | < 2 segundos |
| Actualizar tabla | < 1 segundo |

Si es más lento, recarga página.

---

## 🎓 ROLES Y PERMISOS

```
Superadministrador ✅ Acceso total
Administrador      ✅ Acceso total
Investigador       ✅ Acceso total
Técnico Laboratorio✅ Acceso total
Analista           ❌ No tiene acceso
```

---

## 💾 DATOS GUARDADOS

Cuando guardas cosecha:
```
✅ Se crea registro en BD
✅ Tiene timestamp automático
✅ Se vincula a la parcela
✅ Se puede editar después
✅ Se ve en reportes
```

---

## 🚀 ESTADO ACTUAL

```
Compilación    ✅ OK
Funcionalidad  ✅ OK
Testing        ✅ OK
Documentación  ✅ OK
Producción     ✅ LISTO
```

---

## 📝 NOTAS

- Dark mode funciona
- Responsive en todos dispositivos
- Sin costos de infraestructura
- Integrado con BD existente
- Bajo riesgo de deployment

---

## 🎉 LISTO

¡Ya puedes editar cosechas en la página de Parcelas!

```
Dashboard → 🗂️ Parcelas → 🌾 Editar → ✓ Guardar
```

---

**Última actualización:** 2026-03-03
**Versión:** 1.0
**Idioma:** Español
**Status:** ✅ ACTIVO


