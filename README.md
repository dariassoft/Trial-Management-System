# 🚀 Trial Management System (TMS)

**Versión**: 3.0 | **Actualizado**: Diciembre 11, 2025  
**Estado**: ✅ Sesión 3 Completada | 📅 Listo para Sesión 4

---

## 📍 RUTAS ABSOLUTAS (TU MÁQUINA)

```
Proyecto:  /media/Datos/Projects/WebstormProjects/TrialManagementSystem/
Backend:   /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
Frontend:  /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue
```

---

## 🎯 INICIO RÁPIDO

### 1️⃣ Leer documentación (En orden)
```
1. /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/INICIO_RAPIDO.md
2. /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md
3. /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/DOCUMENTACION_REFERENCIA.md
4. /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md
5. /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md
```

### 2️⃣ Iniciar servicios
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose up -d
docker-compose -f tms-client-vue/docker-compose.frontend.yml up -d
```

### 3️⃣ Acceder
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs

---

## 🐳 DOCKER (⚠️ IMPORTANTE)

**NUNCA ejecutar npm directamente en tu PC. SIEMPRE en contenedores Docker:**

### Backend (NestJS)
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose exec app bash
# Dentro: npm install, npm start, npm run build, etc.
```

### Frontend (Nuxt 3)
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose -f tms-client-vue/docker-compose.frontend.yml exec nuxt bash
# Dentro: npm install, npm run dev, npm run build, etc.
```

---

## 📊 ESTADO DEL PROYECTO

| Sesión | Objetivo | Backend | Frontend | Docs | Status |
|--------|----------|---------|----------|------|--------|
| **S1** | Base | ✅ 50+ endpoints | ✅ Auth UI | ✅ | ✅ 100% |
| **S2** | CRUD Ensayos | ✅ Completo | ✅ Completo | ✅ | ✅ 100% |
| **S3** | CRUD Tratamientos | ✅ **Completado** | ✅ **Completado** | ✅ | ✅ 100% |
| **S4** | Bloques/Parcelas | 📅 | ⬜ | ⬜ | ⏳ Próximo |
| **S5** | Datos de Campo | 📅 | ⬜ | ⬜ | ⏳ |
| **S6** | Reportes | 📅 | ⬜ | ⬜ | ⏳ |
| **S7** | Dashboard | 📅 | 📅 | ⬜ | ⏳ |
| **S8** | Admin Panel | 📅 | ⬜ | ⬜ | ⏳ |
| **S9** | Polish | 📅 | 📅 | ⬜ | ⏳ |

---

## 📚 DOCUMENTACIÓN DISPONIBLE

### Esencial (Leer primero)
- **INICIO_RÁPIDO.md** - Entry point para todo
- **gemini-rules.md** - Estructura, reglas, Docker
- **DOCUMENTACION_REFERENCIA.md** - Guía de uso con IA
- **REFERENCIA_RUTAS.md** - Consulta rápida de rutas
- **TEMPLATE_PROMPTS.md** - 5 templates listos para copiar

### Roadmap y Estado
- **PLAN_MAESTRO.md** - Roadmap 9 sesiones completo
- **STATUS_SESION_*.md** - Estado de cada sesión completada

### Por Sesión (Completadas)
- **S1**: Setup, autenticación, base
- **S2**: CRUD Ensayos con búsqueda avanzada
- **S3**: CRUD Tratamientos y Protocolos (✨ NUEVO)

---

## 🎨 TECH STACK

### Backend
```json
{
  "framework": "NestJS 11.x",
  "orm": "TypeORM 0.3.x",
  "database": "MySQL 8.x",
  "authentication": "JWT",
  "validation": "class-validator, class-transformer",
  "api": "Swagger/OpenAPI"
}
```

### Frontend
```json
{
  "framework": "Nuxt 3",
  "vue": "Vue 3",
  "state": "Pinia",
  "styling": "TailwindCSS 3.x",
  "language": "TypeScript 5.x"
}
```

---

## ✨ CARACTERÍSTICAS

### ✅ Autenticación (S1)
- JWT con roles (SUPERADMIN, ADMIN, TECNICO)
- Login, Register, Refresh Token
- Middleware de protección de rutas

### ✅ CRUD Ensayos (S2)
- Crear, leer, actualizar, eliminar ensayos
- Búsqueda multicampo (8+ campos)
- Filtro por laboratorio, variedad, fechas
- Paginación y ordenamiento

### ✅ CRUD Tratamientos (S3)
- Crear, leer, actualizar, eliminar tratamientos
- Gestión de productos en tratamientos
- **Nuevo**: Campo `estadio` para momento de aplicación
- Búsqueda y filtros avanzados
- UI completamente responsiva

### 📅 Próximos (S4+)
- Bloques y parcelas (diseño experimental)
- Datos de campo y cosecha
- Reportes y exportación
- Dashboard avanzado

---

## 🚀 COMANDOS COMUNES

### Iniciar servicios
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose up -d
docker-compose -f tms-client-vue/docker-compose.frontend.yml up -d
```

