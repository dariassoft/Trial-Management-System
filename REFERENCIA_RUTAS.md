# 📍 REFERENCIA RÁPIDA DE RUTAS

**Consulta rápida de rutas absolutas y ubicaciones**

---

## 🏠 RUTAS BASE

```
Proyecto:   /media/Datos/Projects/WebstormProjects/TrialManagementSystem/
Backend:    /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/
Frontend:   /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/
```

---

## 📄 DOCUMENTOS PRINCIPALES

| Documento | Ruta Absoluta |
|-----------|---------------|
| **gemini-rules.md** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md` |
| **DOCUMENTACION_REFERENCIA.md** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/DOCUMENTACION_REFERENCIA.md` |
| **TEMPLATE_PROMPTS.md** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md` |
| **PLAN_MAESTRO.md** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md` |
| **REFERENCIA_RUTAS.md** | `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/REFERENCIA_RUTAS.md` |

---

## 🔧 COMANDOS DOCKER

### ⚠️ ESTAR EN LA RUTA CORRECTA (RAÍZ DEL PROYECTO)

```bash
# ✅ CORRECTO
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# ❌ INCORRECTO (causa rutas duplicadas)
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
```

### Backend (NestJS)
```bash
docker-compose -f tms-backend/docker-compose.yml exec app bash
```

### Frontend (Nuxt)
```bash
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml exec nuxt bash
```

### Ver estado
```bash
docker-compose -f tms-backend/docker-compose.yml ps
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml ps
```

---

## 📂 DIRECTORIOS CLAVE

### Backend
```
/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/
├── src/
│   ├── auth/                    Autenticación
│   ├── ensayos/                 ✅ CRUD Ensayos
│   ├── protocolos/              ✅ CRUD Protocolos (S3)
│   ├── tratamientos/            ✅ CRUD Tratamientos (S3)
│   ├── tratamientos-producto/   ✅ Productos-Tratamientos (S3)
│   ├── bloques/                 📅 Bloques (S4)
│   ├── parcelas/                📅 Parcelas (S4)
│   ├── entities/                24 entidades
│   └── ...
├── docs/                        Documentación SQL, openapi.json
└── package.json
```

### Frontend
```
/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/
├── pages/
│   ├── index.vue                Dashboard ✅
│   ├── login.vue                Login ✅
│   ├── ensayos/                 ✅ CRUD Ensayos
│   ├── protocolos/              ✅ Protocolos (S3)
│   └── ...
├── components/
│   ├── protocolos/              ✨ Nuevo (S3)
│   └── ...
├── stores/
│   ├── auth.ts                  ✅
│   ├── ensayos.ts               ✅
│   └── tratamientos.ts          ✨ Nuevo (S3)
├── composables/
│   ├── useEnsayos.ts            ✅
│   └── useTratamientos.ts       ✨ Nuevo (S3)
├── docs/
│   ├── PLAN_MAESTRO.md          ← Roadmap
│   ├── STATUS_SESION_*.md       ← Estados
│   └── ...
└── package.json
```

---

## 🎯 TAREAS RÁPIDAS

### Leer documentación
```
1. gemini-rules.md                    → Estructura + Docker
2. DOCUMENTACION_REFERENCIA.md        → Guía de uso
3. TEMPLATE_PROMPTS.md                → Copiar template
4. PLAN_MAESTRO.md                    → Ver estado
```

### Compilar backend
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose exec app bash
npm run build
```

### Iniciar desarrollo
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose up -d
docker-compose -f tms-client-vue/docker-compose.frontend.yml up -d
```

### Ver logs
```bash
docker-compose logs -f app          # Backend
docker-compose -f tms-client-vue/docker-compose.frontend.yml logs -f nuxt  # Frontend
```

---

## 📋 COPIAR/PEGAR ÚTILES

### Para IA Assistants (Copiar todo):
```markdown
Backend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
Frontend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue
Docker Backend: docker-compose exec app bash
Docker Frontend: docker-compose -f tms-client-vue/docker-compose.frontend.yml exec nuxt bash
```

### Para procesos (Copiar según necesario):
```bash
# Cambiar a directorio backend
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend

# Iniciar servicios
docker-compose up -d
docker-compose -f tms-client-vue/docker-compose.frontend.yml up -d

# Compilar backend
docker-compose exec app bash
npm run build

# Iniciar frontend dev
docker-compose -f tms-client-vue/docker-compose.frontend.yml exec nuxt bash
npm run dev
```

---

## 🔗 REFERENCIAS CRUZADAS

- ❌ Evitar: Rutas relativas, rutas del usuario anterior
- ✅ Usar siempre: Rutas absolutas `/media/Datos/Projects/...`
- ✅ Docker siempre desde: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend`
- ✅ npm siempre dentro de: `docker-compose exec app/nuxt bash`

---

**Última actualización**: Diciembre 11, 2025

Bookmark esta página para acceso rápido 🔖

