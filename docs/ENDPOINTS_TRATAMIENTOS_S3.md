# CRUD Tratamientos - Sesión 3

## Documentación de Endpoints

### 1. Crear Tratamiento
**POST** `/api/v1/tratamientos`

Roles requeridos: TECNICO, MANAGER, ADMIN, SUPERADMIN

#### Request Body
```json
{
  "protocoloId": 1,
  "numeroTrat": 2,
  "descripcion": "Fomesafen 25% - 800 cc/ha - V4",
  "esTestigo": false
}
```

#### Response (201 Created)
```json
{
  "id": 5,
  "numeroTrat": 2,
  "descripcion": "Fomesafen 25% - 800 cc/ha - V4",
  "esTestigo": false,
  "protocolo": {
    "id": 1,
    "nombre": "Protocolo Básico",
    "descripcion": "..."
  },
  "productos": []
}
```

---

### 2. Listar Tratamientos (Con Búsqueda y Filtros)
**GET** `/api/v1/tratamientos`

#### Query Parameters
| Parámetro | Tipo | Ejemplo | Descripción |
|-----------|------|---------|-------------|
| `page` | number | 1 | Número de página (default: 1) |
| `limit` | number | 10 | Registros por página (default: 10) |
| `sort` | string | numeroTrat | Campo para ordenar (default: numeroTrat) |
| `order` | string | ASC\|DESC | Dirección de orden (default: ASC) |
| `q` | string | "Fomesafen" | Búsqueda general (descripción, protocolo) |
| `protocoloId` | number | 1 | Filtrar por protocolo |
| `esTestigo` | boolean | false | Filtrar por si es testigo |

#### Ejemplos de Llamadas
```
GET /api/v1/tratamientos?page=1&limit=10
GET /api/v1/tratamientos?q=Fomesafen
GET /api/v1/tratamientos?protocoloId=1&esTestigo=false
GET /api/v1/tratamientos?sort=numeroTrat&order=ASC
```

#### Response (200 OK)
```json
{
  "data": [
    {
      "id": 1,
      "numeroTrat": 1,
      "descripcion": "Testigo (Sin aplicación)",
      "esTestigo": true,
      "protocolo": { "id": 1, "nombre": "Protocolo 1" },
      "productos": []
    },
    {
      "id": 2,
      "numeroTrat": 2,
      "descripcion": "Fomesafen 25% - 800 cc/ha - V4",
      "esTestigo": false,
      "protocolo": { "id": 1, "nombre": "Protocolo 1" },
      "productos": [
        {
          "id": 1,
          "dosis": "800",
          "unidadDosis": "cc/ha",
          "estadio": "V4",
          "producto": { "id": 10, "nombre": "Fomesafen 25%" }
        }
      ]
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "pageCount": 1
  }
}
```

---

### 3. Obtener Tratamiento Detallado
**GET** `/api/v1/tratamientos/:id`

#### Response (200 OK)
```json
{
  "id": 2,
  "numeroTrat": 2,
  "descripcion": "Fomesafen 25% + GZ - 800+500 cc/ha - V4",
  "esTestigo": false,
  "protocolo": {
    "id": 1,
    "nombre": "Protocolo Básico",
    "descripcion": "..."
  },
  "productos": [
    {
      "id": 1,
      "dosis": "800",
      "unidadDosis": "cc/ha",
      "estadio": "V4",
      "producto": {
        "id": 10,
        "nombre": "Fomesafen 25%",
        "tipo": "Herbicida"
      }
    },
    {
      "id": 2,
      "dosis": "500",
      "unidadDosis": "cc/ha",
      "estadio": "V4",
      "producto": {
        "id": 11,
        "nombre": "GZ",
        "tipo": "Adyuvante"
      }
    }
  ]
}
```

---

### 4. Actualizar Tratamiento
**PATCH** `/api/v1/tratamientos/:id`

#### Request Body (todos los campos opcionales)
```json
{
  "numeroTrat": 3,
  "descripcion": "Descripción actualizada",
  "esTestigo": false,
  "protocoloId": 1
}
```

#### Response (200 OK)
Retorna el tratamiento actualizado con todas sus relaciones.

---

### 5. Eliminar Tratamiento
**DELETE** `/api/v1/tratamientos/:id`

Roles requeridos: TECNICO, MANAGER, ADMIN, SUPERADMIN

#### Response (200 OK)
```json
{
  "deleted": true
}
```

---

## Endpoint: Tratamiento-Producto

### 1. Agregar Producto a Tratamiento
**POST** `/api/v1/tratamientos-producto`

Roles requeridos: MANAGER, ADMIN, SUPERADMIN

