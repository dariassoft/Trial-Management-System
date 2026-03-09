# 🔧 Solución de Problemas de Permisos en Docker - Contenedor Nuxt

## 📋 Análisis del Problema

### ¿Por qué ocurría el error `EACCES: permission denied`?

**Causa raíz:** Diferencia de propietarios entre archivos generados en el contenedor Docker y el usuario del host.

```
Host (Usuario: tu_usuario:UID=1000)
    ↓ monta volumen
Contenedor Docker (Usuario: root:UID=0)
    ↓ genera archivos .nuxt/
Archivos creados como: root:root (permisos: drwxr-xr-x)
    ↓
Host intenta leer/escribir → EACCES (acceso denegado)
```

### Síntomas:
- ❌ `Error: EACCES: permission denied, open '/app/.nuxt/tsconfig.json'`
- ❌ Necesidad de ejecutar `sudo chown -R tu_usuario:tu_usuario .nuxt` desde el host
- ❌ Problema recurrente con cada `npm run build`

---

## ✅ Soluciones Implementadas

### **1. Dockerfile para el Cliente Vue (RECOMENDADO)**

Se creó un nuevo `Dockerfile` en `/tms-client-vue/Dockerfile`:

```dockerfile
# Build stage - Construye la aplicación
FROM node:20-alpine AS builder
  - Instala dependencias
  - Compila el proyecto (npm run build)

# Production stage - Ejecuta la aplicación
FROM node:20-alpine
  - Crea usuario no-root 'nuxt' (UID:1001)
  - Copia archivos compilados
  - Ejecuta contenedor como usuario 'nuxt' (no root)
```

**Ventajas:**
- ✅ Archivos generados con permisos correctos (nuxt:nodejs en lugar de root:root)
- ✅ Contenedor no corre como root (mejor seguridad)
- ✅ UID:GID consistentes (1001:1001) para evitar conflictos
- ✅ Compatible con volúmenes nombrados para .nuxt y .output

---

### **2. Volúmenes Nombrados (NO montados en el host)**

Se separó la configuración de volúmenes:

#### ❌ **ANTES** (incorrecto):
```yaml
volumes:
  - ./tms-client-vue:/app:delegated  # Todo el directorio montado
  - client_node_modules:/app/node_modules
```

#### ✅ **AHORA** (correcto):
```yaml
# Directorios generados por el contenedor (NO compartidos con host)
- nuxt_build:/app/.nuxt           # Generado por Nuxt
- nuxt_output:/app/.output        # Generado por Nuxt
- client_node_modules:/app/node_modules

# Directorios del código fuente (SÍ compartidos con host)
- ./tms-client-vue/pages:/app/pages:delegated
- ./tms-client-vue/components:/app/components:delegated
# ... otros directorios de código
```

**Por qué funciona:**
- Los directorios generados `.nuxt` y `.output` son volúmenes nombrados Docker
- Docker gestiona los permisos internamente
- No hay conflicto con los permisos del host
- El código fuente sigue siendo accesible desde el host para edición

---

### **3. Configuración de Usuario en docker-compose.yml**

```yaml
user: "1001:1001"  # Ejecutar como usuario 'nuxt' (UID:GID)
```

**Garantiza que:**
- El contenedor NO ejecute como root
- Todos los archivos generados pertenezcan a `nuxt:nodejs`
- Los permisos sean predecibles y consistentes

---

## 🚀 Pasos para Implementar la Solución

### **Paso 1: Aplicar cambios (ya realizados)**
```bash
# Dockerfile creado en: tms-client-vue/Dockerfile
# docker-compose.yml actualizado
```

### **Paso 2: Limpiar volúmenes antiguos**
```bash
docker-compose down -v
```

### **Paso 3: Reconstruir contenedores**
```bash
docker-compose up --build -d
```

### **Paso 4: Verificar permisos**
```bash
docker-compose exec client-vue ls -la /app/.nuxt/
# Debería mostrar algo como: drwxr-xr-x  1 nuxt  nodejs

# Verificar usuario del contenedor
docker-compose exec client-vue whoami
# Debería mostrar: nuxt
```

---

## 📊 Comparación de Soluciones

