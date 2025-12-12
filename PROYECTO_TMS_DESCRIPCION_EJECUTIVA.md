# 🎯 PROYECTO TMS - DESCRIPCIÓN EJECUTIVA

**Trial Management System (TMS)**  
**Plataforma web para gestión integral de ensayos agronómicos**  
**Sesión**: 1 (27 Noviembre 2025)  
**Status**: ✅ Operativo y listo para desarrollo

---

## 📖 ¿QUÉ ES TMS?

**Trial Management System** es una solución software diseñada para que empresas y laboratorios agronómicos puedan:

1. **Planificar ensayos** - Definir protocolos, ubicación, cultivos
2. **Diseñar experimentos** - Crear bloques y parcelas con tratamientos
3. **Registrar datos** - Capturar mediciones y observaciones en campo
4. **Gestionar productos** - Administrar químicos, dosis y aplicaciones
5. **Analizar resultados** - Generar reportes y gráficos

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────────┐
│         FRONTEND (Nuxt 3 + Vue 3)           │
│   - Interfaz web responsiva                 │
│   - Autenticación JWT                       │
│   - Pinia State Management                  │
│   - TailwindCSS (diseño moderno)            │
│   Puerto: 3001                              │
└──────────────────┬──────────────────────────┘
                   │ HTTP/REST
                   ▼
┌─────────────────────────────────────────────┐
│      BACKEND (NestJS + TypeORM)             │
│   - API REST con 50+ endpoints              │
│   - Autenticación JWT                       │
│   - RBAC (Control de Acceso)                │
│   - Swagger/OpenAPI 3.0                     │
│   Puerto: 3000                              │
└──────────────────┬──────────────────────────┘
                   │ SQL
                   ▼
┌─────────────────────────────────────────────┐
│     DATABASE (MySQL 8)                      │
│   - 22 tablas sincronizadas                 │
│   - Datos de prueba                         │
│   - Relaciones complejas                    │
│   Puerto: 3306                              │
└─────────────────────────────────────────────┘
```

---

## 👥 ROLES Y PERMISOS

| Rol | Permisos | Acceso |
|-----|----------|--------|
| **Superadministrador** | Todo | BD, usuarios, laboratorios, reportes |
| **Administrador** | Gestión | Usuarios, laboratorios, reportes |
| **Manager** | Lectura/Crear | Ensayos, reportes, análisis |
| **Técnico** | Crear datos | Ensayos, mediciones, fotos |
| **Invitado** | Solo lectura | Ensayos y reportes asignados |

---

## 📊 ENTIDADES PRINCIPALES

### 1. **Ensayo**
- Protocolo de investigación
- Ubicación y datos de cultivo
- Fecha de siembra
- Responsable

### 2. **Aplicación**
- Evento de aplicación de tratamiento
- Fecha y hora
- Condiciones ambientales
- Equipo utilizado

### 3. **Tratamiento**
- Nombre/descripción
- Indica si es testigo
- Productos aplicados
- Dosis

### 4. **Parcela**
- Unidad experimental
- Pertenece a bloque y tratamiento
- Ubicación en grid
- Datos colectados

### 5. **Datos de Campo**
- Mediciones por parcela
- Momento de evaluación
- Variables medidas
- Fotos
- Observaciones

### 6. **Productos**
- Químicos, biológicos, otros
- Laboratorio que los produce
- Dosis y formulación

---

## 🔄 CICLO TÍPICO DE USO

```
SEMANA 1: CREACIÓN
↓
Usuario crea nuevo ensayo
├─ Ingresa datos básicos
├─ Define ubicación
└─ Selecciona cultivo/variedad

SEMANA 2: DISEÑO
↓
├─ Crea bloques (A, B, C, D)
├─ Crea parcelas (subunidades)
└─ Asigna tratamientos a parcelas

SEMANA 3-15: EJECUCIÓN
↓
├─ Registra aplicaciones
├─ En cada momento:
│  ├─ Carga mediciones
│  ├─ Sube fotos
│  └─ Anota observaciones
└─ Repite en cada evaluación

SEMANA 16: CIERRE
↓
├─ Registra cosecha
├─ Genera reportes
└─ Archiva ensayo
```

---

## 📈 FLUJO DE TRABAJO (Desarrollador)

### Para Crear Nueva Pantalla:

```
1. ANÁLISIS
   ↓ Entender qué datos mostrar/capturar

2. BACKEND (si es necesario)
   ↓ Crear/actualizar endpoint en NestJS

3. FRONTEND
   ↓
   ├─ Crear página en /pages
   ├─ Crear formulario si es necesario
   ├─ Integrar con composable useApi()
   ├─ Usar store Pinia si aplica
   ├─ Aplicar estilos TailwindCSS
   └─ Probar en http://localhost:3001

4. TESTING
   ↓
   ├─ Probar en Postman (backend)
   ├─ Probar en navegador (frontend)
   ├─ Validar errores
   └─ Verificar permisos
