# ✅ CÓMO POPULAR PERMISOS EN LA BASE DE DATOS

**Fecha:** 12/02/2026  
**Status:** Sistema listo para inicializar

---

## 📊 PROBLEMA

La página `/admin/permisos` no muestra registros porque la tabla `Permiso` está vacía.

## ✅ SOLUCIÓN

Se han agregado 3 formas de inicializar los permisos por defecto para todos los roles:

---

## 🔧 OPCIÓN 1: Botón en la interfaz (RECOMENDADO)

1. Accede a: `http://localhost:3001/admin/permisos`
2. Haz login como Superadministrador
3. Haz clic en el botón **"⚡ Inicializar Permisos"** (verde)
4. Confirma en el dialog
5. Los permisos se crearán automáticamente para todos los roles

**Ventaja:** No requiere línea de comandos, interfaz visual intuitiva

---

## 🔧 OPCIÓN 2: Endpoint API directo

Llamar al endpoint directamente desde Postman o curl:

```bash
curl -X POST http://localhost:3001/api/v1/permisos/init \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Respuesta esperada:**
```json
{
  "message": "Permisos inicializados exitosamente",
  "totalPermisosCreados": 75,
  "rolesProcessados": 5
}
```

---

## 🔧 OPCIÓN 3: Script npm (si está disponible)

```bash
npm run seed:permisos
```

**Nota:** Requiere que la BD esté corriendo y accesible

---

## 📋 QUÉ PERMISOS SE CREAN

El sistema crea automáticamente:

### **Superadministrador** (45 permisos)
- laboratorios: VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR
- usuarios: VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR
- roles: VER, CREAR, EDITAR, ELIMINAR, LISTAR
- permisos: VER, CREAR, EDITAR, ELIMINAR, LISTAR
- productos: VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR
- cultivos: VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR
- variedades: VER, CREAR, EDITAR, ELIMINAR, LISTAR
- tipos-ensayo: VER, CREAR, EDITAR, ELIMINAR, LISTAR
- tipos-siembra: VER, CREAR, EDITAR, ELIMINAR, LISTAR
- ensayos: VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR

### **Administrador** (35 permisos)
- laboratorios: VER, CREAR, EDITAR, ELIMINAR, LISTAR
- usuarios: VER, CREAR, EDITAR, LISTAR
- permisos: VER, LISTAR
- productos: VER, CREAR, EDITAR, ELIMINAR, LISTAR
- cultivos: VER, CREAR, EDITAR, ELIMINAR, LISTAR
- variedades: VER, CREAR, EDITAR, ELIMINAR, LISTAR
- tipos-ensayo: VER, CREAR, EDITAR, ELIMINAR, LISTAR
- tipos-siembra: VER, CREAR, EDITAR, ELIMINAR, LISTAR
- ensayos: VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR

### **Manager** (11 permisos)
- productos: VER, CREAR, EDITAR, LISTAR
- ensayos: VER, CREAR, EDITAR, LISTAR, EXPORTAR
- cultivos: VER, LISTAR

### **Tecnico** (6 permisos)
- ensayos: VER, LISTAR
- productos: VER, LISTAR
- cultivos: VER, LISTAR

### **Invitado** (2 permisos)
- ensayos: VER, LISTAR

---

## ✅ VERIFICACIÓN

Después de inicializar, verifica que los permisos se hayan creado:

1. Accede a `/admin/permisos`
2. Deberías ver una lista de permisos organizados por rol
3. Puedes filtrar por rol, recurso y acción
4. Puedes editar o eliminar permisos individuales

---

## 📋 CARACTERÍSTICAS DEL SISTEMA

✅ No crea duplicados (verifica si el permiso ya existe)  
✅ Soporta inicialización múltiple (seguro ejecutar varias veces)  
✅ Permisos configurables por rol  
✅ ABM completo (crear, leer, editar, eliminar)  
✅ Búsqueda y filtros  
✅ Paginación  

---

## 🔒 CONTROL DE ACCESO

Solo el **Superadministrador** puede:
- Crear permisos
- Editar permisos
- Eliminar permisos
- Inicializar permisos

Cualquier usuario autenticado puede:
- Ver permisos
- Filtrar permisos

---

## ❓ PREGUNTAS FRECUENTES

### P: ¿Qué sucede si ejecuto la inicialización dos veces?
R: No hay problema. El sistema verifica si el permiso ya existe antes de crearlo, así que no crea duplicados.

### P: ¿Puedo editar los permisos después?
R: Sí. Puedes crear, editar o eliminar permisos individuales desde la interfaz de administración.

### P: ¿Qué sucede si agrego un nuevo rol?
R: Tendrás que:
1. Crear el rol (en /admin/roles)
2. Inicializar permisos de nuevo, o
3. Asignar permisos manualmente a ese rol

### P: ¿Los permisos se aplican automáticamente?
R: Sí. El Guard `PermisosGuard` valida automáticamente los permisos en cada endpoint.

---

## 📞 SOPORTE

Si tienes problemas:
1. Verifica que la BD está corriendo
2. Verifica que hay roles creados en la BD
3. Intenta desde el botón de la interfaz primero
4. Si no funciona, revisa los logs de la consola

---

**Estado:** ✅ Sistema listo para usar

Recomendación: Usa el botón "⚡ Inicializar Permisos" desde la interfaz.