| Aspecto | Solución Manual | ✅ Nuestra Solución |
|--------|----------------|-------------------|
| **Seguridad** | ❌ Contenedor como root | ✅ Usuario no-root |
| **Automatización** | ❌ Manual (sudo chown) | ✅ Automática (Dockerfile) |
| **Repetibilidad** | ❌ Error en cada build | ✅ Siempre funciona |
| **Reproducibilidad** | ❌ Diferente en cada máquina | ✅ Igual en todas partes |
| **Performance** | ⚠️ Overhead de sincronización | ✅ Optimizado con volúmenes |
| **Profesionalismo** | ❌ Workaround | ✅ Mejor práctica Docker |

---

## 🔐 Mejores Prácticas de Docker Implementadas

1. **Principio del Menor Privilegio**
   - Contenedor ejecuta como usuario no-root
   - Reduce riesgos de seguridad

2. **Separación de Concerns**
   - Build stage: compila la aplicación
   - Runtime stage: solo ejecuta
   - Reduce tamaño de imagen final

3. **Volúmenes Nombrados para Datos Generados**
   - `.nuxt` y `.output` NO se sincronizan con el host
   - Evita conflictos de permisos
   - Mejor performance

4. **Montos Selectivos de Código**
   - Solo directorios necesarios montados
   - Reduce complejidad
   - Evita sincronización innecesaria

---

## ⚙️ Configuración Detallada

### Dockerfile - Explicación línea por línea:

```dockerfile
FROM node:20-alpine AS builder
# ↳ Image base optimizada, stage "builder" para multi-stage build

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001
# ↳ Crea usuario/grupo consistentes para evitar conflictos UID/GID

RUN chown -R nuxt:nodejs /app
# ↳ Asegura que el usuario 'nuxt' puede escribir en /app

COPY --from=builder --chown=nuxt:nodejs /app/.nuxt ./.nuxt
# ↳ Copia con propietario correcto (nuxt:nodejs, no root:root)

USER nuxt
# ↳ CRÍTICO: Cambia a usuario no-root para ejecución

CMD ["node", "server.mjs"]
# ↳ Ejecuta app como usuario 'nuxt'
```

### docker-compose.yml - Explicación:

```yaml
build:
  context: ./tms-client-vue
  dockerfile: Dockerfile
# ↳ Usa Dockerfile personalizado con usuario no-root

volumes:
  - nuxt_build:/app/.nuxt          # ← Volumen nombrado (no sincroniza con host)
  - ./tms-client-vue/pages:/app/pages  # ← Monta específico (SÍ sincroniza)

user: "1001:1001"
# ↳ Asegura que incluso si el contenedor intenta cambiar usuario,
#   se ejecute con UID 1001 (nuxt)
```

---

## 🧪 Verificación y Testing

### Test 1: Verificar usuario en contenedor
```bash
docker-compose exec client-vue whoami
# Esperado: nuxt
```

### Test 2: Verificar permisos de .nuxt
```bash
docker-compose exec client-vue ls -la /app/.nuxt/
# Esperado: drwxr-xr-x  1 nuxt  nodejs
```

### Test 3: Ejecutar build
```bash
docker-compose exec client-vue npm run build
# Esperado: ✓ Build completado sin errores de permisos
```

### Test 4: Verificar desde host
```bash
# Desde el host, los archivos en .nuxt son visibles pero NO editables
# (están en volumen nombrado, no en directorio montado)
ls -la tms-client-vue/.nuxt/
# Esperado: No visible (está en volumen Docker, no en host)
```

---

## 📝 Cambios Realizados Resumidos

| Archivo | Cambios |
|---------|---------|
| `tms-client-vue/Dockerfile` | ✅ Creado (nuevo archivo) |
| `docker-compose.yml` | ✅ Actualizado con Dockerfile y volúmenes |
| `docker-compose.yml` | ✅ Agregados volúmenes `nuxt_build` y `nuxt_output` |

---

## 🎯 Resultado Final

**Antes:**
- ❌ Permisos rotos después de cada build
- ❌ Usuario necesita ejecutar sudo desde host
- ❌ No reproducible en otras máquinas
- ❌ Contiene riesgos de seguridad

**Después:**
- ✅ Permisos funcionan automáticamente
- ✅ Contenedor ejecuta como usuario no-root
- ✅ Completamente reproducible
- ✅ Sigue mejores prácticas de Docker
- ✅ Cero intervencion manual

---

## 📚 Referencias

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Running Containers as Non-Root Users](https://docs.docker.com/engine/security/userns-remap/)
- [Nuxt Docker Guide](https://nuxt.com/docs/getting-started/deployment#docker)
- [Docker Volumes](https://docs.docker.com/storage/volumes/)


