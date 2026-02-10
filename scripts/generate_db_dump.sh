#!/bin/bash
# Script para generar dump de base de datos nest_db
# Ejecutar dentro del contenedor MySQL o desde el host si Docker está disponible

# Configuración
DB_NAME="nest_db"
DB_USER="root"
DB_PASSWORD="root"
DB_HOST="mysql"
OUTPUT_FILE="nest_db_dump_$(date +%Y%m%d_%H%M%S).sql"

echo "Generando dump de base de datos: $DB_NAME"
echo "Archivo de salida: $OUTPUT_FILE"

# Comando para generar dump
mysqldump \
  --host=$DB_HOST \
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

