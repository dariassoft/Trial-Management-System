# 📋 RESUMEN EJECUTIVO - Solución de Problemas de Permisos Docker

## 🎯 El Problema
```
Error: EACCES: permission denied, open '/app/.nuxt/tsconfig.json'
```

Después de cada `npm run build` en Docker, los permisos se rompían y requerías ejecutar manualmente:
```bash
sudo chown -R tu_usuario:tu_usuario .nuxt
```

## ❓ ¿Por Qué Ocurría?

```
1. Contenedor Docker ejecutaba como root (UID:0)
2. Nuxt generaba /app/.nuxt con propietario root:root
3. El host (tu_usuario:UID:1000) no podía leer/escribir esos archivos
4. Resultado: EACCES (permission denied)
```

## ✅ La Solución Profesional (implementada)

### **3 Cambios Clave:**

#### 1️⃣ **Dockerfile con Usuario No-Root**
```dockerfile
RUN addgroup -g 1001 -S nodejs && adduser -S nuxt -u 1001
USER nuxt  # ← Contenedor ejecuta como 'nuxt', no 'root'
```

#### 2️⃣ **Volúmenes Separados** (docker-compose.yml)
```yaml
# ANTES (problemático):
volumes:
  - ./tms-client-vue:/app:delegated

# AHORA (correcto):
volumes:
  # Código fuente (SÍ sincronizado con host)
  - ./tms-client-vue/pages:/app/pages:delegated
  - ./tms-client-vue/components:/app/components:delegated
  # ... otros directorios

  # Archivos generados (NO sincronizados - Docker gestiona)
  - nuxt_build:/app/.nuxt        # ← Volumen nombrado
  - nuxt_output:/app/.output     # ← Volumen nombrado
```

#### 3️⃣ **Ejecutar con UID explícito**
```yaml
user: "1001:1001"  # Asegura consistencia de permisos
```

## 🔄 Cómo Funciona Ahora

```
Host (tu_usuario, UID:1000)
    ↓ monta directorio de código
Contenedor (usuario: nuxt, UID:1001)
    ↓ genera /app/.nuxt en volumen nombrado
/app/.nuxt (Docker gestiona - sin conflictos)
    ↓
Host accede a código fuente (sincronizado) ✅
Host NO accede a .nuxt (volumen Docker) - pero eso está bien ✅
```

## 📊 Comparación

| Métrica | Antes | Después |
|--------|-------|---------|
| Usuario del contenedor | root ❌ | nuxt ✅ |
| Permisos de .nuxt | root:root ❌ | nuxt:nodejs ✅ |
| Necesidad de sudo | Sí ❌ | No ✅ |
| Reproducible | Depende ❌ | Siempre ✅ |
| Seguridad | Riesgo ❌ | Seguro ✅ |

## 📁 Archivos Modificados

| Archivo | Cambio | Propósito |
|---------|--------|----------|
| `tms-client-vue/Dockerfile` | ✅ CREADO | Definir imagen con usuario no-root |
| `docker-compose.yml` | ✅ ACTUALIZADO | Volúmenes separados + usuario |
| `scripts/rebuild_docker.sh` | ✅ CREADO | Utilidad para reconstruir |
| `docs/SOLUCION_PERMISOS_DOCKER_NUXT.md` | ✅ CREADO | Documentación técnica |
| `docs/GUIA_RAPIDA_PERMISOS.md` | ✅ CREADO | Guía de implementación |

## 🚀 Pasos de Implementación

```bash
# 1. Limpiar volúmenes antiguos
docker-compose down -v

# 2. Reconstruir
docker-compose up --build -d

# 3. Verificar
docker-compose exec client-vue whoami  # Debe mostrar: nuxt
docker-compose exec client-vue npm run build  # Sin errores ✅
```

O usa el script:
```bash
./scripts/rebuild_docker.sh
```

## ✨ Ventajas de la Solución

✅ **Automática** - No requiere intervención manual
✅ **Segura** - Contenedor no corre como root
✅ **Reproducible** - Funciona en cualquier máquina
✅ **Profesional** - Sigue mejores prácticas Docker
✅ **Escalable** - Fácil de mantener y extender

## 🎓 Aprendizaje

### ¿Por qué volúmenes nombrados para .nuxt?

- `.nuxt` es generado por Nuxt (cada build)
- No necesita sincronización con el host
- En volumen nombrado, Docker gestiona permisos
- Sin conflictos UID/GID entre host y contenedor

### ¿Por qué UID 1001?

- UID 1000 es típicamente el usuario regular en Linux
- UID 1001 evita conflictos directos
- Consistente entre desarrollo y producción

## 📚 Documentación Completa

Para detalles técnicos profundos:
- 👉 `docs/SOLUCION_PERMISOS_DOCKER_NUXT.md`

Para guía rápida:
- 👉 `docs/GUIA_RAPIDA_PERMISOS.md`

## ❓ Preguntas Frecuentes

### ¿Puedo editar archivos en .nuxt desde el host?
No (está en volumen Docker), pero tampoco necesitas. El .nuxt se genera automáticamente.

### ¿Y si tengo un error de permisos nuevo?
Asegúrate de:
1. Haber limpiado volúmenes: `docker-compose down -v`
2. Reconstruir: `docker-compose up --build -d`
3. Verificar usuario: `docker-compose exec client-vue whoami`

### ¿Funciona en producción?
Sí. El mismo Dockerfile funciona tanto en desarrollo como en producción.

### ¿Necesito cambiar algo en mi código?
No. Todos los cambios son en configuración de Docker, no en el código de la aplicación.

---

**Implementación completada ✅**
**Problema resuelto ✅**
**Listo para usar ✅**


