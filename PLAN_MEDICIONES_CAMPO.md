# 📱 PLAN DE IMPLEMENTACIÓN: SISTEMA DE MEDICIONES EN CAMPO

**Fecha**: 29 de Enero, 2026  
**Versión**: 1.0  
**Prioridad**: ALTA - Funcionalidad Core del Sistema  
**Estimación Total**: 15-20 horas de desarrollo

---

## 📋 ÍNDICE

1. [Visión General](#1-visión-general)
2. [Modelo de Datos](#2-modelo-de-datos)
3. [Flujo de Trabajo](#3-flujo-de-trabajo)
4. [Diseño de Interfaz Mobile-First](#4-diseño-de-interfaz-mobile-first)
5. [Implementación Backend](#5-implementación-backend)
6. [Implementación Frontend](#6-implementación-frontend)
7. [Sistema de Fotos y Videos](#7-sistema-de-fotos-y-videos)
8. [Tareas Detalladas](#8-tareas-detalladas)
9. [Cronograma Sugerido](#9-cronograma-sugerido)

---

## 1. VISIÓN GENERAL

### ¿Qué es la Toma de Mediciones en Campo?

Es el proceso de registrar datos agronómicos durante el ciclo de vida de un ensayo. Incluye:

1. **Aplicaciones de tratamientos** - Registro de cuándo y cómo se aplicaron los productos
2. **Momentos de evaluación** - Días después de aplicación (DDA) donde se miden variables
3. **Mediciones de variables** - Valores numéricos/categóricos según el tipo de ensayo
4. **Registro fotográfico/video** - Evidencia visual vinculada a cada medición
5. **Datos de cosecha** - Rendimientos finales por parcela

### Flujo Simplificado

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   ENSAYO    │────▶│ APLICACIÓN  │────▶│  MOMENTO    │────▶│  MEDICIÓN   │
│             │     │ (Fecha/Hora)│     │ (DDA: 7,14) │     │ (Variables) │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
  ┌─────────┐        ┌─────────┐        ┌─────────┐        ┌─────────┐
  │ Bloques │        │Condiciones│      │ Parcelas │       │  Fotos  │
  │Parcelas │        │ Climáticas│      │ a medir  │       │ Videos  │
  └─────────┘        └─────────┘        └─────────┘        └─────────┘
```

---

## 2. MODELO DE DATOS

### 2.1 Entidades Principales (Ya existentes)

#### Tipo_Ensayo
Define QUÉ variables se miden y CUÁNDO (días de evaluación).

```typescript
// tipo-ensayo.entity.ts
@Entity('Tipo_Ensayo')
export class TipoEnsayo {
  id: number;
  nombre: string;           // "Herbicidas Pre-emergentes", "Fungicidas Soja"
  evaluacionCsv: string;    // "7,14,21,28" - días de evaluación
  activo: boolean;
  
  // Relaciones
  variables: TipoEnsayoVariable[];    // Variables a medir
  dias: TipoEnsayoEvaluacionDia[];   // Días de evaluación
}
```

#### Tipo_Ensayo_EvaluacionDia
Días en que se debe evaluar (DDA - Días Después de Aplicación).

```typescript
// tipo-ensayo-evaluacion-dia.entity.ts
@Entity('Tipo_Ensayo_EvaluacionDia')
export class TipoEnsayoEvaluacionDia {
  id: number;
  dia: number;              // 7, 14, 21, 28, etc.
  tipoEnsayo: TipoEnsayo;   // FK
}
```

#### Tipo_Ensayo_Variable
Variables específicas a medir según el tipo de ensayo.

```typescript
// tipo-ensayo-variable.entity.ts
@Entity('Tipo_Ensayo_Variable')
export class TipoEnsayoVariable {
  id: number;
  tipoEnsayo: TipoEnsayo;           // FK
  variable: ProtocoloVariable;      // FK - La variable a medir
  orden: number;                    // Orden de presentación
  requerido: boolean;               // Si es obligatoria
  unidadOverride: string;           // Puede sobrescribir unidad
  escala: string;                   // "1-100", "0-5", etc.
  rangoMin: number;                 // Validación mínimo
  rangoMax: number;                 // Validación máximo
}
```

#### Protocolo_Variable
Catálogo de variables medibles.

```typescript
// protocolo-variable.entity.ts
@Entity('Protocolo_Variable')
export class ProtocoloVariable {
  id: number;
  tipoEnsayo: TipoEnsayo;          // FK
  nombre_variable: string;          // "% Control Malezas", "Fitotoxicidad"
  unidad_medida: string;           // "%", "escala 1-5", "kg/ha"
  descripcion: string;
}
```

#### Aplicacion
Registro de cada aplicación de tratamiento en el ensayo.

```typescript
// aplicacion.entity.ts
@Entity('Aplicacion')
export class Aplicacion {
  id: number;
  ensayo: Ensayo;                  // FK
  nombreAplicacion: string;        // "Primera aplicación", "Segunda aplicación"
  fechaHora: Date;                 // Cuándo se aplicó
  estadioCultivo: string;          // "V2", "V4", "R1"
  
  // Condiciones climáticas
  tempC: number;                   // Temperatura
  humedadPct: number;              // Humedad relativa
  vientoKmh: number;               // Velocidad del viento
  
  // Equipo utilizado
  equipoInfo: string;              // "Mochila 20L", "Pulverizador autopropulsado"
  picoInfo: string;                // "Cono hueco 80-015"
  presionBar: number;              // Presión de trabajo
  
  // Relación: Una aplicación tiene múltiples momentos de evaluación
  momentos: MomentoEvaluacion[];
}
```

#### Momento_Evaluacion
Cada momento (día) de evaluación después de una aplicación.

```typescript
// momento-evaluacion.entity.ts
@Entity('Momento_Evaluacion')
export class MomentoEvaluacion {
  id: number;
  aplicacion: Aplicacion;          // FK
  nombreMomento: string;           // "7 DDA", "14 DDA"
  diasDespuesAplicacion: number;   // 7, 14, 21
  fechaEvaluacion: Date;           // Fecha calculada o manual
  
  // Relación: Un momento tiene mediciones por parcela
  datosCampo: DatosCampo[];
}
```

#### Datos_Campo
Una "visita" o registro de medición para una parcela en un momento específico.

```typescript
// datos-campo.entity.ts
@Entity('Datos_Campo')
@Unique(['parcela', 'momento'])    // Una sola medición por parcela/momento
export class DatosCampo {
  id: number;
  parcela: Parcela;                // FK - Qué parcela
  momento: MomentoEvaluacion;      // FK - Qué momento
  observaciones: string;           // Notas libres
  
  // Relaciones
  mediciones: DatosCampoMedicion[]; // Valores de cada variable
  fotos: FotoRegistro[];            // Fotos/videos adjuntos
}
```

#### Datos_Campo_Medicion
Valor específico de cada variable medida.

```typescript
// datos-campo-medicion.entity.ts
@Entity('Datos_Campo_Medicion')
export class DatosCampoMedicion {
  id: number;
  visita: DatosCampo;              // FK
  variable: ProtocoloVariable;      // FK - Qué variable
  valor: string;                   // El valor medido (string para flexibilidad)
}
```

#### Foto_Registro
Fotos y videos vinculados a mediciones.

```typescript
// foto-registro.entity.ts
@Entity('Foto_Registro')
export class FotoRegistro {
  id: number;
  visita: DatosCampo;              // FK - Vinculada a la medición
  file_name: string;               // Nombre original
  file_path: string;               // Ruta en servidor
  mime_type: string;               // "image/jpeg", "video/mp4"
  fecha_subida: Date;
}
```

#### Datos_Cosecha
Datos finales de rendimiento por parcela.

```typescript
// datos-cosecha.entity.ts
@Entity('Datos_Cosecha')
export class DatosCosecha {
  id: number;
  parcela: Parcela;                // FK - 1:1 con parcela
  fechaCosecha: Date;
  humedadPct: number;              // Humedad del grano
  kgHaCorregido: number;           // Rendimiento corregido
  gie: number;                     // Otro indicador
  observaciones: string;
}
```

### 2.2 Diagrama de Relaciones

```
                    ┌─────────────────┐
                    │   Tipo_Ensayo   │
                    │  (Herbicidas,   │
                    │   Fungicidas)   │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
   ┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐
   │ TipoEnsayo_     │ │ TipoEnsayo_  │ │ Protocolo_      │
   │ EvaluacionDia   │ │ Variable     │ │ Variable        │
   │ (7,14,21,28)    │ │ (orden,req)  │ │ (% Control,etc) │
   └─────────────────┘ └──────────────┘ └────────┬────────┘
                                                  │
                    ┌─────────────────────────────┘
                    │
                    ▼
   ┌─────────────────┐         ┌─────────────────┐
   │     Ensayo      │◄───────▶│    Aplicacion   │
   │  (nombreEnsayo, │         │ (fechaHora,     │
   │   tipoEnsayo)   │         │  condiciones)   │
   └────────┬────────┘         └────────┬────────┘
            │                           │
            ▼                           ▼
   ┌─────────────────┐         ┌─────────────────┐
   │     Bloque      │         │    Momento_     │
   │    (A,B,C,D)    │         │   Evaluacion    │
   └────────┬────────┘         │  (7DDA,14DDA)   │
            │                  └────────┬────────┘
            ▼                           │
   ┌─────────────────┐                  │
   │     Parcela     │                  │
   │  (tratamiento)  │◄─────────────────┘
   └────────┬────────┘                  
            │                           
            ▼                           
   ┌─────────────────┐         ┌─────────────────┐
   │   Datos_Campo   │────────▶│  Datos_Campo_   │
   │   (por visita)  │         │    Medicion     │
   └────────┬────────┘         │ (valor,variable)│
            │                  └─────────────────┘
            │
   ┌────────┴────────┐
   ▼                 ▼
┌──────────┐   ┌──────────────┐
│  Foto_   │   │ Datos_       │
│ Registro │   │ Cosecha      │
└──────────┘   └──────────────┘
```

---

## 3. FLUJO DE TRABAJO

### 3.1 Configuración Inicial (Una vez por tipo de ensayo)

1. **Definir Tipo de Ensayo** (Admin)
   - Nombre: "Herbicidas Pre-emergentes Soja"
   - Días de evaluación: 7, 14, 21, 28

2. **Asignar Variables al Tipo** (Admin)
   - % Control Maleza Hoja Ancha (escala 0-100%, requerido)
   - % Control Gramíneas (escala 0-100%, requerido)
   - Fitotoxicidad (escala 0-5, opcional)

### 3.2 Flujo en Campo (Técnico)

```
┌──────────────────────────────────────────────────────────────────┐
│                     FLUJO DE MEDICIÓN EN CAMPO                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. SELECCIONAR ENSAYO                                           │
│     └─▶ Ver ensayos asignados (filtrar por usuario/laboratorio) │
│                                                                   │
│  2. REGISTRAR APLICACIÓN (si es la primera vez)                  │
│     ├─▶ Fecha y hora de aplicación                               │
│     ├─▶ Estadio del cultivo                                      │
│     ├─▶ Condiciones climáticas                                   │
│     └─▶ Equipo utilizado                                         │
│                                                                   │
│  3. SELECCIONAR MOMENTO DE EVALUACIÓN                            │
│     ├─▶ Ver días programados: 7 DDA, 14 DDA, etc.               │
│     ├─▶ Fecha real de evaluación                                 │
│     └─▶ Estado: Pendiente / En Progreso / Completado             │
│                                                                   │
│  4. MEDIR POR PARCELA (optimizado para velocidad)                │
│     ├─▶ Escanear QR de parcela (o seleccionar manual)           │
│     ├─▶ Ver tratamiento aplicado                                 │
│     ├─▶ Ingresar valores de cada variable                        │
│     ├─▶ Tomar foto/video (opcional pero recomendado)            │
│     ├─▶ Agregar observaciones                                    │
│     └─▶ GUARDAR → Siguiente parcela                              │
│                                                                   │
│  5. REGISTRAR COSECHA (al finalizar ensayo)                      │
│     ├─▶ Por parcela: rendimiento, humedad                        │
│     └─▶ Observaciones finales                                    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.3 Cálculo de Fechas

```javascript
// Ejemplo: Aplicación el 15/01/2026
const fechaAplicacion = new Date('2026-01-15');

// Días de evaluación del tipo de ensayo: [7, 14, 21, 28]
const diasEvaluacion = [7, 14, 21, 28];

// Calcular fechas
const momentos = diasEvaluacion.map(dia => ({
  dda: dia,
  fechaProgramada: addDays(fechaAplicacion, dia),
  // 7 DDA: 22/01/2026
  // 14 DDA: 29/01/2026
  // 21 DDA: 05/02/2026
  // 28 DDA: 12/02/2026
}));
```

---

## 4. DISEÑO DE INTERFAZ MOBILE-FIRST

### 4.1 Principios de Diseño

1. **Mobile-First**: Diseñar primero para móvil, luego adaptar a desktop
2. **Botones grandes**: Mínimo 48x48px para táctil
3. **Inputs numéricos**: Teclado numérico automático
4. **Gestos**: Swipe para navegar entre parcelas
5. **Offline-capable**: Guardar localmente si no hay conexión
6. **Feedback inmediato**: Confirmación visual al guardar

### 4.2 Pantallas Principales

#### Pantalla 1: Lista de Ensayos para Medir
```
┌─────────────────────────────────┐
│  📊 Mis Ensayos                 │
│  ─────────────────────────────  │
│                                 │
│  🔍 [Buscar ensayo...]          │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🌱 Ensayo BASF-2026-001 │    │
│  │ Herbicidas Pre-Soja     │    │
│  │ 📍 Córdoba, Est. La Fe  │    │
│  │ ⏰ Próx: 14 DDA (mañana)│    │
│  │ [▶ MEDIR]              │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🌱 Ensayo SYNGE-2026-002│    │
│  │ Fungicidas Maíz         │    │
│  │ 📍 Santa Fe, Lote 5     │    │
│  │ ⏰ Próx: 7 DDA (hoy)    │    │
│  │ [▶ MEDIR]              │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

#### Pantalla 2: Selección de Momento/DDA
```
┌─────────────────────────────────┐
│  ← BASF-2026-001                │
│  Herbicidas Pre-Soja            │
│  ─────────────────────────────  │
│                                 │
│  📅 Aplicación: 15/01/2026      │
│  🌿 Estadio: V2                 │
│                                 │
│  Momentos de Evaluación:        │
│                                 │
│  ┌─────────────────────────┐    │
│  │ ✅ 7 DDA - 22/01/2026   │    │
│  │    Completado (48/48)   │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🔵 14 DDA - 29/01/2026  │    │
│  │    En progreso (24/48)  │    │
│  │    [▶ CONTINUAR]        │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ ⏳ 21 DDA - 05/02/2026  │    │
│  │    Pendiente            │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

#### Pantalla 3: Medición de Parcela (PRINCIPAL)
```
┌─────────────────────────────────┐
│  ← 14 DDA | Parcela 12/48       │
│  ─────────────────────────────  │
│                                 │
│  📍 BASF-001-A-2.3              │
│  Bloque A | Pos: (2,3)          │
│  🧪 Trat #3: Fomesafen 25%      │
│                                 │
│  ─────────────────────────────  │
│  📏 MEDICIONES                  │
│                                 │
│  % Control Hoja Ancha *         │
│  ┌─────────────────────────┐    │
│  │      [    85    ]  %    │    │
│  └─────────────────────────┘    │
│                                 │
│  % Control Gramíneas *          │
│  ┌─────────────────────────┐    │
│  │      [    90    ]  %    │    │
│  └─────────────────────────┘    │
│                                 │
│  Fitotoxicidad (0-5)            │
│  ┌─────────────────────────┐    │
│  │ [0] [1] [2] [3] [4] [5] │    │
│  └─────────────────────────┘    │
│                                 │
│  📝 Observaciones               │
│  ┌─────────────────────────┐    │
│  │ Parcela con buen        │    │
│  │ desarrollo...           │    │
│  └─────────────────────────┘    │
│                                 │
│  ─────────────────────────────  │
│  📸 FOTOS/VIDEOS                │
│  ┌───┐ ┌───┐ ┌───┐             │
│  │ 🖼️│ │ 🖼️│ │ + │             │
│  └───┘ └───┘ └───┘             │
│                                 │
│  ─────────────────────────────  │
│  ┌─────────────────────────┐    │
│  │    [◀ ANTERIOR]         │    │
│  │                         │    │
│  │  [✓ GUARDAR Y SIGUIENTE]│    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

#### Pantalla 4: Captura de Foto
```
┌─────────────────────────────────┐
│  ← Foto | BASF-001-A-2.3        │
│  ─────────────────────────────  │
│                                 │
│  ┌─────────────────────────┐    │
│  │                         │    │
│  │                         │    │
│  │      [VISTA PREVIA      │    │
│  │       DE CÁMARA]        │    │
│  │                         │    │
│  │                         │    │
│  └─────────────────────────┘    │
│                                 │
│  Info automática:               │
│  📅 29/01/2026 10:35            │
│  📍 14 DDA                      │
│  🌱 Parcela A-2.3               │
│  🧪 Trat #3                     │
│                                 │
│  ─────────────────────────────  │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │     [ 📷 CAPTURAR ]       │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  [📁 Galería]  [🎥 Video]       │
│                                 │
└─────────────────────────────────┘
```

### 4.3 Navegación Optimizada

```
Navegación por Swipe:
◀ Swipe izquierda: Parcela anterior
▶ Swipe derecha: Parcela siguiente (si guardó)

Atajos:
- QR Scanner: Escanear para ir directo a parcela
- Lista rápida: Ver todas las parcelas del bloque
- Modo offline: Indicador de sincronización pendiente
```

---

## 5. IMPLEMENTACIÓN BACKEND

### 5.1 Endpoints Necesarios

#### Aplicaciones
```
POST   /api/v1/aplicaciones
       Body: { ensayoId, nombreAplicacion, fechaHora, estadioCultivo, 
               tempC, humedadPct, vientoKmh, equipoInfo, picoInfo, presionBar }
       Response: Aplicacion con momentos generados automáticamente

GET    /api/v1/aplicaciones?ensayoId=X
       Response: Lista de aplicaciones del ensayo

GET    /api/v1/aplicaciones/:id
       Response: Aplicacion con momentos y progreso

PATCH  /api/v1/aplicaciones/:id
       Body: Campos a actualizar
```

#### Momentos de Evaluación
```
GET    /api/v1/momentos?aplicacionId=X
       Response: Lista de momentos con estado (pendiente/progreso/completado)

GET    /api/v1/momentos/:id
       Response: Momento con parcelas y mediciones

PATCH  /api/v1/momentos/:id
       Body: { fechaEvaluacion }
```

#### Datos de Campo (Mediciones)
```
POST   /api/v1/datos-campo
       Body: { parcelaId, momentoId, observaciones }
       Response: DatosCampo creado

GET    /api/v1/datos-campo?momentoId=X
       Response: Lista de visitas con mediciones

GET    /api/v1/datos-campo/:id
       Response: Visita completa con mediciones y fotos

POST   /api/v1/datos-campo/:id/mediciones
       Body: { mediciones: [{ variableId, valor }] }
       Response: Mediciones guardadas

PATCH  /api/v1/datos-campo/:id
       Body: { observaciones }
```

#### Fotos y Videos
```
POST   /api/v1/fotos/upload
       Body: FormData { file, datoCampoId }
       Response: FotoRegistro creado con URL

GET    /api/v1/fotos?datoCampoId=X
       Response: Lista de fotos de la visita

DELETE /api/v1/fotos/:id
       Response: { deleted: true }
```

#### Datos de Cosecha
```
POST   /api/v1/datos-cosecha
       Body: { parcelaId, fechaCosecha, humedadPct, kgHaCorregido, observaciones }

GET    /api/v1/datos-cosecha?ensayoId=X
       Response: Cosecha por parcela del ensayo

PATCH  /api/v1/datos-cosecha/:id
       Body: Campos a actualizar
```

#### Configuración (Tipos de Ensayo)
```
GET    /api/v1/tipos-ensayo/:id/variables
       Response: Variables configuradas para el tipo

GET    /api/v1/tipos-ensayo/:id/dias
       Response: Días de evaluación configurados

POST   /api/v1/tipos-ensayo/:id/variables
       Body: { variableId, orden, requerido, escala, rangoMin, rangoMax }

POST   /api/v1/tipos-ensayo/:id/dias
       Body: { dia }
```

### 5.2 DTOs a Crear

```typescript
// create-aplicacion.dto.ts
export class CreateAplicacionDto {
  @IsInt() ensayoId: number;
  @IsString() nombreAplicacion: string;
  @IsDateString() fechaHora: string;
  @IsOptional() @IsString() estadioCultivo?: string;
  @IsOptional() @IsNumber() tempC?: number;
  @IsOptional() @IsNumber() humedadPct?: number;
  @IsOptional() @IsNumber() vientoKmh?: number;
  @IsOptional() @IsString() equipoInfo?: string;
  @IsOptional() @IsString() picoInfo?: string;
  @IsOptional() @IsNumber() presionBar?: number;
}

// create-datos-campo.dto.ts
export class CreateDatosCampoDto {
  @IsInt() parcelaId: number;
  @IsInt() momentoId: number;
  @IsOptional() @IsString() observaciones?: string;
}

// create-medicion.dto.ts
export class CreateMedicionDto {
  @IsInt() variableId: number;
  @IsString() valor: string;
}

// bulk-mediciones.dto.ts
export class BulkMedicionesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMedicionDto)
  mediciones: CreateMedicionDto[];
}
```

### 5.3 Servicios a Crear/Modificar

```
src/
├── aplicaciones/
│   ├── aplicaciones.module.ts
│   ├── aplicaciones.controller.ts
│   ├── aplicaciones.service.ts
│   └── dto/
│       ├── create-aplicacion.dto.ts
│       └── update-aplicacion.dto.ts
│
├── momentos/
│   ├── momentos.module.ts
│   ├── momentos.controller.ts
│   └── momentos.service.ts
│
├── datos-campo/
│   ├── datos-campo.module.ts
│   ├── datos-campo.controller.ts
│   ├── datos-campo.service.ts
│   └── dto/
│       ├── create-datos-campo.dto.ts
│       ├── create-medicion.dto.ts
│       └── bulk-mediciones.dto.ts
│
├── fotos/
│   ├── fotos.module.ts
│   ├── fotos.controller.ts
│   ├── fotos.service.ts
│   └── multer.config.ts        # Configuración de upload
│
└── datos-cosecha/
    ├── datos-cosecha.module.ts
    ├── datos-cosecha.controller.ts
    ├── datos-cosecha.service.ts
    └── dto/
        ├── create-datos-cosecha.dto.ts
        └── update-datos-cosecha.dto.ts
```

---

## 6. IMPLEMENTACIÓN FRONTEND

### 6.1 Stores a Crear

```typescript
// stores/aplicaciones.ts
export const useAplicacionesStore = defineStore('aplicaciones', () => {
  const aplicaciones = ref<Aplicacion[]>([]);
  
  async function fetchByEnsayo(ensayoId: number) { ... }
  async function create(data: CreateAplicacion) { ... }
  async function update(id: number, data: Partial<Aplicacion>) { ... }
});

// stores/momentos.ts
export const useMomentosStore = defineStore('momentos', () => {
  const momentos = ref<MomentoEvaluacion[]>([]);
  const currentMomento = ref<MomentoEvaluacion | null>(null);
  
  async function fetchByAplicacion(aplicacionId: number) { ... }
  async function getProgreso(momentoId: number) { ... }
});

// stores/datos-campo.ts
export const useDatosCampoStore = defineStore('datosCampo', () => {
  const visitas = ref<DatosCampo[]>([]);
  const currentVisita = ref<DatosCampo | null>(null);
  
  async function fetchByMomento(momentoId: number) { ... }
  async function create(data: CreateDatosCampo) { ... }
  async function addMediciones(id: number, mediciones: Medicion[]) { ... }
});

// stores/fotos.ts
export const useFotosStore = defineStore('fotos', () => {
  const fotos = ref<FotoRegistro[]>([]);
  
  async function upload(file: File, datoCampoId: number) { ... }
  async function fetchByVisita(datoCampoId: number) { ... }
  async function delete(id: number) { ... }
});
```

### 6.2 Páginas a Crear

```
pages/
├── mediciones/
│   ├── index.vue              # Lista de ensayos para medir
│   ├── [ensayoId]/
│   │   ├── index.vue          # Aplicaciones y momentos del ensayo
│   │   ├── aplicacion/
│   │   │   └── [id].vue       # Detalle de aplicación
│   │   └── momento/
│   │       └── [id].vue       # Medición de parcelas (pantalla principal)
│   └── cosecha/
│       └── [ensayoId].vue     # Datos de cosecha
```

### 6.3 Componentes a Crear

```
components/
├── mediciones/
│   ├── EnsayoMedicionCard.vue    # Tarjeta de ensayo con próximo DDA
│   ├── MomentoCard.vue           # Tarjeta de momento con progreso
│   ├── ParcelaMedicionForm.vue   # Formulario de medición (PRINCIPAL)
│   ├── VariableInput.vue         # Input inteligente según tipo variable
│   ├── FotoCapture.vue           # Captura de foto/video
│   ├── FotoGallery.vue           # Galería de fotos de la visita
│   ├── ParcelaNavigation.vue     # Navegación entre parcelas
│   ├── QRScanner.vue             # Escáner de QR de parcela
│   └── OfflineIndicator.vue      # Indicador de modo offline
│
├── aplicaciones/
│   ├── AplicacionForm.vue        # Formulario de nueva aplicación
│   └── CondicionesClimaticas.vue # Inputs de condiciones
│
└── cosecha/
    ├── CosechaForm.vue           # Formulario de datos de cosecha
    └── CosechaTable.vue          # Tabla resumen
```

### 6.4 Composables a Crear

```typescript
// composables/useMediciones.ts
export function useMediciones(ensayoId: Ref<number>) {
  const aplicacionesStore = useAplicacionesStore();
  const momentosStore = useMomentosStore();
  
  const aplicaciones = computed(() => aplicacionesStore.aplicaciones);
  const currentMomento = computed(() => momentosStore.currentMomento);
  
  async function iniciarMedicion(momentoId: number) { ... }
  async function guardarYSiguiente(datos: DatosMedicion) { ... }
  
  return { aplicaciones, currentMomento, iniciarMedicion, guardarYSiguiente };
}

// composables/useCamera.ts
export function useCamera() {
  const stream = ref<MediaStream | null>(null);
  
  async function openCamera() { ... }
  async function capturePhoto() { ... }
  async function captureVideo() { ... }
  function closeCamera() { ... }
  
  return { stream, openCamera, capturePhoto, captureVideo, closeCamera };
}

// composables/useOfflineSync.ts
export function useOfflineSync() {
  const pendingSync = ref<any[]>([]);
  const isOnline = ref(navigator.onLine);
  
  function queueForSync(data: any) { ... }
  async function syncPending() { ... }
  
  return { pendingSync, isOnline, queueForSync, syncPending };
}
```

---

## 7. SISTEMA DE FOTOS Y VIDEOS

### 7.1 Requisitos

1. **Captura directa**: Usar cámara del dispositivo
2. **Subir desde galería**: Seleccionar fotos existentes
3. **Videos cortos**: Máximo 30 segundos recomendado
4. **Compresión**: Reducir tamaño antes de subir
5. **Metadatos automáticos**: Fecha, GPS, parcela, DDA
6. **Almacenamiento**: Servidor local o cloud (S3, etc.)

### 7.2 Estructura de Almacenamiento

```
uploads/
├── fotos/
│   ├── 2026/
│   │   ├── 01/
│   │   │   ├── ensayo_74_parcela_123_14dda_001.jpg
│   │   │   ├── ensayo_74_parcela_123_14dda_002.jpg
│   │   │   └── ensayo_74_parcela_124_14dda_001.mp4
```

### 7.3 Backend: Configuración Multer

```typescript
// src/fotos/multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      cb(null, `./uploads/fotos/${year}/${month}`);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB máximo
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'), false);
    }
  },
};
```

### 7.4 Frontend: Componente de Captura

```vue
<!-- components/mediciones/FotoCapture.vue -->
<template>
  <div class="foto-capture">
    <!-- Vista previa de cámara -->
    <video v-if="showCamera" ref="videoRef" autoplay playsinline />
    
    <!-- Controles -->
    <div class="controls">
      <button @click="capturePhoto" class="btn-capture">
        📷 Capturar
      </button>
      <button @click="toggleVideo" class="btn-video">
        {{ isRecording ? '⏹️ Detener' : '🎥 Video' }}
      </button>
      <button @click="openGallery" class="btn-gallery">
        📁 Galería
      </button>
    </div>
    
    <!-- Input oculto para galería -->
    <input 
      type="file" 
      ref="fileInput" 
      accept="image/*,video/*" 
      capture="environment"
      @change="handleFileSelect"
      hidden
    />
  </div>
</template>
```

---

## 8. TAREAS DETALLADAS

### FASE 1: Backend Base (4-5 horas)

#### Tarea 1.1: Módulo Aplicaciones
- [ ] Crear `aplicaciones.module.ts`
- [ ] Crear `aplicaciones.controller.ts` con endpoints CRUD
- [ ] Crear `aplicaciones.service.ts` con lógica de negocio
- [ ] Crear DTOs: `create-aplicacion.dto.ts`, `update-aplicacion.dto.ts`
- [ ] Documentar en Swagger
- [ ] Al crear aplicación, generar automáticamente momentos según tipo de ensayo

#### Tarea 1.2: Módulo Momentos
- [ ] Crear `momentos.module.ts`
- [ ] Crear `momentos.controller.ts`
- [ ] Crear `momentos.service.ts`
- [ ] Endpoint para obtener progreso (parcelas medidas / total)

#### Tarea 1.3: Módulo Datos Campo
- [ ] Crear `datos-campo.module.ts`
- [ ] Crear `datos-campo.controller.ts`
- [ ] Crear `datos-campo.service.ts`
- [ ] DTOs para mediciones individuales y bulk
- [ ] Validación de valores según rango de variable

#### Tarea 1.4: Módulo Fotos
- [ ] Crear `fotos.module.ts`
- [ ] Configurar Multer para uploads
- [ ] Crear endpoints de upload, listado, eliminación
- [ ] Servir archivos estáticos (ServeStaticModule)

#### Tarea 1.5: Módulo Datos Cosecha
- [ ] Crear `datos-cosecha.module.ts`
- [ ] CRUD completo
- [ ] Relación 1:1 con Parcela

### FASE 2: Frontend - Stores y Composables (2-3 horas)

#### Tarea 2.1: Stores
- [ ] `stores/aplicaciones.ts`
- [ ] `stores/momentos.ts`
- [ ] `stores/datos-campo.ts`
- [ ] `stores/fotos.ts`
- [ ] `stores/datos-cosecha.ts`

#### Tarea 2.2: Composables
- [ ] `composables/useMediciones.ts`
- [ ] `composables/useCamera.ts`
- [ ] `composables/useOfflineSync.ts` (opcional, fase posterior)

### FASE 3: Frontend - Páginas y Componentes (6-8 horas)

#### Tarea 3.1: Página Lista de Ensayos para Medir
- [ ] `pages/mediciones/index.vue`
- [ ] Filtrar por usuario/laboratorio
- [ ] Mostrar próximo DDA
- [ ] Link a detalle

#### Tarea 3.2: Página de Aplicaciones
- [ ] `pages/mediciones/[ensayoId]/index.vue`
- [ ] Listar aplicaciones existentes
- [ ] Modal para nueva aplicación
- [ ] Listar momentos con progreso

#### Tarea 3.3: Página de Medición (PRINCIPAL)
- [ ] `pages/mediciones/[ensayoId]/momento/[id].vue`
- [ ] Navegación entre parcelas (anterior/siguiente)
- [ ] Formulario de variables dinámico
- [ ] Captura de fotos integrada
- [ ] Guardar y avanzar

#### Tarea 3.4: Componentes de Medición
- [ ] `ParcelaMedicionForm.vue` - Formulario principal
- [ ] `VariableInput.vue` - Input según tipo (numérico, escala, texto)
- [ ] `FotoCapture.vue` - Captura de cámara
- [ ] `FotoGallery.vue` - Galería con eliminación
- [ ] `ParcelaNavigation.vue` - Barra de navegación

#### Tarea 3.5: Página de Cosecha
- [ ] `pages/mediciones/cosecha/[ensayoId].vue`
- [ ] Formulario por parcela
- [ ] Tabla resumen

### FASE 4: Optimización Mobile (2-3 horas)

#### Tarea 4.1: Responsive Design
- [ ] Verificar todos los componentes en móvil
- [ ] Botones táctiles grandes
- [ ] Teclado numérico para inputs

#### Tarea 4.2: Performance
- [ ] Lazy loading de imágenes
- [ ] Compresión de fotos antes de subir
- [ ] Paginación de parcelas si son muchas

#### Tarea 4.3: UX
- [ ] Feedback visual al guardar
- [ ] Indicador de progreso
- [ ] Confirmación antes de salir sin guardar

---

## 9. CRONOGRAMA SUGERIDO

### Sesión 5A: Backend Mediciones (4-5 horas)
- Fase 1 completa
- Testing con Postman/Swagger

### Sesión 5B: Frontend Base (3-4 horas)
- Stores y composables
- Páginas base

### Sesión 5C: Frontend Medición Principal (4-5 horas)
- Pantalla de medición de parcelas
- Navegación entre parcelas
- Formulario de variables

### Sesión 5D: Fotos y Optimización (3-4 horas)
- Sistema de captura de fotos
- Optimización mobile
- Testing completo

---

## 📋 CHECKLIST FINAL

Antes de considerar completo el sistema de mediciones:

- [ ] Puedo crear una aplicación con fecha/hora y condiciones
- [ ] Los momentos se generan automáticamente según tipo de ensayo
- [ ] Puedo ver el progreso de cada momento (X/Y parcelas medidas)
- [ ] Puedo medir cada parcela con las variables del tipo de ensayo
- [ ] Los valores se validan según rango configurado
- [ ] Puedo tomar fotos desde la cámara del dispositivo
- [ ] Las fotos quedan vinculadas a la parcela/momento correcto
- [ ] Puedo navegar fácilmente entre parcelas
- [ ] El sistema funciona correctamente en móvil
- [ ] Puedo registrar datos de cosecha por parcela
- [ ] El dashboard muestra resumen de mediciones pendientes

---

**Documento creado**: 29 de Enero, 2026  
**Para usar en**: Próximas sesiones de desarrollo  
**Autor**: Sistema TMS con asistencia IA
