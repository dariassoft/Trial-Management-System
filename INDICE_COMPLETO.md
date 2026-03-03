# 📑 ÍNDICE COMPLETO DE DOCUMENTACIÓN - ACTUALIZADO 2026-03-03

**Acceso centralizado a todos los documentos del proyecto TMS**
**Última actualización:** 2026-03-03 (Expansión de mediciones y reportes)

---

## 🎯 COMIENZA AQUÍ

### ⚡ Para empezar en 2 minutos
```
→ /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/INICIO_RAPIDO.md
```

### 📖 Para leer todo en orden RECOMENDADO
```
1. INICIO_RAPIDO.md                           (2 min - Setup)
2. gemini-rules.md                             (20 min - Estructura)
3. DOCUMENTACION_REFERENCIA.md                 (10 min - Cómo usar)
4. 00_INDICE_FINAL_EMPIEZA_AQUI.md           (5 min - Índice principal)
5. ESPECIFICACIONES_MEDICIONES_REPORTES.md   (15 min - Mediciones)
6. GUIA_USO_PARCELAS_COMPLETA.md             (10 min - Usar sistema)
```

---

## 📚 DOCUMENTOS PRINCIPALES POR CATEGORÍA

### 🔧 CONFIGURACIÓN Y SETUP

#### 1. **INICIO_RAPIDO.md** ⭐ LEE ESTO PRIMERO
**Para**: Empezar rápido
**Contenido**: Setup, docker, 30 seg resumen, checklist
**Tiempo**: 2-3 min

#### 2. **gemini-rules.md** - Reglas Técnicas
**Para**: Estructura, Docker, convenciones
**Contenido**: Rutas, Docker, 24 tablas, 50+ endpoints, roles
**Tiempo**: 15-20 min

#### 3. **DOCUMENTACION_REFERENCIA.md** - Guía IA
**Para**: Usar eficientemente con AI Assistants
**Contenido**: Primeros documentos, búsqueda rápida, flujo trabajo
**Tiempo**: 10-15 min

#### 4. **REFERENCIA_RUTAS.md** - Consulta Rápida
**Para**: Encontrar rutas rápidamente
**Contenido**: Rutas base, tabla documentos, comandos Docker
**Tiempo**: 5 min (referencia)

#### 5. **README.md** - Overview Proyecto
**Para**: Visión general
**Contenido**: Descripción, stack, características, comandos
**Tiempo**: 5-10 min

---

### 🌾 MÓDULO PARCELAS (NUEVO 2026-03-03)

#### 6. **ESPECIFICACIONES_MEDICIONES_REPORTES.md** ⭐ NUEVO
**Para**: Entender campos de medición y reportes
**Contenido**:
- 23 campos de medición (5 básicos + 18 nuevos)
- Cálculos derivados (8+ métricas)
- 6 tipos de reportes
- Validación de datos
- Estructura BD ampliada
- Casos de uso para análisis

**Campos capturados**:
- Básicos: Fecha, humedad, rendimiento, GIE
- Gramaje: Gramaje/grano, granos/m², peso grano, defectos
- Parcela: Hojas/m², larvas/m², insectos benéficos, espiga, altura, plantas/m²
- Cálculos: Grano puro, calidad final, eficiencia, índice plagas, vigor

**Reportes**: Rendimiento, sanidad, desarrollo, composición, eficiencia, resumen ejecutivo

**Tiempo**: 15-20 min
**Importancia**: ⭐⭐⭐ (Core para reportes)

#### 7. **FIX_PARCELAS_Y_NAVEGACION.md**
**Para**: Entender cambios técnicos
**Contenido**: Problemas, soluciones, código
**Tiempo**: 10 min

#### 8. **GUIA_USO_PARCELAS_COMPLETA.md**
**Para**: Cómo usar parcelas en sistema
**Contenido**: Paso a paso, casos uso, troubleshooting
**Tiempo**: 15 min

#### 9. **QUICK_REFERENCE_PARCELAS.md**
**Para**: Referencia rápida
**Contenido**: Acceso rápido, atajos, FAQ
**Tiempo**: 3 min (referencia)

