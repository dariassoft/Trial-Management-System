# 📝 TEMPLATE DE PROMPTS - Para usar con IA Assistants

**Uso**: Copia uno de estos templates y completa con tu tarea específica

**Versión**: 2.2 (Con rutas absolutas)  
**Última actualización**: Diciembre 11, 2025

---

## 📍 RUTAS ABSOLUTAS (MI MÁQUINA)

```
Backend:  /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
Frontend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue
```

---

## 🐳 IMPORTANTE: COMANDOS EN DOCKER

**Antes de usar cualquier template, lee**: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md`

**Regla de oro**: 
```
❌ NO ejecutar en host: npm install, npm start, npm run dev
✅ EJECUTAR EN CONTENEDOR desde /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend:
   - Backend: docker-compose exec app bash
   - Frontend: docker-compose -f tms-client-vue/docker-compose.frontend.yml exec nuxt bash
```

**Documentos a incluir en prompts**:
- `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md`
- `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/DOCUMENTACION_REFERENCIA.md`
- `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md`
- `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md`

---

## 📌 TEMPLATE 1: Referencia Completa (Para sesiones nuevas o cambios mayores)

```
CONTEXTO DEL PROYECTO:
========================
Proyecto: TMS (Trial Management System)
Stack: NestJS 11, TypeORM 0.3, MySQL 8, Nuxt 3, Vue 3, Pinia, TailwindCSS
Backend Path:  /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
Frontend Path: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue
Sesión: [COMPLETAR - Ver PLAN_MAESTRO.md]
Estado: [COMPLETAR - Ver PLAN_MAESTRO.md]

📍 RUTAS ABSOLUTAS:
====================
Backend:  /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
Frontend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue

🐳 DOCKER - IMPORTANTE:
=======================
Ejecutar siempre desde: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend

Backend (NestJS + MySQL):
  docker-compose exec app bash
  # Dentro: npm install, npm start, npm run build

Frontend (Nuxt 3):
  docker-compose -f tms-client-vue/docker-compose.frontend.yml exec nuxt bash
  # Dentro: npm install, npm run dev, npm run build

❌ NO ejecutar npm en host - SIEMPRE EN CONTENEDORES

📚 DOCUMENTOS DE REFERENCIA:
============================
1. /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md
2. /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/DOCUMENTACION_REFERENCIA.md
3. /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md
4. /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md

TAREA:
======
[COMPLETAR - Describe lo que necesitas hacer]

CAMBIOS NECESARIOS:
===================
[COMPLETAR - Lista de cambios específicos]

IMPORTANTE - ACTUALIZAR DESPUÉS:
=================================
✅ /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/gemini-rules.md
✅ /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/DOCUMENTACION_REFERENCIA.md
✅ /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md
```

DOCUMENTACIÓN REFERENCIA:
========================
1. Reglas y Docker: /tms-backend/gemini-rules.md
2. Referencias: /tms-backend/DOCUMENTACION_REFERENCIA.md
3. Templates: /tms-backend/TEMPLATE_PROMPTS.md
4. Roadmap: /tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md

INFORMACIÓN CLAVE:
========================
- Sesión actual: Sesión 3 - CRUD Tratamientos (próxima)
- BD: 24 entidades TypeORM con índices optimizados
- Endpoints: 50+ funcionales en backend
- Frontend: 4 páginas (Auth, Dashboard, CRUD Ensayos)
- Búsqueda: 8 campos case-insensitive + laboratorio + variedad + rango fechas
- Convenciones: Backend (kebab-case), Frontend (PascalCase/camelCase), BD (snake_case)

MI TAREA:
========================
[DESCRIBE EXACTAMENTE LO QUE QUIERES HACER]

Ejemplo:
"Quiero crear el CRUD completo para Tratamientos en Sesión 3"
o
"Quiero agregar un nuevo filtro para Ensayos"
o
"Quiero arreglar [PROBLEMA ESPECÍFICO]"

DETALLES ADICIONALES:
========================
[Agrega aquí detalles específicos, archivos afectados, URLs, etc.]
```

---

## 📌 TEMPLATE 2: Referencia Rápida (Para cambios menores o específicos)

```
PROYECTO: TMS - Sesión [N/9] en progreso

NECESITO: [QUÉ QUIERES HACER - Ser específico]

CONTEXTO RÁPIDO:
- Stack: NestJS backend + Nuxt frontend + Pinia + TailwindCSS
- Patrón: Ver Sesión 2 CRUD Ensayos en /tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md
- Convenciones: /tms-backend/gemini-rules.md

ARCHIVO(S) AFECTADO(S):
[Lista los archivos que necesitas cambiar]

PROBLEMA O TAREA:
[Describe el problema específico o tarea]

QUE ESPERO:
[Qué resultado esperas al final]
```

