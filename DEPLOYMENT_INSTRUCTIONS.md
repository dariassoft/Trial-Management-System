 p# 🚀 INSTRUCCIONES DE DEPLOYMENT

**Versión:** 1.0
**Fecha:** 2026-03-03
**Status:** ✅ LISTO PARA PRODUCCIÓN

---

## 📋 Pre-Deployment Checklist

### Backend
- [x] Endpoints /datos-cosecha existentes
- [x] Base de datos actualizada
- [x] Migrations ejecutadas (si hay)
- [x] Roles y permisos configurados
- [x] Tests backend pasados (si existe)

### Frontend
- [x] Compilación sin errores críticos
- [x] Sin console.errors en runtime
- [x] Todos los imports correctos
- [x] Assets cargados correctamente
- [x] API URLs apuntan a backend correcto

### Documentación
- [x] Guías de usuario generadas
- [x] Documentación técnica completa
- [x] Diagramas incluidos
- [x] Troubleshooting disponible

---

## 🔧 PASOS DE DEPLOYMENT

### Opción A: Desarrollo Local (Recomendado para Testing)

**Paso 1: Actualizar código**
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
git pull origin main  # o tu rama
```

**Paso 2: Instalar dependencias (si hay cambios)**
```bash
npm install
```

**Paso 3: Compilar frontend**
```bash
# En terminal, ir a tms-client-vue
cd tms-client-vue
npm run build
```

**Paso 4: Verificar cambios**
```bash
# Verificar que archivos fueron actualizados
ls -la pages/parcelas.vue
ls -la components/navigation/ModuleMenu.vue
```

**Paso 5: Reiniciar aplicación**
```bash
# Si estás usando Docker
docker-compose restart

# Si estás en desarrollo local
npm run dev  # Frontend
npm run start:dev  # Backend
```

**Paso 6: Verificar en navegador**
```
http://localhost:3001/
Buscar: Botón "🗂️ Parcelas" en el menú
```

---

### Opción B: Producción (Servidor)

**Paso 1: SSH a servidor**
```bash
ssh usuario@servidor.com
cd /ruta/a/proyecto
```

**Paso 2: Hacer backup**
```bash
# Backup de BD
mysqldump -u root -p base_datos > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup de código
cp -r . ../backup_$(date +%Y%m%d_%H%M%S)/
```

**Paso 3: Actualizar código**
```bash
git pull origin main
```

**Paso 4: Instalar y compilar**
```bash
npm ci  # vs npm install (más seguro para producción)
npm run build
```

**Paso 5: Verificar compilación**
```bash
npm run build:backend  # Si existe
```

**Paso 6: Ejecutar migraciones (si hay)**
```bash
npm run migrate
```

**Paso 7: Reiniciar servicios**
```bash
# Con PM2
pm2 restart ecosystem.config.js

# Con systemd
sudo systemctl restart tms-backend
sudo systemctl restart tms-frontend

# Con Docker
docker-compose up -d
```

**Paso 8: Verificar salud**
```bash
curl http://servidor/health
# Debería devolver 200 OK
```

**Paso 9: Testing**
```bash
# En navegador
https://servidor/parcelas
# Buscar botón "🗂️ Parcelas"
```

---

## 🔍 POST-DEPLOYMENT VERIFICATION

### Checklist de Verificación

- [ ] Botón "🗂️ Parcelas" visible en menú
- [ ] URL `/parcelas` funciona
- [ ] Tabla carga correctamente
- [ ] Filtros funcionan
- [ ] Modal abre al clic en 🌾
- [ ] Guardar cosecha funciona
- [ ] Datos aparecen en base de datos
- [ ] Dark mode funciona
- [ ] Responsive en mobile funciona
- [ ] No hay errores en consola (F12)
- [ ] Permisos funcionan (roles correctos)
- [ ] No hay 500 errors en servidor

### Verificación por Navegador

```bash
# Chrome/Edge
✅ Prueba en versión reciente

# Firefox
✅ Prueba en versión reciente

# Safari
✅ Prueba en versión reciente