#### 10. **DIAGRAMA_NAVEGACION_ACTUALIZADO.md**
**Para**: Ver diagramas y flujos
**Contenido**: Árboles navegación, flujos, comparativas
**Tiempo**: 10-15 min

#### 11. **DEPLOYMENT_INSTRUCTIONS.md**
**Para**: Desplegar cambios
**Contenido**: Pasos deployment, rollback
**Tiempo**: 10 min

---

### 📋 CHECKLISTS Y VERIFICACIÓN

#### 12. **CHECKLIST_IMPLEMENTACION_PARCELAS.md**
**Para**: Verificar implementación
**Contenido**: Objetivos, testing, criterios aceptación
**Tiempo**: 10 min (referencia)

#### 13. **INDICE_SOLUCION_PARCELAS.md**
**Para**: Índice soluciones parcelas
**Contenido**: Guía navegación, estadísticas, resúmenes
**Tiempo**: 10 min

---

### 📊 DOCUMENTACIÓN ANTIGUA (Sesiones Previas)

#### Sesión 1-4: ABM Laboratorios, Usuarios, Roles
```
→ Documentación disponible en raíz del proyecto
→ Ver gemini-rules.md sección de sesiones
```

#### Reportes System (Sesión)
```
→ ESPECIFICACIONES_REPORTES.md (antiguo)
→ Ver nuevo documento: ESPECIFICACIONES_MEDICIONES_REPORTES.md
```

---

## 🔍 BÚSQUEDA RÁPIDA POR TEMA

### "Necesito usar Parcelas"
1. GUIA_USO_PARCELAS_COMPLETA.md (instrucciones)
2. QUICK_REFERENCE_PARCELAS.md (referencia)

### "Necesito entender mediciones para reportes"
1. ESPECIFICACIONES_MEDICIONES_REPORTES.md (core)
2. DIAGRAMA_NAVEGACION_ACTUALIZADO.md (flujos)

### "Necesito ver código"
1. FIX_PARCELAS_Y_NAVEGACION.md (explicación)
2. Revisar archivo: tms-client-vue/pages/parcelas.vue (788 líneas)

### "Necesito desplegar"
1. DEPLOYMENT_INSTRUCTIONS.md
2. INICIO_RAPIDO.md (commands)

### "Necesito estructura del proyecto"
1. gemini-rules.md (todo)
2. REFERENCIA_RUTAS.md (rutas)

### "Necesito aprender a usar con IA"
1. DOCUMENTACION_REFERENCIA.md

### "Necesito overview del proyecto"
1. README.md (general)
2. 00_INDICE_FINAL_EMPIEZA_AQUI.md (por rol)

---

## 📊 TABLA RÁPIDA DE DOCUMENTOS

| Documento | Sesión | Tema | Tiempo | Importancia |
|-----------|--------|------|--------|-------------|
| INICIO_RAPIDO.md | Setup | Setup/Docker | 3 min | ⭐⭐⭐ |
| gemini-rules.md | Setup | Estructura | 20 min | ⭐⭐⭐ |
| ESPECIFICACIONES_MEDICIONES_REPORTES.md | 5 | Mediciones | 20 min | ⭐⭐⭐ |
| GUIA_USO_PARCELAS_COMPLETA.md | 5 | Usuario | 15 min | ⭐⭐ |
| FIX_PARCELAS_Y_NAVEGACION.md | 5 | Técnica | 10 min | ⭐⭐ |
| DEPLOYMENT_INSTRUCTIONS.md | 5 | DevOps | 10 min | ⭐⭐ |
| QUICK_REFERENCE_PARCELAS.md | 5 | Ref Rápida | 3 min | ⭐ |
| DIAGRAMA_NAVEGACION_ACTUALIZADO.md | 5 | Diagramas | 15 min | ⭐⭐ |
| CHECKLIST_IMPLEMENTACION_PARCELAS.md | 5 | QA | 10 min | ⭐ |
| INDICE_SOLUCION_PARCELAS.md | 5 | Índice | 10 min | ⭐ |
| README.md | Setup | General | 10 min | ⭐⭐ |
| DOCUMENTACION_REFERENCIA.md | Setup | IA | 15 min | ⭐⭐ |
| REFERENCIA_RUTAS.md | Setup | Rutas | 5 min | ⭐ |
| 00_INDICE_FINAL_EMPIEZA_AQUI.md | 5 | Índice | 5 min | ⭐⭐ |