---

## 📌 TEMPLATE 3: Nueva Sesión (Para iniciar sesiones nuevas 3-9)

```
INICIANDO SESIÓN [N] - [NOMBRE SESIÓN]

DOCUMENTACIÓN:
==============
Revisar antes de empezar:
1. /tms-backend/gemini-rules.md (línea XXX - descripción general)
2. /tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md (búscar "Sesión [N]")
3. /tms-backend/tms-client-vue/docs/STATUS_SESION_[N-1].md (patrón referencia)

PATRÓN A SEGUIR:
===============
Copiar estructura de Sesión 2 CRUD Ensayos:
- Backend: DTOs, Controller, Service con búsqueda
- Frontend: Store, Composable, Components (Form, Table), Pages
- DB: Agregar/modificar tablas según sea necesario

TAREAS PARA ESTA SESIÓN:
=======================
[Copia las tareas de PLAN_MAESTRO.md para esta sesión]

Ejemplo para Sesión 3:
- [ ] Store: tratamientos.ts
- [ ] Composable: useTratamientos.ts
- [ ] Componentes: TratamientoForm.vue, TratamientoTable.vue
- [ ] Páginas: CRUD (list, new, [id], [id]/edit)
- [ ] Búsqueda: nombre + tipo + filtros
- [ ] Integración: Productos M:N

INFORMACIÓN BACKEND (YA EXISTE):
================================
- Entidad: src/entities/tratamiento.entity.ts
- Controller: src/tratamientos/tratamientos.controller.ts
- Service: src/tratamientos/tratamientos.service.ts
- DTOs: src/tratamientos/dto/

DURACIÓN ESTIMADA:
==================
[Copia duración de PLAN_MAESTRO.md] - Ejemplo: 2-3 horas

VAMOS A EMPEZAR CON:
===================
[Primera tarea específica - normalmente backend o store setup]
```

---

## 📌 TEMPLATE 4: Debugging/Problema (Cuando algo no funciona)

```
PROYECTO: TMS
PROBLEMA: [DESCRIBE EL PROBLEMA]

UBICACIÓN:
==========
Ruta: [RUTA DEL ARCHIVO]
Componente/Módulo: [NOMBRE]
Línea: [NÚMERO si lo sabes]

QUÉ ESTÁ PASANDO:
================
[Describe el error o comportamiento incorrecto]

QUÉ DEBERÍA PASAR:
==================
[Describe el comportamiento esperado]

CONTEXTO TÉCNICO:
================
- Stack: [Backend/Frontend] - [Tecnología específica]
- Sesión: [N/9]
- Función afectada: [NOMBRE FUNCIÓN/COMPONENTE]
- Último cambio: [Qué cambio provocó el error, si lo sabes]

DOCUMENTACIÓN REFERENCIA:
=========================
- gemini-rules.md (línea XXX - convenciones)
- PLAN_MAESTRO.md (Sesión [N])

PASOS QUE INTENTÉ:
==================
1. [Lo que ya intentaste]
2. [Lo que ya intentaste]
3. [Lo que ya intentaste]

CÓDIGO PROBLEMÁTICO:
====================
[Pega el código específico que causa problema, o describe la lógica]

INFORMACIÓN ADICIONAL:
======================
- Error exacto de consola (si hay)
- URL donde falla (si es frontend)
- Request/Response (si es API)
```

---

## 📌 TEMPLATE 5: Code Review (Cuando quieres que revise código)

```
PROYECTO: TMS - Sesión [N]

ARCHIVOS A REVISAR:
===================
1. [RUTA ARCHIVO 1]
2. [RUTA ARCHIVO 2]
3. [RUTA ARCHIVO 3]

CONTEXTO:
=========
Tipo: [Backend/Frontend]
Propósito: [Qué hace este código]
Referencia: [Link a sesión en PLAN_MAESTRO.md]

QUE REVISES:
============
- [ ] Convenciones de código (según gemini-rules.md)
- [ ] Tipado TypeScript
- [ ] Errores potenciales
- [ ] Performance
- [ ] Seguridad
- [ ] Consistencia con patrón (Sesión 2)
- [ ] Swagger/Documentation (si es backend)
- [ ] Dark mode (si es frontend)
- [ ] Responsive design (si es frontend)
- [ ] Error handling

NOTAS ADICIONALES:
==================
[Cualquier contexto adicional importante]
```