```

---

## 🛠️ STACK TECNOLÓGICO

### Backend
- **NestJS** - Framework TypeScript
- **TypeORM** - ORM para SQL
- **JWT** - Autenticación
- **Swagger** - Documentación

### Frontend
- **Nuxt 3** - Framework Vue 3
- **Pinia** - State management
- **TailwindCSS** - Estilos
- **Axios** - HTTP client

### Database
- **MySQL 8** - Base de datos relacional
- **22 tablas** sincronizadas

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación
- **npm/node** - Gestión de dependencias

---

## 📋 TAREAS COMPLETADAS SESIÓN 1

✅ Setup del entorno dockerizado  
✅ Estructura del backend completa  
✅ 22 tablas de BD creadas y sincronizadas  
✅ Autenticación JWT funcionando  
✅ 50+ endpoints desarrollados  
✅ Documentación Swagger completa  
✅ Frontend Nuxt 3 operativo  
✅ Pinia stores configurados  
✅ Pages básicas (login, dashboard)  
✅ Composables de API listos  
✅ Middleware de autenticación  
✅ TailwindCSS configurado  
✅ Postman collection creada  

---

## 🎯 TAREAS PRÓXIMA SESIÓN (Sesión 2)

1. **Pantalla de Listado de Ensayos**
   - Tabla con datos reales
   - Búsqueda
   - Paginación
   - Acciones

2. **Formulario de Nuevo Ensayo**
   - Validación
   - Integración API
   - Feedback

3. **Pantalla de Detalle de Ensayo**
   - Información completa
   - Edición
   - Eliminación

4. **Pruebas E2E básicas**
   - Flujo completo

---

## 🔐 SEGURIDAD

- ✅ JWT Token con 1 hora de validez
- ✅ RBAC (Control basado en roles)
- ✅ Middleware de autenticación
- ✅ Validación en backend
- ✅ CORS configurado
- ✅ Contraseñas hasheadas (bcrypt)

---

## 📱 DISPOSITIVOS SOPORTADOS

- ✅ Desktop (1920x1080+)
- ✅ Tablet (1024x768)
- ✅ Mobile (480x800+)
- ✅ Responsive design con TailwindCSS

---

## 🌍 URLS DE ACCESO

| Servicio | URL | Uso |
|----------|-----|-----|
| Frontend | http://localhost:3001 | Aplicación web |
| API Docs | http://localhost:3000/docs | Documentación interactiva |
| API Base | http://localhost:3000/api/v1 | Endpoints REST |
| MySQL | localhost:3306 | BD |

---

## 💾 DATOS DE PRUEBA

```
Email:    dariassoft@gmail.com
Contraseña: 123456
Rol:      Superadministrador

Cultivos: 8 (Soja, Maíz, Trigo, etc.)
Variedades: 11
Laboratorios: 6
Productos: 13
Variables: 40
Tipos Ensayo: 10
```

---

## 🚀 CÓMO EJECUTAR

```bash
# Terminal 1: Iniciar servicios
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
docker-compose up

# Terminal 2: Ver logs
docker-compose logs -f

# Acceso
Frontend: http://localhost:3001
API: http://localhost:3000/api/v1
Swagger: http://localhost:3000/docs
```

---

## 📚 DOCUMENTACIÓN

```
/tms-backend/docs/
├── STATUS_COMPLETO_SESION_1.md     ← Backend completo
├── README.md                        ← Índice
├── API_DOCUMENTATION.md             ← Endpoints
└── ...más documentos

/tms-client-vue/docs/
├── STATUS_FRONTEND_SESION_1.md     ← Frontend completo
└── (Por crear: guías de componentes)
```

---

## ✨ VISIÓN A FUTURO

### Fase 1 (CRUD) - Próximas sesiones
- Ensayos: Crear, leer, actualizar, eliminar
- Usuarios: Gestión básica
- Laboratorios: Gestión

### Fase 2 (Diseño)
- Creación de bloques
- Creación de parcelas
- Asignación de tratamientos
- Visualización de diseño

### Fase 3 (Datos)
- Formulario de mediciones
- Upload de fotos
- Validación de variables
- Historial de cambios

### Fase 4 (Análisis)
- Tablas de datos
- Gráficos interactivos
- Exportación PDF/Excel
- Reportes personalizados

---

## 📞 CONTACTO Y REFERENCIAS

**Documentación Oficial**:
- NestJS: https://docs.nestjs.com
- Nuxt 3: https://nuxt.com
- Pinia: https://pinia.vuejs.org
- TypeORM: https://typeorm.io

**Repositorio**: `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend`

---

## 🎊 CONCLUSIÓN

El proyecto TMS está completamente configurado y listo para comenzar el desarrollo de pantallas. La arquitectura es sólida, la autenticación funciona, la base de datos está sincronizada y la documentación es completa.

**¡Listo para comenzar la Sesión 2!**

---

**Última actualización**: 27 Noviembre 2025, 05:00 AM  
**Versión**: 1.0  
**Status**: ✅ OPERATIVO