---

## ⚡ ACCIONES RÁPIDAS

### Quiero empezar YA
```
1. Abre: INICIO_RAPIDO.md
2. Copia rutas del proyecto
3. Ejecuta comandos Docker
4. ¡Listo!
```

### Quiero entender mediciones
```
1. Lee: ESPECIFICACIONES_MEDICIONES_REPORTES.md
2. Secciones clave:
   - CAMPOS DE MEDICIÓN CAPTURADOS
   - CÁLCULOS Y MÉTRICAS DERIVADAS
   - REPORTES A GENERAR
3. ¡Listo!
```

### Quiero usar parcelas
```
1. Lee: GUIA_USO_PARCELAS_COMPLETA.md
2. Sigue: Paso a paso
3. ¡Listo!
```

### Quiero desplegar
```
1. Lee: DEPLOYMENT_INSTRUCTIONS.md
2. Ejecuta pasos
3. Verifica en navegador
```

---

## 🔄 FLUJO DE TRABAJO TÍPICO

```
START
  ↓
¿Primer vez?
  ├─ SÍ → INICIO_RAPIDO.md → gemini-rules.md → START
  └─ NO → ¿Qué necesito?
         ├─ Usar sistema → GUIA_USO_PARCELAS_COMPLETA.md
         ├─ Entender código → FIX_PARCELAS_Y_NAVEGACION.md
         ├─ Mediciones/Reportes → ESPECIFICACIONES_MEDICIONES_REPORTES.md
         ├─ Desplegar → DEPLOYMENT_INSTRUCTIONS.md
         ├─ Testing → CHECKLIST_IMPLEMENTACION_PARCELAS.md
         └─ Referencia → QUICK_REFERENCE_PARCELAS.md
```

---

## 📈 NOVEDADES SESIÓN 2026-03-03

### ✨ Nuevo: Expansión de Mediciones
- 18 nuevos campos de medición
- 8+ métricas derivadas
- 6 tipos de reportes
- Validación de datos
- Cálculos automáticos

### ✨ Nuevo: Documento Central
- **ESPECIFICACIONES_MEDICIONES_REPORTES.md**
- Guía completa para reportes
- Estructura BD ampliada
- Fórmulas de cálculo
- Ejemplos de datos

### ✨ Actualizado: parcelas.vue
- Modal expandido (330+ campos)
- Nuevas funciones
- Integración API completa
- UI/UX mejorada

### ✨ Actualizado: INDICE_COMPLETO.md
- Este documento
- Nuevas referencias
- Tabla de documentos
- Búsqueda rápida

---

## 🎯 PRÓXIMAS SESIONES

### Sesión 6: Implementar Reportes (Recomendado)
**Base**: ESPECIFICACIONES_MEDICIONES_REPORTES.md
**Tareas**:
- Crear endpoint generador de reportes
- Implementar cálculos derivados
- Diseñar plantillas (PDF/Excel)
- Agregar gráficos

### Sesión 7: Mejorar Validación
**Base**: ESPECIFICACIONES_MEDICIONES_REPORTES.md (sección Validación)
**Tareas**:
- Backend: Validar coherencia
- Frontend: Mensajes de error
- BD: Constraints adicionales

### Sesión 8: Training y Documentación
**Base**: GUIA_USO_PARCELAS_COMPLETA.md
**Tareas**:
- Capacitar usuarios
- Crear videos tutoriales
- Documentar procesos

---

## 🔗 RUTAS IMPORTANTES

```
Proyecto:     /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
Backend:      /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/src
Frontend:     /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue
Parcelas:     /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/pages/parcelas.vue
Docs:         /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/*.md
```