#### Request Body
```json
{
  "tratamientoId": 2,
  "productoId": 10,
  "dosis": "800",
  "unidadDosis": "cc/ha",
  "estadio": "V4"
}
```

#### Response (201 Created)
```json
{
  "id": 1,
  "tratamiento": {
    "id": 2,
    "numeroTrat": 2,
    "descripcion": "Fomesafen 25% - 800 cc/ha - V4",
    "esTestigo": false
  },
  "producto": {
    "id": 10,
    "nombre": "Fomesafen 25%",
    "tipo": "Herbicida"
  },
  "dosis": "800",
  "unidadDosis": "cc/ha",
  "estadio": "V4"
}
```

---

### 2. Listar Tratamientos-Productos
**GET** `/api/v1/tratamientos-producto`

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "dosis": "800",
    "unidadDosis": "cc/ha",
    "estadio": "V4",
    "tratamiento": { "id": 2, "numeroTrat": 2, "descripcion": "..." },
    "producto": { "id": 10, "nombre": "Fomesafen 25%" }
  },
  ...
]
```

---

### 3. Obtener Tratamiento-Producto
**GET** `/api/v1/tratamientos-producto/:id`

#### Response (200 OK)
```json
{
  "id": 1,
  "dosis": "800",
  "unidadDosis": "cc/ha",
  "estadio": "V4",
  "tratamiento": { "id": 2, "numeroTrat": 2, "descripcion": "..." },
  "producto": { "id": 10, "nombre": "Fomesafen 25%" }
}
```

---

### 4. Actualizar Tratamiento-Producto
**PATCH** `/api/v1/tratamientos-producto/:id`

#### Request Body
```json
{
  "dosis": "500",
  "unidadDosis": "gr/ha",
  "estadio": "V3"
}
```

#### Response (200 OK)
Retorna el registro actualizado.

---

### 5. Eliminar Tratamiento-Producto
**DELETE** `/api/v1/tratamientos-producto/:id`

#### Response (200 OK)
```json
{
  "deleted": true
}
```

---

## Ejemplo Completo de Uso

### Escenario: Crear un Protocolo con 4 Tratamientos

```bash
# 1. Crear Protocolo (usando endpoint existente)
POST /api/v1/protocolos
{
  "nombre": "Protocolo Herbicidas",
  "descripcion": "Evaluación de herbicidas en soja"
}
# Response: { id: 5, ... }

# 2. Crear 4 Tratamientos para el Protocolo
POST /api/v1/tratamientos
{
  "protocoloId": 5,
  "numeroTrat": 1,
  "descripcion": "Testigo (Sin aplicación)",
  "esTestigo": true
}
# Response: { id: 101, ... }

POST /api/v1/tratamientos
{
  "protocoloId": 5,
  "numeroTrat": 2,
  "descripcion": "Fomesafen 25% - 800 cc/ha - V4",
  "esTestigo": false
}
# Response: { id: 102, ... }

# 3. Agregar productos al Tratamiento 2
POST /api/v1/tratamientos-producto
{
  "tratamientoId": 102,
  "productoId": 10,
  "dosis": "800",
  "unidadDosis": "cc/ha",
  "estadio": "V4"
}
# Response: { id: 201, ... }

# 4. Listar Tratamientos del Protocolo
GET /api/v1/tratamientos?protocoloId=5
# Response: Lista de 4 tratamientos con todos sus datos
```

---

## Cambios en Base de Datos

### Nueva Columna en Tabla `Tratamiento_Producto`
```sql
ALTER TABLE `Tratamiento_Producto` 
ADD COLUMN `estadio` VARCHAR(20) NULL 
COMMENT 'Estadio de aplicación (V2, V3, V4, etc.)'
AFTER `unidad_dosis`;
```

### Estados de Aplicación Permitidos
- `V1` - Primera hoja verdadera
- `V2` - Segunda hoja verdadera
- `V3` - Tercera hoja verdadera
- `V4` - Cuarta hoja verdadera
- `V5`, `V6`, ... - Continuación
- `R1` - Primera flor
- `R2` - Flor abierta
- `NULL` - No especificado (para testigo)

---

## Notas Importantes

1. **Campo `estadio`**: Nuevo en esta sesión. Opcional (nullable). Indica el momento de aplicación.
2. **Campo `descripcion`**: En el tratamiento, se auto-completa en el frontend basado en productos seleccionados.
3. **Testigos**: Cuando `esTestigo = true`, no deben tener productos asociados (`dosis`, `unidadDosis`, `estadio` en NULL).
4. **Producto múltiples**: Un tratamiento puede tener varios productos (relación M:N).
5. **Validación frontend**: Verificar que testigos no tengan productos asignados.

---

Última actualización: Diciembre 11, 2025

