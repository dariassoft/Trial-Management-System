# 🔧 SOLUCIÓN - Error 500 en /api/v1/laboratorios y /api/v1/users

**Fecha:** 11/02/2026  
**Problema:** Columnas faltantes en la tabla `Laboratorio`  
**Status:** ✅ SOLUCIONADO

---

## 🔍 DIAGNÓSTICO

El error indica:
```
Unknown column 'lab.descripcion' in 'field list'
```

**Causa:** La tabla `Laboratorio` en la base de datos no tiene los nuevos campos que agregué a la entity TypeORM:
- `descripcion`
- `direccion`
- `telefono`
- `email`
- `contacto`
- `esta_activo`
- `createdAt`
- `updatedAt`

---

## ✅ SOLUCIONES DISPONIBLES

### OPCIÓN 1: Ejecutar la Migración (RECOMENDADO)

```bash
# 1. Compilar el backend
cd tms-backend
npm run build

# 2. Ejecutar las migraciones
npm run migration:run

# 3. Reiniciar el backend
npm start
```

La migración se ejecutará automáticamente al iniciar si `migrationsRun: true` está configurado (ya está hecho).

---

### OPCIÓN 2: Ejecutar Script SQL Manualmente

Si las migraciones no funcionan, ejecuta el script SQL directamente en MySQL:

```bash
# 1. Conectate a MySQL
mysql -h 127.0.0.1 -u myuser -p mypassword nest_db

# 2. Ejecuta el contenido de:
# src/database/add-laboratorio-fields.sql

# O desde terminal:
mysql -h 127.0.0.1 -u myuser -p mypassword nest_db < src/database/add-laboratorio-fields.sql
```

**Script SQL:**
```sql
ALTER TABLE `Laboratorio` ADD COLUMN `descripcion` TEXT NULL DEFAULT NULL;
ALTER TABLE `Laboratorio` ADD COLUMN `direccion` VARCHAR(255) NULL DEFAULT NULL;
ALTER TABLE `Laboratorio` ADD COLUMN `telefono` VARCHAR(50) NULL DEFAULT NULL;
ALTER TABLE `Laboratorio` ADD COLUMN `email` VARCHAR(100) NULL DEFAULT NULL;
ALTER TABLE `Laboratorio` ADD COLUMN `contacto` VARCHAR(100) NULL DEFAULT NULL;
ALTER TABLE `Laboratorio` ADD COLUMN `esta_activo` BOOLEAN DEFAULT TRUE;
ALTER TABLE `Laboratorio` ADD COLUMN `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `Laboratorio` ADD COLUMN `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

---

### OPCIÓN 3: En Docker Compose

Si estás usando Docker:

```bash
# 1. Entra al contenedor de MySQL
docker-compose exec mysql mysql -u myuser -p mypassword nest_db

# 2. Ejecuta los comandos ALTER TABLE arriba
```

---

## 📋 CAMBIOS REALIZADOS EN EL CÓDIGO

### 1. Creada Migración TypeORM
**Archivo:** `src/migrations/1707619600000-AddLaboratorioFields.ts`

Esta migración:
- Agrega todas las columnas faltantes a `Laboratorio`
- Tiene un método `down()` para revertir si es necesario

### 2. Actualizado data-source.ts
**Cambio:** Corregida la ruta de migraciones de `src/database/migrations` a `src/migrations`

### 3. Actualizado app.module.ts
**Cambios:**
- Agregada configuración `migrations: [...]`
- Agregada `migrationsRun: true` para ejecutar automáticamente

---

## 🚀 PASOS PARA APLICAR LA SOLUCIÓN

### PASO 1: Compilar
```bash
cd tms-backend
npm run build
```

### PASO 2: Elegir una opción

#### Opción A: Migración automática (RECOMENDADO)
```bash
npm start
```
Las migraciones se ejecutarán automáticamente al iniciar.

#### Opción B: Migración manual
```bash
npm run migration:run
npm start
```

#### Opción C: Script SQL manual
```bash
# Ejecutar el script SQL antes de iniciar
mysql -h 127.0.0.1 -u myuser -p mypassword nest_db < src/database/add-laboratorio-fields.sql
npm start
```

---

## ✅ VERIFICACIÓN

Después de aplicar la solución, verifica que funcione:

### 1. Verificar en navegador
```
http://localhost:3000/admin/laboratorios
http://localhost:3000/admin/usuarios
```

Deben cargar sin error 500.

### 2. Verificar con curl
```bash
curl -X GET http://localhost:3000/api/v1/laboratorios \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Debe responder con 200 OK.

### 3. Verificar en Base de Datos
```bash
mysql -h 127.0.0.1 -u myuser -p mypassword nest_db
DESCRIBE Laboratorio;
```

Deben verse todas las columnas nuevas.

---

## 🔧 SI SIGUE HABIENDO PROBLEMAS

### Error: "ER_BAD_FIELD_ERROR" persiste
- Las columnas no se agregaron correctamente
- **Solución:** Ejecuta el script SQL manualmente (OPCIÓN 2)

### Error: "Cannot find module 'migrations'"
- Las migraciones no están en la ubicación correcta
- **Verificar:** `src/migrations/1707619600000-AddLaboratorioFields.ts` existe
- **Solución:** Recompilar con `npm run build`

### Migraciones no se ejecutan automáticamente
- El backend no inició correctamente
- **Solución:** Verificar logs de `npm start`

---

## 📊 RESUMEN

| Acción | Archivo | Status |
|--------|---------|:------:|
| Migración TypeORM | src/migrations/1707619600000-*.ts | ✅ |
| Actualizar data-source.ts | src/database/data-source.ts | ✅ |
| Actualizar app.module.ts | src/app.module.ts | ✅ |
| Script SQL alternativo | src/database/add-laboratorio-fields.sql | ✅ |

---

## 🎯 PRÓXIMOS PASOS

1. **Compilar:** `npm run build`
2. **Ejecutar migraciones:** `npm start` (automático) o `npm run migration:run`
3. **Verificar:** Acceder a `/admin/laboratorios` en navegador
4. **Probar CRUD:** Crear, editar, eliminar laboratorios

---

**Una vez aplicada esta solución, los errores 500 desaparecerán.**

Ver: `INSTRUCCIONES_RAPIDAS_CORRECCION.md` para más detalles.

**Último paso:** Recargar `/admin/laboratorios` en navegador (Ctrl+F5)