### Compilar backend
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose exec app bash
npm run build
```

### Compilar frontend
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose -f tms-client-vue/docker-compose.frontend.yml exec nuxt bash
npm run build
```

### Ver logs
```bash
docker-compose logs -f app          # Backend
docker-compose -f tms-client-vue/docker-compose.frontend.yml logs -f nuxt  # Frontend
```

### Detener servicios
```bash
docker-compose down -v
```

---

## 📖 ESTRUCTURA DE CARPETAS

### Backend
```
/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/
├── src/
│   ├── auth/                ✅ Autenticación JWT
│   ├── ensayos/             ✅ CRUD Ensayos
│   ├── protocolos/          ✅ Protocolos (S3)
│   ├── tratamientos/        ✅ Tratamientos (S3)
│   ├── tratamientos-producto/ ✅ Productos-Tratamientos (S3)
│   ├── entities/            24 entidades TypeORM
│   └── ...
├── docs/                    Documentación
└── package.json
```

### Frontend
```
/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/
├── pages/
│   ├── index.vue            Dashboard ✅
│   ├── ensayos/             ✅ CRUD Ensayos
│   ├── protocolos/          ✅ Protocolos (S3)
│   └── ...
├── components/
│   ├── ensayos/             ✅ Componentes ensayos
│   ├── protocolos/          ✅ Componentes protocolos (S3)
│   └── ...
├── stores/
│   ├── auth.ts              ✅ Pinia auth
│   ├── ensayos.ts           ✅ Pinia ensayos
│   └── tratamientos.ts      ✨ Pinia tratamientos (S3)
├── docs/
│   └── PLAN_MAESTRO.md      Roadmap completo
└── package.json
```

---

## 🤖 USAR CON IA ASSISTANTS

### Incluir siempre en prompts:
```
Backend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
Frontend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue

Documentos:
- gemini-rules.md
- DOCUMENTACION_REFERENCIA.md
- TEMPLATE_PROMPTS.md
- PLAN_MAESTRO.md

Docker Backend: docker-compose exec app bash
Docker Frontend: docker-compose -f tms-client-vue/docker-compose.frontend.yml exec nuxt bash
```

### Usar template
1. Ve a: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md`
2. Copia template
3. Llena placeholders
4. Envía a IA Assistant

---

## ⚠️ REGLAS IMPORTANTES

1. **Docker obligatorio**: NUNCA `npm install` o `npm start` en tu PC
2. **Rutas absolutas siempre**: Usar `/media/Datos/Projects/...` completo
3. **Documentos sincronizados**: Actualizar 4 documentos juntos (gemini-rules, DOCUMENTACION_REFERENCIA, TEMPLATE_PROMPTS, PLAN_MAESTRO)
4. **IA tiene contexto**: Leer gemini-rules.md automáticamente

---

## 🔗 ACCESOS RÁPIDOS

| Qué quiero | Dónde ir |
|-----------|----------|
| Empezar rápido | `/tms-backend/INICIO_RAPIDO.md` |
| Ver estructura | `/tms-backend/gemini-rules.md` |
| Usar con IA | `/tms-backend/DOCUMENTACION_REFERENCIA.md` |
| Copiar template | `/tms-backend/TEMPLATE_PROMPTS.md` |
| Ver roadmap | `/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md` |
| Rutas rápido | `/tms-backend/REFERENCIA_RUTAS.md` |

---

## 📞 SOPORTE

**¿Algo no funciona?**
1. Leer `INICIO_RÁPIDO.md`
2. Revisar `gemini-rules.md` (sección Docker)
3. Consultar `REFERENCIA_RUTAS.md`
4. Revisar status en `PLAN_MAESTRO.md`

**¿Necesitas hacer una tarea?**
1. Copiar template de `TEMPLATE_PROMPTS.md`
2. Incluir rutas absolutas
3. Enviar a IA Assistant

---

## 📈 PRÓXIMOS PASOS

### Sesión 4 (Próxima)
- Bloques y Parcelas
- Diseño experimental
- Asignación de tratamientos

### Sesión 5+
- Datos de campo
- Aplicaciones y cosecha
- Reportes y exportación

Ver detalles completos en: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md`

---

## ✅ CHECKLIST INICIAL

- [ ] Leí `INICIO_RÁPIDO.md`
- [ ] Conozco las rutas absolutas
- [ ] Entiendo cómo funciona Docker
- [ ] Tengo los documentos listos
- [ ] Sé cómo usar templates

---

**🎉 ¡Listo para empezar!**

**Última actualización**: Diciembre 11, 2025  
**Mantenido por**: Trial Management System Team

📍 Ubicación: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/README.md`

