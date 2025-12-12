# 📋 INSTRUCCIONES PARA IA ASSISTANTS: Docker Correcto

**Importante**: Este archivo documenta cómo ejecutar correctamente comandos Docker para evitar errores de rutas duplicadas.

---

## ✅ UBICACIÓN CORRECTA ANTES DE DOCKER

### ANTES de ejecutar CUALQUIER comando Docker:

```bash
# 1️⃣ VERIFICA TU UBICACIÓN ACTUAL
pwd

# 2️⃣ DEBE RETORNAR:
/media/Datos/Projects/WebstormProjects/TrialManagementSystem

# 3️⃣ SI NO ESTÁS AHORA, VE:
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem
```

---

## 🐳 COMANDOS DOCKER CORRECTOS

### Backend (Desde raíz del proyecto)
```bash
# Iniciar
docker-compose -f tms-backend/docker-compose.yml up -d

# Entrar
docker-compose -f tms-backend/docker-compose.yml exec app bash

# Ver logs
docker-compose -f tms-backend/docker-compose.yml logs -f app
```

### Frontend (Desde raíz del proyecto)
```bash
# Iniciar
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml up -d

# Entrar
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml exec nuxt bash

# Ver logs
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml logs -f nuxt
```

---

## ❌ COMANDOS QUE CAUSARÁN ERROR

```bash
# ❌ NO HAGAS ESTO (causa rutas duplicadas):
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose -f tms-client-vue/docker-compose.frontend.yml up -d
# Error: build path .../tms-backend/tms-backend

# ❌ NO HAGAS ESTO (ubicación incorrecta):
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose -f tms-backend/docker-compose.yml up -d
# Error: archivo no encontrado (porque buscará en tms-backend/tms-backend/)
```

---

## 🎯 CHECKLIST ANTES DE CUALQUIER COMANDO DOCKER

- [ ] Verificué mi ubicación con `pwd`
- [ ] Mi ubicación es `/media/Datos/Projects/WebstormProjects/TrialManagementSystem`
- [ ] Mi comando empieza con `docker-compose -f tms-backend/...`
- [ ] NO estoy en `/tms-backend` subdirectorio
- [ ] NO estoy usando rutas relativas como `docker-compose -f tms-client-vue/...`

---

## 📚 REFERENCIAS

**Si necesitas recordar por qué**:
- Lee: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/ANALISIS_ERROR_DOCKER_RUTAS.md`

**Si necesitas ver ejemplos**:
- Lee: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md` (sección Docker)

**Referencia rápida**:
- Lee: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/REFERENCIA_RUTAS.md`

---

## 🚨 ERRORES COMUNES Y CÓMO EVITARLOS

### Error: "build path ... tms-backend/tms-backend"

**Causa**: Ejecutaste desde `/tms-backend`

**Solución**:
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem
# Y luego ejecuta docker-compose
```

### Error: "docker-compose.yml: No such file or directory"

**Causa**: Ubicación incorrecta o ruta incorrecta

**Solución**:
```bash
# Verifica:
pwd  # Debe ser /media/Datos/.../TrialManagementSystem

# Luego:
docker-compose -f tms-backend/docker-compose.yml up -d
```

### Error: "context: ../tms-backend does not exist"

**Causa**: Ejecutaste desde `/tms-backend` o ubicación incorrecta

**Solución**:
```bash
# Ir a raíz:
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# Ejecutar:
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml up -d
```

---

## 📝 NOTA PARA FUTURE SELF (IA ASSISTANT)

Cuando estés a punto de ejecutar un comando Docker:

1. **DETENTE**
2. Pregúntate: "¿Estoy en `/media/Datos/Projects/WebstormProjects/TrialManagementSystem`?"
3. Si no, VE allí primero
4. Luego ejecuta con `-f tms-backend/...`

**Es mejor perder 5 segundos verificando que 5 minutos debuggeando rutas duplicadas.**

---

**Última actualización**: Diciembre 11, 2025