---

## ✅ VERIFICACIÓN

### Para empezar:
- [ ] Leo INICIO_RAPIDO.md (2 min)
- [ ] Leo gemini-rules.md (20 min)
- [ ] Tengo Docker funcionando

### Para mediciones:
- [ ] Leo ESPECIFICACIONES_MEDICIONES_REPORTES.md (20 min)
- [ ] Entiendo 23 campos de medición
- [ ] Entiendo 6 tipos de reportes

### Para usar parcelas:
- [ ] Leo GUIA_USO_PARCELAS_COMPLETA.md (15 min)
- [ ] Puedo editar parcelas
- [ ] Puedo guardar mediciones

---

## 📞 CONTACTO

- **Documentación**: Todos los .md en raíz del proyecto
- **Código**: Ver rutas en gemini-rules.md
- **Support**: Ver secciones Troubleshooting en cada doc

---

**Última actualización**: 2026-03-03
**Versión**: 2.0 (Mediciones expandidas)
**Status**: ✅ COMPLETO**Tiempo lectura**: 2-3 minutos (referencia rápida)

---

### 6. **TEMPLATE_PROMPTS.md** - Templates para IA
**Para**: Copiar prompts listos  
**Ruta**: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/TEMPLATE_PROMPTS.md`  
**Contenido**:
- Template 1: Referencia completa (sesiones nuevas)
- Template 2: Cambios backend específicos
- Template 3: Nueva sesión CRUD
- Template 4: Cambios frontend
- Template 5: Genérico (cualquier tarea)
- Cómo usar templates

**Uso**: Copia, llena placeholders, envía a IA

---

### 7. **PLAN_MAESTRO.md** - Roadmap 9 Sesiones
**Para**: Ver roadmap completo, estado actual, próximas sesiones  
**Ruta**: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md`  
**Contenido**:
- Docker commands (en detalle)
- Documentos relacionados (4 documentos clave)
- Estado por sesión (S1 a S9)
- Qué se completó en cada sesión
- Endpoints por sesión
- Tabla de estado general
- Próximos pasos

**Tiempo lectura**: 15-20 minutos

---

## 📂 ESTRUCTURA LÓGICA

```
INICIO (Empieza aquí)
    ↓
INICIO_RAPIDO.md (2-3 min)
    ↓
README.md (5-10 min)
    ↓
gemini-rules.md (15-20 min)
    ↓
DOCUMENTACION_REFERENCIA.md (10-15 min)
    ↓
REFERENCIA_RUTAS.md (2-3 min, referencia)
    ↓
PLAN_MAESTRO.md (15-20 min, roadmap)
    ↓
TEMPLATE_PROMPTS.md (copiar cuando necesites)
```

---

## 🎯 BÚSQUEDA POR NECESIDAD

### "Necesito saber las rutas absolutas"
→ `REFERENCIA_RUTAS.md` (2 min)  
→ O `INICIO_RAPIDO.md` (30 seg)

### "Necesito entender Docker"
→ `gemini-rules.md` → sección "EJECUCIÓN EN CONTENEDORES DOCKER"  
→ O `PLAN_MAESTRO.md` → sección "COMANDOS: EJECUTAR EN CONTENEDORES"

### "Necesito saber qué está hecho"
→ `PLAN_MAESTRO.md` → sección "ESTADO DE SESIONES"  
→ O `README.md` → tabla de estado

### "Necesito hacer una tarea con IA"
→ `TEMPLATE_PROMPTS.md` (copiar template)  
→ Llenar placeholders con rutas de `REFERENCIA_RUTAS.md`

### "Necesito entender cómo usar con IA"
→ `DOCUMENTACION_REFERENCIA.md` (cómo usar con IA Assistants)

### "Necesito estructura del proyecto"
→ `gemini-rules.md` → sección "ESTRUCTURA DEL PROYECTO"  
→ O `README.md` → sección "ESTRUCTURA DE CARPETAS"

