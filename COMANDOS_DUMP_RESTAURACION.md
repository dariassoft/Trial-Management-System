# Comandos para Dump y Restauración de Base de Datos

## 📦 Crear un Dump Completo de la BD

### Opción 1: Comando directo (Recomendado - desde la carpeta del proyecto)
```bash
docker-compose exec -T mysql mysqldump -u myuser -pmypassword nest_db > nest_db_dump.sql
```

### Opción 2: Crear dump comprimido (ahorra espacio)
```bash
docker-compose exec -T mysql mysqldump -u myuser -pmypassword nest_db | gzip > nest_db_dump.sql.gz
```

### Opción 3: Dump con información adicional
```bash
docker-compose exec -T mysql mysqldump -u myuser -pmypassword --single-transaction --lock-tables=false nest_db > nest_db_dump.sql
```

---

## 🔄 Restaurar la Base de Datos desde un Dump

### Opción 1: Restaurar desde SQL
```bash
docker-compose exec -T mysql mysql -u myuser -pmypassword nest_db < nest_db_dump.sql
```

### Opción 2: Restaurar desde SQL comprimido
```bash
gunzip < nest_db_dump.sql.gz | docker-compose exec -T mysql mysql -u myuser -pmypassword nest_db
```

### Opción 3: Restaurar línea por línea (más lento pero más visible)
```bash
docker-compose exec -T mysql mysql -u myuser -pmypassword nest_db < nest_db_dump.sql
```

---

## 🛠️ Comandos Útiles Adicionales

### Ver estado de la BD desde Docker
```bash
docker-compose exec mysql mysql -u myuser -pmypassword -e "SELECT DATABASE(); SHOW TABLES;"
```

### Hacer un dump solo de estructura (sin datos)
```bash
docker-compose exec -T mysql mysqldump -u myuser -pmypassword --no-data nest_db > nest_db_estructura.sql
```

### Hacer un dump solo de datos (sin estructura)
```bash
docker-compose exec -T mysql mysqldump -u myuser -pmypassword --no-create-info nest_db > nest_db_datos.sql
```

### Entrar a la consola MySQL
```bash
docker-compose exec mysql mysql -u myuser -pmypassword nest_db
```

### Ver tablas en la BD
```bash
docker-compose exec mysql mysql -u myuser -pmypassword -e "USE nest_db; SHOW TABLES;"
```

### Ver estadísticas de tablas
```bash
docker-compose exec mysql mysql -u myuser -pmypassword -e "USE nest_db; SHOW TABLE STATUS\G"
```

---

## 📝 Notas Importantes

- **Flags utilizados:**
  - `-T`: Desactiva el pseudo-TTY (necesario para redirección)
  - `-u`: Usuario de base de datos
  - `-p`: Contraseña (sin espacio entre -p y la contraseña)
  - `--single-transaction`: Evita bloqueos durante el dump
  - `--lock-tables=false`: No bloquea tablas durante el backup
  - `--no-data`: Solo estructura
  - `--no-create-info`: Solo datos

- **Credenciales actuales:**
  - Usuario: `myuser`
  - Contraseña: `mypassword`
  - Base de datos: `nest_db`
  - Host: `mysql` (dentro de Docker)

---

## 💾 Archivos disponibles

- `nest_db_dump.sql` - Dump completo generado el 2026-02-05
  - Tamaño: ~45KB
  - Líneas: 818