---

## 🎯 CUÁNDO USAR CADA TEMPLATE

| Template | Cuándo usar |
|----------|------------|
| **1. Completo** | Nueva sesión grande, cambios mayores, inicio proyecto |
| **2. Rápido** | Cambios específicos menores, fixes, pequeñas mejoras |
| **3. Nueva Sesión** | Iniciar sesión 3-9, cambios estructurales |
| **4. Debugging** | Algo no funciona, error, comportamiento inesperado |
| **5. Code Review** | Quieres que revise/mejore código existente |

---

## ✅ CHECKLIST ANTES DE USAR

Antes de mandar tu prompt:

- [ ] Leíste `/tms-backend/gemini-rules.md` (conocer estructura)
- [ ] Leíste `/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md` (entender sesión)
- [ ] Sabes qué quieres lograr (sé específico)
- [ ] Compartiste URLs/rutas de archivos relevantes
- [ ] Incluiste documentación referencia
- [ ] Explicaste problema/tarea claramente
- [ ] Mencionaste patrón a seguir (generalmente Sesión 2)

---

## 💡 TIPS PARA MEJOR RESULTADO

1. **Sé específico**: No digas "arregla todo", di "agregar validación a campo X"
2. **Incluye referencias**: Links a archivos, líneas de código, URLs
3. **Comparte documentación**: Copia líneas relevantes de PLAN_MAESTRO.md
4. **Patrón establecido**: Siempre menciona seguir patrón de Sesión 2
5. **Stack claro**: NestJS backend, Nuxt frontend, TypeORM, Pinia
6. **Cambios anteriores**: Menciona cambios de Sesión 2 si son relevantes

---

## 📞 REFERENCIA RÁPIDA DE ARCHIVOS

**Documentación Base**:
- `gemini-rules.md` - Estructura, convenciones, rules
- `PLAN_MAESTRO.md` - Roadmap 9 sesiones
- `DOCUMENTACION_REFERENCIA.md` - Guía rápida

**Estado Actual**:
- `STATUS_SESION_2.md` - Lo que está completo
- `BACKEND_VERIFICATION_COMPLETE.md` - Endpoints verificados

**Código Referencia**:
- Sesión 2: CRUD Ensayos (patrón a seguir)
  - Backend: `/src/ensayos/`
  - Frontend: `/tms-client-vue/pages/ensayos/`
  - Store: `/tms-client-vue/stores/ensayos.ts`

---

## 🚀 EJEMPLO COMPLETO

```
PROYECTO: TMS - Iniciando Sesión 3

DOCUMENTACIÓN REFERENCIA:
- /tms-backend/gemini-rules.md
- /tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md (buscar "Sesión 3")
- /tms-backend/tms-client-vue/docs/STATUS_SESION_2.md (patrón)

PATRÓN: Copiar estructura CRUD Ensayos de Sesión 2

TAREA: Crear Store tratamientos.ts siguiendo patrón de ensayos.ts

REFERENCIA CÓDIGO:
- Modelo: /tms-backend/tms-client-vue/stores/ensayos.ts
- Endpoint backend: /api/v1/tratamientos
- Entidad: /tms-backend/src/entities/tratamiento.entity.ts

DIFERENCIAS:
- Endpoint: tratamientos (no ensayos)
- Campos: nombreTratamiento, dosis, unidad
- Relación: Con Productos (M:N)

¿Puedo crear el store tratamientos.ts?
```

---

**Versión**: 2.0  
**Última actualización**: Diciembre 11, 2025  
**Para**: GitHub Copilot, Gemini, Junie  

---

**Versión**: 2.1 (Con Docker)  
**Última actualización**: Diciembre 11, 2025  
**Documentos relacionados**: gemini-rules.md, DOCUMENTACION_REFERENCIA.md, PLAN_MAESTRO.md  
**Sincronización**: Mantener estos 4 archivos actualizados juntos

---

## 📚 Documentos que trabajan juntos

```
gemini-rules.md              ← Estructura + Docker + Reglas
    ↓
DOCUMENTACION_REFERENCIA.md  ← Guía rápida + Referencias
    ↓
TEMPLATE_PROMPTS.md          ← Este archivo (Templates listos)
    ↓
PLAN_MAESTRO.md              ← Roadmap detallado
```

Incluir los 4 en prompts a IA para contexto 100% actualizado.

¡Listo para usar! 📝


