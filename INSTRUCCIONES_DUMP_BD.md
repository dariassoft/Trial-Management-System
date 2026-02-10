# Cómo Generar un Dump de la Base de Datos nest_db

## 📋 Opción 1: Usando el Script Bash (RECOMENDADO)

### Desde el Host:

```bash
# Navegar a la raíz del proyecto
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# Asegurarse que los contenedores estén corriendo
docker-compose -f tms-backend/docker-compose.yml ps

# Ejecutar el script dentro del contenedor MySQL
docker-compose -f tms-backend/docker-compose.yml exec mysql bash -c \
  "mysqldump --host=localhost --user=root --password=root --routines --triggers --events --single-transaction --no-tablespaces nest_db > /tmp/nest_db_dump.sql"

# Copiar el archivo del contenedor al host
docker-compose -f tms-backend/docker-compose.yml exec mysql cat /tmp/nest_db_dump.sql > nest_db_dump_$(date +%Y%m%d_%H%M%S).sql

echo "✅ Dump creado correctamente"
```

---

## 📋 Opción 2: Desde dentro del Contenedor

```bash
# Navegar a la raíz del proyecto
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# Entrar al contenedor MySQL
docker-compose -f tms-backend/docker-compose.yml exec mysql bash

# Dentro del contenedor, ejecutar:
mysqldump \
  --host=localhost \
  --user=root \
  --password=root \
  --routines \
  --triggers \
  --events \
  --single-transaction \
  --no-tablespaces \
  nest_db > /tmp/nest_db_dump.sql

# Salir del contenedor
exit

# Copiar el archivo del contenedor al host
docker-compose -f tms-backend/docker-compose.yml exec mysql cat /tmp/nest_db_dump.sql > nest_db_dump_$(date +%Y%m%d_%H%M%S).sql
```

---

## 📋 Opción 3: Desde MySQL Container Directamente

```bash
# Navegar a la raíz del proyecto
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# Comando completo (todo en una línea)
docker-compose -f tms-backend/docker-compose.yml exec mysql \
  mysqldump --host=localhost --user=root --password=root \
  --routines --triggers --events --single-transaction --no-tablespaces \
  nest_db > nest_db_dump_complete.sql

echo "✅ Dump completado: nest_db_dump_complete.sql"
ls -lh nest_db_dump_complete.sql
```

---

## 📋 Opción 4: Restaurar un Dump

```bash
# Navegar a la raíz del proyecto
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# Restaurar desde archivo SQL
docker-compose -f tms-backend/docker-compose.yml exec -T mysql mysql \
  -h localhost -u root -proot nest_db < nest_db_dump_complete.sql

echo "✅ Base de datos restaurada"
```

---

## ⚠️ IMPORTANTE: UBICACIÓN CORRECTA

**SIEMPRE ejecutar desde la raíz del proyecto:**
```
/media/Datos/Projects/WebstormProjects/TrialManagementSystem
```

**NO desde:**
```
/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend ❌
```

**Por qué**: El docker-compose.yml usa rutas relativas. Si ejecutas desde `/tms-backend`, las rutas se duplican.

---

## 🔍 Verificar que el Dump se Creó Correctamente

```bash
# Ver el tamaño del archivo
ls -lh nest_db_dump_*.sql

# Ver las primeras líneas
head -20 nest_db_dump_*.sql

# Contar el número de líneas
wc -l nest_db_dump_*.sql

# Buscar tablas en el dump
grep "CREATE TABLE" nest_db_dump_*.sql | wc -l
```

---

## 📊 Qué Incluye el Dump

✅ Estructura completa de todas las tablas  
✅ Datos de todas las tablas  
✅ Índices y constraints  
✅ Procedimientos almacenados (routines)  
✅ Triggers  
✅ Eventos  
✅ Vistas  
✅ Sin información de espacio de tablespace  

---

## 💾 Opciones de mysqldump Utilizadas

| Opción | Descripción |
|--------|-------------|
| `--host` | Host del servidor MySQL |
| `--user` | Usuario de la base de datos |
| `--password` | Contraseña del usuario |
| `--routines` | Incluir procedimientos almacenados |
| `--triggers` | Incluir triggers |
| `--events` | Incluir eventos programados |
| `--single-transaction` | Lectura consistente sin bloqueos |
| `--no-tablespaces` | Omitir información de tablespaces |

---

## 🚀 Script Automático (Ejecutar cada vez)

```bash
#!/bin/bash
# guardar como backup_db.sh en /media/Datos/Projects/WebstormProjects/TrialManagementSystem

cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DUMP_FILE="nest_db_dump_${TIMESTAMP}.sql"

echo "📦 Generando dump de base de datos..."

docker-compose -f tms-backend/docker-compose.yml exec mysql \
  mysqldump --host=localhost --user=root --password=root \
  --routines --triggers --events --single-transaction --no-tablespaces \
  nest_db > "$DUMP_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Dump completado: $DUMP_FILE"
  echo "📊 Tamaño: $(ls -lh $DUMP_FILE | awk '{print $5}')"
else
  echo "❌ Error al generar dump"
  exit 1
fi
```

Guardar como `/media/Datos/Projects/WebstormProjects/TrialManagementSystem/backup_db.sh` y luego:

```bash
chmod +x backup_db.sh
./backup_db.sh
```

---

## 🔗 Referencias

- MySQL Documentation: https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html
- Docker Compose Exec: https://docs.docker.com/compose/reference/exec/


