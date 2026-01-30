# 📚 DOCUMENTACIÓN DE REFERENCIA - TMS

**Versión**: 3.0 | **Actualizado**: Enero 29, 2026

---

## 🚀 INICIO RÁPIDO PARA IA ASSISTANTS

### Primero: Leer estos documentos clave

1. **STATUS_PROYECTO_ENERO_2026.md** (Estado Actual)
   ```
   📍 /tms-backend/STATUS_PROYECTO_ENERO_2026.md
   ⏱️ Lectura: 5 minutos
   📖 Qué contiene: Resumen ejecutivo, sesiones completadas, correcciones recientes
   ```

2. **TAREAS_PENDIENTES_GUIA.md** (Qué falta por hacer)
   ```
   📍 /tms-backend/TAREAS_PENDIENTES_GUIA.md
   ⏱️ Lectura: 10 minutos
   📖 Qué contiene: ABMs pendientes, cronograma, checklists
   ```

3. **PLAN_MEDICIONES_CAMPO.md** (Sistema de Mediciones)
   ```
   📍 /tms-backend/PLAN_MEDICIONES_CAMPO.md
   ⏱️ Lectura: 15-20 minutos
   📖 Qué contiene: Modelo de datos, flujo de trabajo, diseño UI mobile-first
   ```

4. **gemini-rules.md** (Reglas y Estructura)
   ```
   📍 /tms-backend/gemini-rules.md
   ⏱️ Lectura: 10-15 minutos
   📖 Qué contiene: Estructura, Docker, rutas, convenciones
   ```


---

## 📁 ESTRUCTURA DE CARPETAS

### Backend
```
/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/
├── src/
│   ├── auth/                    Autenticación JWT
│   ├── ensayos/                 ✅ CRUD Ensayos (S2)
│   ├── tratamientos/            📅 CRUD Tratamientos (S3)
│   ├── tratamientos-producto/   📅 Productos en Tratamientos (S3)
│   ├── bloques/                 📅 Bloques (S4)
│   ├── parcelas/                📅 Parcelas (S4)
│   ├── entities/                24 entidades TypeORM
│   └── ...
├── docs/
│   ├── openapi.json             API specification
│   ├── *.sql                    Scripts SQL
│   └── *.md                     Documentación
├── package.json
├── docker-compose.yml
├── Dockerfile
└── ...
```

### Frontend
```
/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/
├── pages/
│   ├── index.vue                Dashboard ✅ (S1)
│   ├── login.vue                Login ✅ (S1)
│   ├── ensayos/                 ✅ CRUD Ensayos (S2)
│   ├── protocolos/              ✅ CRUD Protocolos (S3)
│   ├── tratamientos/            📅 (S3)
│   ├── bloques/                 📅 (S4)
│   └── ...
├── components/
│   ├── dashboard/
│   ├── ensayos/
│   ├── protocolos/              ✨ Nuevo (S3)
│   └── ...
├── stores/
│   ├── auth.ts                  ✅ (S1)
│   ├── ensayos.ts               ✅ (S2)
│   └── tratamientos.ts          ✨ Nuevo (S3)
├── composables/
│   ├── useApi.ts
│   ├── useTheme.ts
│   ├── useEnsayos.ts            ✅ (S2)
│   └── useTratamientos.ts       ✨ Nuevo (S3)
├── docs/
│   ├── PLAN_MAESTRO.md          Roadmap
│   ├── STATUS_SESION_*.md       Estados
│   └── ...
├── package.json
├── docker-compose.frontend.yml
└── ...
```

---

## 🔍 BÚSQUEDA RÁPIDA POR TEMA

### Docker y Ejecución
- 📖 `gemini-rules.md` → Sección "EJECUCIÓN EN CONTENEDORES DOCKER"
- 📖 `ANALISIS_ERROR_DOCKER_RUTAS.md` → Análisis técnico completo (⚠️ IMPORTANTE)
- 📖 `DOCKER_INSTRUCCIONES_IA.md` → Instrucciones para IA Assistants
- 🎯 Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md`

### Estructura Backend
- 📖 `gemini-rules.md` → Sección "ESTRUCTURA DEL PROYECTO"
- 🎯 Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md`

### Endpoints API
- 📖 `gemini-rules.md` → Sección "ENDPOINTS BACKEND"
- 🎯 Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md`

### Convenciones de Código
- 📖 `gemini-rules.md` → Sección "CONVENCIONES DE CÓDIGO"
- 🎯 Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md`

### Estado del Proyecto
- 📖 `PLAN_MAESTRO.md` → Tabla de estado por sesión
- 🎯 Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md`

### Cómo crear prompts
- 📖 `TEMPLATE_PROMPTS.md` → 5 templates listos
- 🎯 Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md`

---

## 💡 CÓMO USAR ESTOS DOCUMENTOS CON IA ASSISTANTS

### Paso 1: Preparar el contexto
Cuando vas a usar un AI Assistant (Copilot, Gemini, etc.), incluye esto en el primer mensaje:

```markdown
Contexto del Proyecto TMS:

📍 Rutas Absolutas (Mi máquina):
- Backend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
- Frontend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue

📚 Documentos de Referencia:
1. /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md
2. /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/DOCUMENTACION_REFERENCIA.md
3. /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md
4. /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md

⚠️ IMPORTANTE: 
- Todos los comandos npm: docker-compose exec app bash (backend) o docker-compose -f tms-client-vue/docker-compose.frontend.yml exec nuxt bash (frontend)
- Estoy en Sesión 3 (o la que corresponda según PLAN_MAESTRO.md)
- Necesito actualizar: [especificar qué cambios]
```

