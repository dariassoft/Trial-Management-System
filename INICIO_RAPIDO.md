# 🚀 INICIO RÁPIDO - LEE ESTO PRIMERO

**Para cualquier tarea con IA Assistants en el proyecto TMS**

---

## 📍 DONDE ESTOY

```
📂 Proyecto: Trial Management System (TMS)
📍 Ubicación Backend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
📍 Ubicación Frontend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue
```

---

## ⚡ 30 SEGUNDOS: LO QUE NECESITAS SABER

### 1. Rutas (Copiar/Pegar siempre)
```
Backend:  /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
Frontend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue
```

### 2. Docker (⚠️ IMPORTANTE)
```bash
# Backend (NestJS)
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose exec app bash

# Frontend (Nuxt)
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose -f tms-client-vue/docker-compose.frontend.yml exec nuxt bash
```

❌ **NO** ejecutar: `npm install`, `npm start` en tu PC  
✅ **SIEMPRE**: Dentro de los contenedores Docker

### 3. Documentos (Leer en orden)
1. `gemini-rules.md` (Estructura)
2. `DOCUMENTACION_REFERENCIA.md` (Guía)
3. `TEMPLATE_PROMPTS.md` (Copiar template)
4. `PLAN_MAESTRO.md` (Ver estado)

---

## 🎯 ¿QUÉ QUIERO HACER?

### Quiero trabajar en una tarea nueva
```
1. Lee: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/PLAN_MAESTRO.md
2. Copia template de: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md
3. Llena placeholders
4. Envía a IA Assistant
```

### Quiero consultar estructura
```
Lee: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md
```

### Quiero ver rutas rápidamente
```
Lee: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/REFERENCIA_RUTAS.md
```

### Quiero entender cómo usar con IA
```
Lee: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/DOCUMENTACION_REFERENCIA.md
```

### Quiero compilar/ejecutar
```
1. cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
2. docker-compose up -d
3. docker-compose exec app bash
4. npm run build (o npm start, npm run dev)
```

---

## 📚 LOS 5 DOCUMENTOS CLAVE

| # | Documento | Para Qué | Ubicación |
|---|-----------|----------|-----------|
| 1 | **gemini-rules.md** | Entender estructura + Docker | `/tms-backend/gemini-rules.md` |
| 2 | **DOCUMENTACION_REFERENCIA.md** | Cómo usar con IA | `/tms-backend/DOCUMENTACION_REFERENCIA.md` |
| 3 | **TEMPLATE_PROMPTS.md** | Copiar templates | `/tms-backend/TEMPLATE_PROMPTS.md` |
| 4 | **PLAN_MAESTRO.md** | Ver roadmap + estado | `/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md` |
| 5 | **REFERENCIA_RUTAS.md** | Consulta rápida rutas | `/tms-backend/REFERENCIA_RUTAS.md` |

---

## 🤖 USAR CON IA ASSISTANT (Copilot, Gemini, etc.)

### Step 1: Copiar esto en el primer mensaje
```
CONTEXTO:
Backend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
Frontend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue

Documentos:
- /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md
- /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/DOCUMENTACION_REFERENCIA.md
- /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md
- /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md

⚠️ Docker - Backend: docker-compose exec app bash
⚠️ Docker - Frontend: docker-compose -f tms-client-vue/docker-compose.frontend.yml exec nuxt bash

Tarea: [ESPECIFICAR]
```

### Step 2: Enviar prompt del template
- Ir a: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md`
- Copiar template
- Llenar espacios
- Enviar

---

## ⚠️ ERRORES COMUNES

### Error: "npm: command not found"
```
❌ Problema: Ejecutaste npm en tu PC
✅ Solución: Entrar a contenedor primero
   docker-compose exec app bash
   npm run build
```

### Error: "Cannot find tsconfig.json"
```
❌ Problema: No estás en /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
✅ Solución: 
   cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
```

### Error: "Docker daemon not running"
```
❌ Problema: Docker no está iniciado
✅ Solución: Inicia Docker Desktop o el servicio Docker en tu PC
```

### IA no sabe dónde están los archivos
```
❌ Problema: No incluiste rutas absolutas
✅ Solución: Siempre copia/pega:
   /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
```

---

## 🎯 FLUJO TÍPICO

```
1. Quiero hacer X
        ↓
2. Leo PLAN_MAESTRO.md para ver estado
        ↓
3. Copio template de TEMPLATE_PROMPTS.md
        ↓
4. Incluyo rutas absolutas
        ↓
5. Envío a IA Assistant
        ↓
6. IA lee gemini-rules.md automáticamente
        ↓
7. IA hace los cambios
        ↓
8. Actualizo PLAN_MAESTRO.md
```

---

## 📞 REFERENCIAS RÁPIDAS

**¿Dónde está...?**
- Backend: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend`
- Frontend: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue`
- Docker Backend: `docker-compose exec app bash`
- Docker Frontend: `docker-compose -f tms-client-vue/docker-compose.frontend.yml exec nuxt bash`

**¿Cómo...?**
- Compilar: `cd /tms-backend && docker-compose exec app bash && npm run build`
- Iniciar dev: `docker-compose up -d && docker-compose -f tms-client-vue/docker-compose.frontend.yml up -d`
- Ver logs: `docker-compose logs -f app`
- Entender estructura: Leer `gemini-rules.md`

---

## ✅ CHECKLIST ANTES DE EMPEZAR

- [ ] Leí este archivo (INICIO_RÁPIDO.md)
- [ ] Copié rutas absolutas
- [ ] Leí `gemini-rules.md`
- [ ] Entiendo cómo funciona Docker
- [ ] Tengo los 4 documentos listos para compartir con IA
- [ ] Sé cuál es mi tarea

---

## 🚀 AHORA SÍ, COMIENZA

**Si estás listo, elige uno:**

👉 **Quiero ver el roadmap completo**
→ Lee: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md`

👉 **Quiero empezar una tarea nueva**
→ Copia template: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md`

👉 **Quiero entender la estructura**
→ Lee: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md`

👉 **Quiero ver rutas rápidamente**
→ Lee: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/REFERENCIA_RUTAS.md`

---

**Última actualización**: Diciembre 11, 2025

🔖 **Bookmark esta página para acceso rápido**