# Mobile
✅ Prueba en iOS Safari
✅ Prueba en Chrome Mobile Android
```

### Verificación de Rendimiento

```
Carga de página: < 3 segundos
Modal abre en: < 500ms
Guardar demora: < 2 segundos
Tabla se actualiza: < 1 segundo
```

---

## 🚨 ROLLBACK (Si hay problemas)

### Plan A: Revertir última actualización

```bash
# Opción 1: Git revert
git revert HEAD

# Opción 2: Git reset (destructivo)
git reset --hard HEAD~1

# Opción 3: Restaurar backup
cp -r ../backup_TIMESTAMP/* .
```

### Plan B: Restaurar base de datos

```bash
# Restaurar dump
mysql -u root -p base_datos < backup_TIMESTAMP.sql
```

### Plan C: Contactar soporte

Si los pasos anteriores no funcionan, contacta al equipo técnico.

---

## 📊 MONITOREO POST-DEPLOYMENT

### Métricas a Monitorear (24-48 horas)

1. **Errors en logs**
   ```bash
   tail -f /var/log/aplicacion/error.log
   # Buscar: "datos-cosecha", "parcelas", "error"
   ```

2. **Performance**
   ```bash
   # Verificar que no hay picos de CPU
   htop

   # Verificar memoria
   free -h
   ```

3. **Conectividad BD**
   ```bash
   # Verificar conexión
   mysql -u usuario -p -e "SELECT 1"
   ```

4. **Acceso a API**
   ```bash
   curl -H "Authorization: Bearer TOKEN" \
        http://servidor/api/parcelas
   # Debe devolver 200 OK
   ```

---

## 💡 TIPS Y MEJORES PRÁCTICAS

### Durante el Deployment

- ✅ Hacer deployment en horario de bajo uso
- ✅ Tener plan de rollback listo
- ✅ Avisar a usuarios de cambios (si es necesario)
- ✅ Monitorear logs durante primeras horas
- ✅ Dejar acceso de soporte disponible

### Después del Deployment

- ✅ Solicitar feedback de usuarios
- ✅ Monitorear performance
- ✅ Registrar tiempo de deployment
- ✅ Documentar cualquier issue encontrado
- ✅ Hacer follow-up después de 1 semana

---

## 📞 CONTACTO DE EMERGENCIA

Si algo sale mal durante deployment:

1. **Paso 1:** Intenta rollback automático
2. **Paso 2:** Restaura desde backup
3. **Paso 3:** Contacta: [equipo-dev@email.com](mailto:equipo-dev@email.com)
4. **Paso 4:** Describe el problema y pasos realizados

---

## 📝 REGISTRO DE DEPLOYMENT

**Fecha Planned:** [Completar antes de deployment]
**Fecha Actual:** [Completar después de deployment]
**Responsable:** [Nombre del desarrollador]

**Pre-deployment:**
- [ ] Backup creado
- [ ] Código actualizado
- [ ] Compilación exitosa

**Deployment:**
- [ ] Servicios reiniciados
- [ ] Verificaciones pasadas
- [ ] Usuarios notificados

**Post-deployment (1 hora después):**
- [ ] No hay errores críticos
- [ ] Performance normal
- [ ] Funcionalidad verificada

**Post-deployment (24 horas después):**
- [ ] Sin problemas reportados
- [ ] Logs limpios
- [ ] Performance estable

**Observaciones:**
```
[Espacio para notas adicionales]
```

---

## 🎓 REFERENCIAS

- **Guía de Usuario:** GUIA_USO_PARCELAS_COMPLETA.md
- **Documentación Técnica:** FIX_PARCELAS_Y_NAVEGACION.md
- **Diagramas:** DIAGRAMA_NAVEGACION_ACTUALIZADO.md
- **Checklist:** CHECKLIST_IMPLEMENTACION_PARCELAS.md

---

## ✅ CONCLUSIÓN

Esta versión (1.0) está lista para deployment en producción.

**Cambios principales:**
- ✅ Botón "Parcelas" agregado al menú
- ✅ Modal de edición de cosecha implementado
- ✅ Endpoints conectados
- ✅ Documentación completa

**Tiempo estimado de deployment:**
- Local: 5-10 minutos
- Producción: 15-30 minutos (sin issues)

**Riesgo:** 🟢 BAJO (cambios mínimos y localizados)

---

**Generado:** 2026-03-03
**Versión:** 1.0
**Status:** ✅ LISTO PARA DEPLOYMENT


