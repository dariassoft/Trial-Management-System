# Setup de Base de Datos - TMS (Trial Management System)

## Orden correcto de ejecución de scripts SQL

La base de datos debe ser inicializada en el siguiente orden **estricto** para evitar errores de dependencias:

### 1. **`../database.sql`** (PRIMERO - Creación de todas las tablas)
   - Elimina todas las tablas si existen
   - Crea estructura completa:
     - Tablas de autenticación (Rol, Usuario, Usuario_Laboratorio)
     - Tablas de catálogos (Cultivo, Cultivo_Variedad, Protocolo_Variable, Tipo_Ensayo)
     - Tablas de ensayos (Ensayo, Aplicacion, Tratamiento, Parcela, Bloque, etc.)
     - Tablas de datos (Datos_Campo, Datos_Cosecha, Momento_Evaluacion, etc.)
   - Crea índices para optimización

### 2. **`auth_seed.sql`** (Segundo - Roles y usuario inicial)
   - Inserta los 5 roles base (Superadministrador, Administrador, Manager, Técnico, Invitado)
   - Crea usuario superadministrador inicial: `dariassoft@gmail.com` / `123456` (en texto plano inicialmente)

### 3. **`cultivo_y_cultivo_variedad.sql`** (Tercero - Datos de catálogo)
   - Inserta cultivos base (Soja, Maíz, Barbecho, Poroto, Maní, Otros)

### 4. **`tipo_ensayo.sql`** (Cuarto - Tablas adicionales, si no existen en database.sql)
   - OPCIONAL: Si `database.sql` ya contiene estas tablas, este script es redundante
   - Crea Tipo_Ensayo, Tipo_Ensayo_Variable, Tipo_Ensayo_EvaluacionDia

### 5. **`tipo_ensayo_seed.sql`** (Quinto - Datos de tipos de ensayo)
   - Inserta Protocolo_Variable (diccionario de variables de medición)
   - Inserta Tipo_Ensayo predefinidos (Laboratorio, Barbecho, Preemergentes, etc.)
   - Vincula variables a tipos de ensayo con orden y requerimientos

### 6. **`alter_ensayo_laboratorio.sql`** (Sexto - Alteraciones a Ensayo)
   - Agrega columnas a Ensayo (lab_id_fk, codigo_labor, tipo_ensayo_id_fk)
   - Crea índices y restricciones de integridad

### 7. **`alter_parcela_nombre.sql`** (Séptimo - Alteraciones a Parcela)
   - Agrega columna `nombre_parcela` a Parcela
   - Crea índices de unicidad

---

## ⚠️ IMPORTANTE: Post-Setup de Contraseña

Después de ejecutar el setup, la contraseña del usuario `dariassoft@gmail.com` está en **texto plano** (`123456`).

**Para hashearla, ejecuta:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/bootstrap-hash \
  -H "Content-Type: application/json" \
  -d '{"username": "dariassoft@gmail.com"}'
```

**Respuesta esperada:**
```json
{"updated": true}
```

---

## 🚀 Forma rápida: Script unificado

Crear un archivo `setup_complete.sql` que ejecute todo en orden:

```sql
-- 1. Crear tablas base
source ../database.sql;

-- 2. Seed de autenticación
source auth_seed.sql;

-- 3. Catálogos iniciales
source cultivo_y_cultivo_variedad.sql;

-- 4. Tablas de Tipo Ensayo (si es necesario)
-- source tipo_ensayo.sql;

-- 5. Seed de Tipos de Ensayo y Variables
source tipo_ensayo_seed.sql;

-- 6. Alterar Ensayo
source alter_ensayo_laboratorio.sql;

-- 7. Alterar Parcela
source alter_parcela_nombre.sql;
```

Luego ejecutar:
```bash
mysql -u root -p nest_db < setup_complete.sql
```

---

## Verificar estado de la BD

```bash
# Entrar a MySQL
mysql -u root -p nest_db

# Listar tablas
SHOW TABLES;

# Verificar usuario creado
SELECT usuario_id, username, password_hash, nombre, rol_id_fk FROM Usuario;

# Verificar roles
SELECT * FROM Rol;

# Verificar cultivos
SELECT * FROM Cultivo;

# Verificar Tipos de Ensayo
SELECT * FROM Tipo_Ensayo;
```

---

## Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Foreign key constraint fails` | Tabla no existe | Ejecutar scripts en orden |
| `Table already exists` | Tabla duplicada | `database.sql` usa `DROP TABLE IF EXISTS` |
| `401 Unauthorized` en login | Contraseña no hasheada | Ejecutar bootstrap-hash endpoint |
| `Column not found` | Falta alter | Ejecutar `alter_*.sql` |

---

## Estado actual de los archivos

✅ `database.sql` - **COMPLETO** (contiene todas las tablas incluyendo autenticación)
✅ `auth_seed.sql` - **COMPLETO** (roles + usuario inicial)
✅ `cultivo_y_cultivo_variedad.sql` - **COMPLETO** (cultivos base)
✅ `tipo_ensayo.sql` - **OPCIONAL** (ya incluido en database.sql)
✅ `tipo_ensayo_seed.sql` - **COMPLETO** (tipos y variables)
✅ `alter_ensayo_laboratorio.sql` - **COMPLETO** (columnas Ensayo)
✅ `alter_parcela_nombre.sql` - **COMPLETO** (columnas Parcela)


