# 🐳 ANÁLISIS: Error de Ruta Duplicada en Docker

**Fecha**: Diciembre 11, 2025  
**Problema**: Rutas duplicadas en docker-compose cuando se ejecutan comandos  
**Causa**: Ejecución desde ubicación incorrecta  
**Solución**: Ejecutar desde la raíz del proyecto  

---

## 🔴 EL ERROR

**Síntomas**:
```
ERROR: build path /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-backend 
       either does not exist, is not accessible, or is not a valid URL.
```

**Problema visible**: La carpeta `tms-backend` aparece duplicada:
```
❌ /media/Datos/.../tms-backend/tms-backend  (INCORRECTO)
✅ /media/Datos/.../tms-backend               (CORRECTO)
```

---

## 🔍 CAUSA RAÍZ

El archivo `docker-compose.frontend.yml` define rutas relativas:

```yaml
# Ubicación: /media/Datos/Projects/.../tms-backend/tms-client-vue/docker-compose.frontend.yml

services:
  tms-backend:
    build:
      context: ../tms-backend    # ← RUTA RELATIVA
      dockerfile: Dockerfile
```

**¿Qué pasaba?**:

### ❌ INCORRECTO: Ejecutar desde `/tms-backend`

```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend

# Comando ejecutado:
docker-compose -f tms-client-vue/docker-compose.frontend.yml up -d

# Docker resuelve la ruta relativa así:
# Ubicación actual: /media/Datos/.../TrialManagementSystem/tms-backend
# Archivo: tms-backend/tms-client-vue/docker-compose.frontend.yml
# Contexto relativo: ../tms-backend

# Cálculo de ruta:
# /media/Datos/.../TrialManagementSystem/tms-backend/.. = /media/Datos/.../TrialManagementSystem
# /media/Datos/.../TrialManagementSystem + /tms-backend = /media/Datos/.../TrialManagementSystem/tms-backend
# ✅ Hasta aquí va bien

# PERO Docker interpreta "../tms-backend" como:
# Partir desde: /media/Datos/.../TrialManagementSystem/tms-backend (ubicación actual)
# ../tms-backend = /media/Datos/.../TrialManagementSystem/tms-backend/tms-backend
# ❌ ¡RUTA DUPLICADA!
```

### ✅ CORRECTO: Ejecutar desde raíz del proyecto

```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# Comando ejecutado:
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml up -d

# Docker resuelve la ruta relativa así:
# Ubicación actual: /media/Datos/.../TrialManagementSystem
# Archivo: tms-backend/tms-client-vue/docker-compose.frontend.yml
# Contexto relativo: ../tms-backend

# Cálculo de ruta:
# /media/Datos/.../TrialManagementSystem/.. = /media/Datos/.../Projects/WebstormProjects
# ❌ ¡ESPERA, eso está mal!

# En realidad Docker lo calcula desde la ubicación del docker-compose.yml:
# Ubicación del yml: /media/Datos/.../TrialManagementSystem/tms-backend/tms-client-vue/
# ../tms-backend = /media/Datos/.../TrialManagementSystem/tms-backend
# ✅ ¡CORRECTO!
```

---

## ✅ LA SOLUCIÓN

**Regla simple**:

```
✅ Ejecutar SIEMPRE Docker desde la raíz del proyecto:
   /media/Datos/Projects/WebstormProjects/TrialManagementSystem

❌ NUNCA desde subdirectorios como:
   /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
```

### Estructura de carpetas

```
/media/Datos/Projects/WebstormProjects/TrialManagementSystem/  ← EJECUTAR DOCKER DESDE AQUÍ
├── tms-backend/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── tms-client-vue/
│   │   ├── docker-compose.frontend.yml  ← Usa context: ../tms-backend
│   │   ├── Dockerfile
│   │   └── ...
│   └── ...
└── ...
```

### Comandos correctos

```bash
# ✅ CORRECTO - Desde raíz del proyecto
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# Backend
docker-compose -f tms-backend/docker-compose.yml up -d
docker-compose -f tms-backend/docker-compose.yml exec app bash

# Frontend  
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml up -d
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml exec nuxt bash
```

---

## 📚 DOCUMENTACIÓN ACTUALIZADA

Se actualizaron estos archivos para reflejar la solución correcta:

1. **gemini-rules.md**
   - Agregada sección "📍 DIRECTORIO CORRECTO PARA DOCKER"
   - Explica por qué se duplica la ruta
   - Todos los ejemplos ahora desde raíz del proyecto

2. **PLAN_MAESTRO.md**
   - Advertencia clara: Ejecutar desde raíz
   - Razón de la ruta duplicada

3. **REFERENCIA_RUTAS.md**
   - Destacada advertencia de ruta correcta
   - Comandos actualizados

---

## 🎯 PREVENCIÓN FUTURA

**Para que no me ocurra a mí (IA Assistant) nuevamente**:

1. **Verificar**: Antes de cualquier comando Docker, verificar que estoy en:
   ```
   /media/Datos/Projects/WebstormProjects/TrialManagementSystem
   ```

2. **Nunca asumir**: No asumir que estoy en la carpeta backend aunque el archivo esté en `tms-backend/`

3. **Usar rutas completas**: Si uso `docker-compose`, siempre con `-f tms-backend/...`

4. **Verificar en documentación**: Consultar `gemini-rules.md` sección "📍 DIRECTORIO CORRECTO PARA DOCKER"

---

## 📝 TABLA DE REFERENCIA RÁPIDA

| Tarea | Ubicación Correcta | Comando |
|-------|-------------------|---------|
| Iniciar Backend | `/TrialManagementSystem` | `docker-compose -f tms-backend/docker-compose.yml up -d` |
| Entrar Backend | `/TrialManagementSystem` | `docker-compose -f tms-backend/docker-compose.yml exec app bash` |
| Iniciar Frontend | `/TrialManagementSystem` | `docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml up -d` |
| Entrar Frontend | `/TrialManagementSystem` | `docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml exec nuxt bash` |
| Ver logs Backend | `/TrialManagementSystem` | `docker-compose -f tms-backend/docker-compose.yml logs -f app` |
| Ver logs Frontend | `/TrialManagementSystem` | `docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml logs -f nuxt` |

---

**Conclusión**: El problema fue ejecutar Docker desde una ubicación que causaba que las rutas relativas se calcularan incorrectamente. La solución es simple: **ejecutar siempre desde la raíz del proyecto**.


