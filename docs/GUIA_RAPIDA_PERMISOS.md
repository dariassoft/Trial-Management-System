# 🚀 Guía Rápida - Implementar Solución de Permisos

## El Problema (en resumen)
```
EACCES: permission denied, open '/app/.nuxt/tsconfig.json'
```
**Causa:** El contenedor Docker corre como root y genera archivos que el host no puede modificar.

---

## La Solución (en resumen)
✅ Usar un Dockerfile con usuario no-root (`nuxt:1001`)
✅ Usar volúmenes nombrados para `.nuxt` y `.output` (no los sincronices con host)
✅ Montar solo los directorios de código fuente

---

## Implementación (4 Pasos)

### 1️⃣ Verificar que los archivos estén en su lugar

```bash
ls -la tms-client-vue/Dockerfile
# Debe existir ✓

cat docker-compose.yml | grep "client-vue" -A 30
# Debe mostrar la nueva configuración ✓
```

### 2️⃣ Limpiar volúmenes antiguos

```bash
docker-compose down -v
```

### 3️⃣ Reconstruir

```bash
docker-compose up --build -d
```

O usar el script:
```bash
./scripts/rebuild_docker.sh
```

### 4️⃣ Verificar

```bash
# Ver qué usuario ejecuta el contenedor
docker-compose exec client-vue whoami
# Esperado: nuxt ✓

# Ver permisos de .nuxt
docker-compose exec client-vue ls -la /app/.nuxt
# Esperado: propietario nuxt:nodejs ✓

# Ejecutar build
docker-compose exec client-vue npm run build
# Esperado: ✓ Sin errores EACCES ✓
```

---

## Lo Que Cambió

| Antes | Después |
|-------|---------|
| `./tms-client-vue:/app` (TODO montado) | Solo directorios específicos montados |
| Contenedor como root | Contenedor como usuario `nuxt` |
| `.nuxt` en directorio sincronizado | `.nuxt` en volumen nombrado (Docker gestiona) |
| Error manual: `sudo chown` | ✅ Funcionan automáticamente los permisos |

---

## Archivos Creados/Modificados

✅ **Creado:** `tms-client-vue/Dockerfile`
✅ **Actualizado:** `docker-compose.yml`
✅ **Creado:** `scripts/rebuild_docker.sh`
✅ **Creado:** `docs/SOLUCION_PERMISOS_DOCKER_NUXT.md` (documentación completa)

---

## Próximos Comandos

```bash
# Si todo funciona, reconstruye el frontend
docker-compose exec client-vue npm run build

# Verifica logs
docker-compose logs -f client-vue

# Accede a http://localhost:3001
```

---

## ¿Qué son los Volúmenes Nombrados?

En el `docker-compose.yml`:

```yaml
volumes:
  nuxt_build: /app/.nuxt          # ← Volumen nombrado (Docker gestiona)
```

vs.

```yaml
volumes:
  - ./tms-client-vue/pages:/app/pages  # ← Directorio del host sincronizado
```

**Diferencia:**
- **Volumen nombrado** (`nuxt_build`): Docker crea/gestiona en su almacenamiento. Los permisos los maneja Docker. No visible desde el host.
- **Directorio sincronizado** (`./tms-client-vue/pages`): Sincronizado con el host. Conflictos de permisos si el contenedor es root.

**Por qué funciona ahora:**
- Los archivos generados (`.nuxt`, `.output`) están en volúmenes nombrados → sin conflictos de permisos
- Los archivos de código fuente están sincronizados → puedes editarlos desde el host
- El contenedor ejecuta como usuario `nuxt` (no root) → permisos consistentes

---

## Troubleshooting

### Aún ves errores de permisos?

```bash
# Asegúrate de haber limpiado los volúmenes
docker-compose down -v

# Reconstruye desde cero
docker-compose up --build -d

# Verifica que el usuario sea correcto
docker-compose exec client-vue whoami  # Debe mostrar: nuxt
```

### ¿No construye la imagen?

```bash
# Ve los logs
docker-compose logs client-vue

# Si hay error de build, verifica que el Dockerfile existe
ls -la tms-client-vue/Dockerfile
```

---

## 📚 Documentación Completa

Para entender en profundidad la solución, lee:
👉 `docs/SOLUCION_PERMISOS_DOCKER_NUXT.md`