### Paso 2: Usar un template de prompt
- Ir a: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md`
- Copiar el template que corresponda a tu tarea
- Llenar los placeholders `[...]`

### Paso 3: Dar instrucciones específicas
```markdown
Tarea: [Lo que necesitas]

Contexto:
- Backend ubicado en: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
- Frontend ubicado en: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue
- Sesión: [Número de sesión]
- Estado actual: [Ver PLAN_MAESTRO.md]

Cambios necesarios:
1. [Cambio 1]
2. [Cambio 2]
3. ...

IMPORTANTE: Actualizar referencias en estos archivos:
- gemini-rules.md
- DOCUMENTACION_REFERENCIA.md
- PLAN_MAESTRO.md
```

---

## 🗂️ REFERENCIAS CRUZADAS

### Para Sesión 1 (Base)
- 📖 Estado: `PLAN_MAESTRO.md` → Sesión 1
- 📖 Estructura: `gemini-rules.md` → ESTRUCTURA DEL PROYECTO
- 📖 Rutas: Cualquier documento (todas las rutas)

### Para Sesión 2 (CRUD Ensayos)
- 📖 Estado: `PLAN_MAESTRO.md` → Sesión 2
- 📖 Endpoints: `gemini-rules.md` → CRUD ENSAYOS
- 📖 Convenciones: `gemini-rules.md` → CONVENCIONES DE CÓDIGO
- 📖 Cómo hacer el prompt: `TEMPLATE_PROMPTS.md` → Template 2

### Para Sesión 3 (CRUD Tratamientos)
- 📖 Estado: `PLAN_MAESTRO.md` → Sesión 3
- 📖 Endpoints: `gemini-rules.md` → CRUD TRATAMIENTOS
- 📖 Patrón a seguir: Ver estructura de Ensayos (Sesión 2)
- 📖 Cómo hacer el prompt: `TEMPLATE_PROMPTS.md` → Template 3

### Para Sesión 4+ (Futures)
- 📖 Roadmap: `PLAN_MAESTRO.md` → Sesiones 4-9
- 📖 Patrón: Seguir mismo patrón que Sesión 2 y 3
- 📖 Cómo hacer el prompt: `TEMPLATE_PROMPTS.md` → Template genérico

---

## 📍 RUTAS CLAVE POR ARCHIVO

| Archivo | Ruta Absoluta | Propósito |
|---------|---------------|-----------|
| **gemini-rules.md** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md` | Reglas, estructura, Docker |
| **DOCUMENTACION_REFERENCIA.md** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/DOCUMENTACION_REFERENCIA.md` | Este archivo - Guía de referencia |
| **TEMPLATE_PROMPTS.md** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md` | 5 templates de prompts |
| **PLAN_MAESTRO.md** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md` | Roadmap 9 sesiones |
| **ANALISIS_ERROR_DOCKER_RUTAS.md** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/ANALISIS_ERROR_DOCKER_RUTAS.md` | ⚠️ Análisis técnico de error Docker |
| **DOCKER_INSTRUCCIONES_IA.md** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/DOCKER_INSTRUCCIONES_IA.md` | 🐳 Instrucciones para IA (LEER SI USAS DOCKER) |
| **Backend package.json** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/package.json` | Deps backend |
| **Frontend package.json** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/package.json` | Deps frontend |
| **Backend env** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/.env` | Config backend |
| **Frontend env** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/.env` | Config frontend |

---

## 🎯 CHECKLIST ANTES DE EMPEZAR CUALQUIER SESIÓN

- [ ] Leí `gemini-rules.md`
- [ ] Leí `DOCUMENTACION_REFERENCIA.md` (este archivo)
- [ ] Revisé `PLAN_MAESTRO.md` para ver estado actual
- [ ] Copié template de `TEMPLATE_PROMPTS.md`
- [ ] Incluí rutas absolutas en mis instrucciones
- [ ] Especifiqué ubicación de Docker commands
- [ ] Identifiqué qué archivos necesitan actualización

---

## 📞 REFERENCIAS RÁPIDAS

### Para ver estado de una sesión
```
→ /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md
```

### Para entender estructura y Docker
```
→ /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md
```

### Para copiar un prompt ya hecho
```
→ /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md
```

### Para entender convenciones de código
```
→ /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md → CONVENCIONES
```

### Para ver qué endpoints existen
```
→ /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md → ENDPOINTS
```

---

## 🔄 FLUJO TÍPICO DE TRABAJO

```
1. Lee PLAN_MAESTRO.md
   ↓
2. Identifica qué sesión estás en
   ↓
3. Abre template correcto en TEMPLATE_PROMPTS.md
   ↓
4. Llena placeholders con rutas absolutas
   ↓
5. Envía prompt a IA Assistant
   ↓
6. IA lee gemini-rules.md y comienza tarea
   ↓
7. Al terminar, actualiza PLAN_MAESTRO.md
```

---

## 💡 TIPS

**Tip 1**: Siempre que den error en Docker, verificar:
- Estoy en: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend`
- Comando backend: `docker-compose exec app bash`
- Comando frontend: `docker-compose -f tms-client-vue/docker-compose.frontend.yml exec nuxt bash`

**Tip 2**: Si IA no sabe donde están los archivos, copia/pega esta línea:
```
Rutas absolutas: Backend=/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend, Frontend=/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue
```

**Tip 3**: Para ver estructura actual, revisar:
```
PLAN_MAESTRO.md (estado completo)
STATUS_SESION_*.md (por sesión)
gemini-rules.md (estructura general)
```

---

**Última actualización**: Diciembre 11, 2025  
**Versión**: 2.0  
**Mantenido por**: Trial Management System Team

---

📍 **Ubicación de este archivo**: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/DOCUMENTACION_REFERENCIA.md`