### "Necesito la lista de endpoints"
→ `gemini-rules.md` → sección "ENDPOINTS BACKEND"

### "Necesito saber próximas sesiones"
→ `PLAN_MAESTRO.md` → secciones S4, S5, S6, S7, S8, S9

---

## 🔗 REFERENCIAS CRUZADAS (Documentos sincronizados)

Estos 4 documentos están interconectados:
```
1. gemini-rules.md ←→ 2. DOCUMENTACION_REFERENCIA.md
        ↑                           ↑
        ←────────────→ ←───────────→
        ↑                           ↑
3. TEMPLATE_PROMPTS.md ←→ 4. PLAN_MAESTRO.md
```

**Importante**: Cuando hagas cambios, actualiza los 4 juntos

---

## 📊 TABLA DE DOCUMENTOS

| # | Documento | Ruta | Para | Tiempo |
|---|-----------|------|------|--------|
| 1 | **INICIO_RAPIDO.md** | `/tms-backend/INICIO_RAPIDO.md` | Empezar rápido | 2-3 min |
| 2 | **README.md** | `/tms-backend/README.md` | Visión gral. | 5-10 min |
| 3 | **gemini-rules.md** | `/tms-backend/gemini-rules.md` | Estructura + Docker | 15-20 min |
| 4 | **DOCUMENTACION_REFERENCIA.md** | `/tms-backend/DOCUMENTACION_REFERENCIA.md` | Usar con IA | 10-15 min |
| 5 | **REFERENCIA_RUTAS.md** | `/tms-backend/REFERENCIA_RUTAS.md` | Rutas rápido | 2-3 min |
| 6 | **TEMPLATE_PROMPTS.md** | `/tms-backend/TEMPLATE_PROMPTS.md` | Copiar templates | Al usar |
| 7 | **PLAN_MAESTRO.md** | `/tms-backend/tms-client-vue/docs/PLAN_MAESTRO.md` | Roadmap | 15-20 min |
| 8 | **INDICE_COMPLETO.md** | `/tms-backend/INDICE_COMPLETO.md` | Este archivo | 5 min |

---

## 💡 TIPS DE NAVEGACIÓN

### Copiar siempre en prompts a IA
```
Backend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
Frontend: /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue
```

### Quick links (atajos)
- Rutas → `REFERENCIA_RUTAS.md`
- Docker → `gemini-rules.md` (Docker section)
- Templates → `TEMPLATE_PROMPTS.md`
- Roadmap → `PLAN_MAESTRO.md`
- General → `INICIO_RAPIDO.md`

### Leer en esta secuencia
1. `INICIO_RAPIDO.md` (visión general)
2. `gemini-rules.md` (estructura técnica)
3. `PLAN_MAESTRO.md` (estado + roadmap)
4. `TEMPLATE_PROMPTS.md` (cuando hagas tarea)

---

## ✅ CHECKLIST NAVEGACIÓN

Cuando abras este índice:
- [ ] Sé cuál es mi tarea
- [ ] Conozco las 4 rutas base (Proyecto, Backend, Frontend, Docker)
- [ ] Leí `INICIO_RAPIDO.md`
- [ ] Encontré el documento que necesito
- [ ] Tengo los 4 documentos clave listos (gemini-rules, DOCUMENTACION_REFERENCIA, TEMPLATE_PROMPTS, PLAN_MAESTRO)

---

## 🚀 AHORA SÍ, VE A

| Caso | Ir a |
|------|------|
| No sé por dónde empezar | `INICIO_RAPIDO.md` |
| Necesito ver rutas | `REFERENCIA_RUTAS.md` |
| Necesito hacer tarea | `TEMPLATE_PROMPTS.md` |
| Quiero ver estado proyecto | `PLAN_MAESTRO.md` |
| Quiero entender estructura | `gemini-rules.md` |
| Quiero usar con IA | `DOCUMENTACION_REFERENCIA.md` |

---

**Última actualización**: Diciembre 11, 2025  
**Ubicación**: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/INDICE_COMPLETO.md`

🔖 Bookmark para fácil acceso

