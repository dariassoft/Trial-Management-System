# Actualización: Tabla de Status para Ensayos

**Fecha**: Diciembre 14, 2025  
**Versión**: 1.0  
**Estado**: ✅ Completado

## 📋 Resumen

Se implementó una tabla `StatusEnsayo` para gestionar los estados disponibles de cada ensayo (Por Iniciar, En Ejecución, En Análisis, Completado, Cancelado, Suspendido, Archivado).

## 🗄️ Base de Datos

### Tabla: StatusEnsayo

```sql
CREATE TABLE IF NOT EXISTS StatusEnsayo (
  status_id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(255),
  activo BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Campos**:
- `status_id` - ID único (autoincremental)
- `nombre` - Nombre del estado (ej: "Por Iniciar")
- `descripcion` - Descripción del estado
- `activo` - Indica si está disponible
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de última actualización

**Relación con Ensayo**:
- `Ensayo.status_id_fk` → `StatusEnsayo.status_id`
- Tipo: Many-to-One
- Nullable: Sí
- Eager: Sí (carga automática)

### Scripts SQL

#### Crear tabla (Archivo: `20_create_status_ensayo.sql`)

```bash
# Ejecutar dentro del contenedor MySQL
mysql -u root -proot tms_db < docs/20_create_status_ensayo.sql
```

#### Seed de datos (Archivo: `21_seed_status_ensayo.sql`)

```bash
# Ejecutar después de crear tabla
mysql -u root -proot tms_db < docs/21_seed_status_ensayo.sql
```

**Estados predefinidos**:
1. Por Iniciar
2. En Ejecución
3. En Análisis
4. Completado
5. Cancelado
6. Suspendido
7. Archivado

## 🔌 Backend (NestJS)

### Entidad: StatusEnsayo

**Archivo**: `src/entities/status-ensayo.entity.ts`

```typescript
@Entity('StatusEnsayo')
export class StatusEnsayo {
  @PrimaryGeneratedColumn({ name: 'status_id' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion?: string | null;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Ensayo, (ensayo) => ensayo.status)
  ensayos: Ensayo[];
}
```

### Relación en Ensayo

**Archivo**: `src/entities/ensayo.entity.ts`

```typescript
@ManyToOne(() => StatusEnsayo, (status) => status.ensayos, { nullable: true, eager: true })
@JoinColumn({ name: 'status_id_fk' })
status?: StatusEnsayo | null;
```

### Controlador: StatusEnsayoController

**Archivo**: `src/status-ensayo/status-ensayo.controller.ts`

**Endpoints**:

```
GET    /api/v1/status-ensayos
       Obtiene todos los estados disponibles (filtrados por activo=true)
       Response: StatusEnsayo[]
       
GET    /api/v1/status-ensayos/:id
       Obtiene un estado por ID
       Response: StatusEnsayo | null
```

### DTOs

#### CreateEnsayoDto

**Archivo**: `src/ensayos/dto/create-ensayo.dto.ts`

```typescript
@ApiPropertyOptional({ description: 'ID del Estado del ensayo', example: 1, type: Number })
@IsOptional()
@IsInt()
statusId?: number | null;
```

#### UpdateEnsayoDto

**Archivo**: `src/ensayos/dto/update-ensayo.dto.ts`

```typescript
@ApiPropertyOptional({ description: 'ID del Estado del ensayo', example: 2 })
@IsOptional()
@IsInt()
statusId?: number | null;
```

### Servicio: StatusEnsayoService

**Archivo**: `src/status-ensayo/status-ensayo.service.ts`

```typescript
async findAll(): Promise<StatusEnsayo[]>
  // Retorna todos los estados activos ordenados por ID

async findById(id: number): Promise<StatusEnsayo | null>
  // Retorna un estado por ID

async create(nombre: string, descripcion?: string): Promise<StatusEnsayo>
  // Crea un nuevo estado

async update(id: number, nombre?: string, descripcion?: string): Promise<StatusEnsayo>
  // Actualiza un estado

async delete(id: number): Promise<void>
  // Marca un estado como inactivo (no lo elimina)
```

## 🎨 Frontend (Nuxt 3)

### Store: catalogosStore

**Archivo**: `tms-client-vue/stores/catalogos.ts`

```typescript
const statusEnsayos = ref([]);

const fetchStatusEnsayos = async () => {
  try {
    const response = await api.get('/status-ensayos');
    if (Array.isArray(response)) {
      statusEnsayos.value = response;
    } else if (response && Array.isArray(response.data)) {
      statusEnsayos.value = response.data;
    }
    return statusEnsayos.value;
  } catch (error) {
    console.error('Error fetching status ensayos:', error);
    return [];
  }
};

// En el método init()
const init = () => {
  // ... otros fetch ...
  fetchStatusEnsayos();
};
```

### Formulario: EnsayoForm.vue

**Archivo**: `tms-client-vue/components/ensayos/EnsayoForm.vue`

**Campo de Status**:

```vue
<!-- Estado -->
<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
  <h3 class="text-lg font-semibold mb-4">Estado</h3>
  <div>
    <label class="block font-medium mb-1">Status</label>
    <select v-model.number="form.statusId" class="w-full border p-2 rounded">
      <option :value="null">Seleccionar Estado</option>
      <option v-for="s in catalogosStore.statusEnsayos" :key="s.id" :value="s.id">
        {{ s.nombre }}
      </option>
    </select>
  </div>
</div>
```

**En form.value**:
```typescript
form.value = {
  // ... otros campos ...
  statusId: null,
};
```

**En loadDependentData()**:
```typescript
await Promise.all([
  // ... otros fetch ...
  catalogosStore.fetchStatusEnsayos(),
]);
```

### Páginas: Ensayos

**Archivo**: `tms-client-vue/pages/ensayos/index.vue`

```vue
<!-- Columna Status en tabla -->
<td class="px-6 py-4">
  <span :class="getStatusClass(ensayo.status?.nombre || '')">
    {{ ensayo.status?.nombre || '-' }}
  </span>
</td>
```

### Dashboard: RecentEnsayos

**Archivo**: `tms-client-vue/components/dashboard/RecentEnsayos.vue`

```vue
<!-- Status badge -->
<td class="px-6 py-4">
  <span :class="getStatusClass(ensayo.status?.nombre || '')">
    {{ ensayo.status?.nombre || '-' }}
  </span>
</td>
```

### Store: Ensayos

**Archivo**: `tms-client-vue/stores/ensayos.ts`

```typescript
export interface Ensayo {
  // ... otros campos ...
  status?: { id: number; nombre: string } | null;
  statusId?: number | null;
}
```

## 📡 Endpoints Documentados

### GET /api/v1/status-ensayos

Obtiene todos los estados disponibles.

**Parámetros**: Ninguno

**Response** (200):
```json
[
  {
    "id": 1,
    "nombre": "Por Iniciar",
    "descripcion": "Ensayo creado pero aún no ha comenzado",
    "activo": true,
    "createdAt": "2025-12-14T10:00:00.000Z",
    "updatedAt": "2025-12-14T10:00:00.000Z"
  },
  {
    "id": 2,
    "nombre": "En Ejecución",
    "descripcion": "Ensayo actualmente en ejecución en campo",
    "activo": true,
    "createdAt": "2025-12-14T10:00:00.000Z",
    "updatedAt": "2025-12-14T10:00:00.000Z"
  },
  // ... más estados ...
]
```

### GET /api/v1/status-ensayos/:id

Obtiene un estado específico.

**Parámetros**:
- `id` (path) - ID del estado

**Response** (200):
```json
{
  "id": 1,
  "nombre": "Por Iniciar",
  "descripcion": "Ensayo creado pero aún no ha comenzado",
  "activo": true,
  "createdAt": "2025-12-14T10:00:00.000Z",
  "updatedAt": "2025-12-14T10:00:00.000Z"
}
```

### POST /api/v1/ensayos (Crear Ensayo)

**Body**:
```json
{
  "nombreEnsayo": "Ensayo de Maíz 2025",
  "protocoloId": 1,
  "statusId": 1,
  // ... otros campos ...
}
```

### PATCH /api/v1/ensayos/:id (Actualizar Ensayo)

**Body**:
```json
{
  "nombreEnsayo": "Ensayo de Maíz 2025 (Actualizado)",
  "statusId": 2,
  // ... otros campos opcionales ...
}
```

## ✅ Checklist de Implementación

- [x] Crear tabla `StatusEnsayo`
- [x] Crear tabla `Ensayo.status_id_fk` (FK)
- [x] Crear seed con 7 estados
- [x] Entidad TypeORM `StatusEnsayo`
- [x] Relación `Ensayo.status` (ManyToOne)
- [x] Controlador `StatusEnsayoController` (GET endpoints)
- [x] Servicio `StatusEnsayoService`
- [x] DTOs con `statusId`
- [x] Documentación Swagger
- [x] Store `catalogosStore.fetchStatusEnsayos()`
- [x] Formulario `EnsayoForm.vue` con select
- [x] Tabla `ensayos/index.vue` mostrando status.nombre
- [x] Dashboard `RecentEnsayos.vue` mostrando status.nombre
- [x] Archivo Postman actualizado (pendiente de export)

## 🐳 Instrucciones de Aplicación

### 1. Crear tabla en BD

```bash
# Navegar a raíz del proyecto
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# Entrar al contenedor MySQL
docker-compose -f tms-backend/docker-compose.yml exec mysql bash

# Dentro del contenedor
mysql -u root -proot tms_db < /docs/20_create_status_ensayo.sql
mysql -u root -proot tms_db < /docs/21_seed_status_ensayo.sql
```

### 2. Sincronizar Frontend

El frontend ya tiene todas las actualizaciones. Solo hay que asegurar que:

```bash
# En el contenedor frontend
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml exec nuxt bash

# Dentro del contenedor
npm run typecheck  # Verificar tipos
npm run dev        # Iniciar desarrollo
```

### 3. Verificar en Swagger

Accede a `http://localhost:3000/api/docs` y busca:
- `GET /status-ensayos`
- `GET /status-ensayos/{id}`
- `POST /ensayos` (con parámetro `statusId`)
- `PATCH /ensayos/{id}` (con parámetro `statusId`)

## 📝 Notas Importantes

1. **Eager Loading**: El status se carga automáticamente cuando se obtiene un ensayo
2. **Validación**: El frontend valida que `statusId` sea un número entero
3. **Valores nulos**: Un ensayo puede tener `status` nulo (nullable)
4. **Actualización**: Usar `statusId` (no `status`) en POST/PATCH
5. **Display**: Mostrar `status.nombre` (no `status` completo) en la UI

## 🔗 Archivos Modificados

- ✅ `/docs/20_create_status_ensayo.sql` - Mejorado con IF NOT EXISTS
- ✅ `/docs/21_seed_status_ensayo.sql` - Proporciona 7 estados
- ✅ `/src/entities/status-ensayo.entity.ts` - Entidad completa
- ✅ `/src/entities/ensayo.entity.ts` - Relación agregada
- ✅ `/src/status-ensayo/status-ensayo.controller.ts` - Endpoints GET
- ✅ `/src/status-ensayo/status-ensayo.service.ts` - Métodos CRUD
- ✅ `/src/ensayos/dto/create-ensayo.dto.ts` - Campo statusId
- ✅ `/src/ensayos/dto/update-ensayo.dto.ts` - Campo statusId
- ✅ `/src/ensayos/ensayos.controller.ts` - Ejemplo Swagger actualizado
- ✅ `/tms-client-vue/stores/catalogos.ts` - fetchStatusEnsayos()
- ✅ `/tms-client-vue/stores/ensayos.ts` - Interface actualizada
- ✅ `/tms-client-vue/components/ensayos/EnsayoForm.vue` - Select agregado
- ✅ `/tms-client-vue/pages/ensayos/index.vue` - Mostrar status.nombre
- ✅ `/tms-client-vue/components/dashboard/RecentEnsayos.vue` - Mostrar status.nombre

## 📊 Impacto

- **Cambios en BD**: 1 tabla nueva + 1 FK agregada
- **Cambios en Backend**: 5+ archivos
- **Cambios en Frontend**: 6+ archivos
- **Endpoints nuevos**: 2 (GET status-ensayos)
- **Parámetros nuevos**: 1 (statusId en ensayos)
- **Estado actual**: ✅ 100% Completado

---

**Última revisión**: Diciembre 14, 2025  
**Próximo paso**: Pruebas de integración completas

