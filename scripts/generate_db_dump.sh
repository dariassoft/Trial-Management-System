#!/bin/bash
# Script para generar dump de base de datos nest_db
# Ejecutar desde el host local - se conecta al contenedor MySQL via localhost:3306

# Configuración
DB_NAME="nest_db"
DB_USER="myuser"
DB_PASSWORD="mypassword"
DB_PORT="3306"
OUTPUT_FILE="nest_db_dump_$(date +%Y%m%d_%H%M%S).sql"

# Determinar el host según el entorno
if [ -n "$DOCKERIZED" ]; then
  # Si está dentro del contenedor Docker
  DB_HOST="mysql"
else
  # Si se ejecuta desde el host local
  # Usar 127.0.0.1 en lugar de localhost para forzar conexión TCP
  # localhost intenta usar socket Unix (/var/run/mysqld/mysqld.sock)
  DB_HOST="127.0.0.1"
fi

echo "Generando dump de base de datos: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "Archivo de salida: $OUTPUT_FILE"

# Comando para generar dump
mysqldump \
  --host=$DB_HOST \
  --port=$DB_PORT \
  --user=$DB_USER \
  --password=$DB_PASSWORD \
  --routines \
  --triggers \
  --events \
  --single-transaction \
  --no-tablespaces \
  $DB_NAME > $OUTPUT_FILE

if [ $? -eq 0 ]; then
  echo "✅ Dump completado exitosamente: $OUTPUT_FILE"
  echo "Tamaño: $(ls -lh $OUTPUT_FILE | awk '{print $5}')"
else
  echo "❌ Error al generar dump"
  exit 1
fi

