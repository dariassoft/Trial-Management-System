#!/bin/bash

# Script para hacer dump y restauración de la BD nest_db en Docker
# Ubicación: /scripts/backup_restore_db.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
DB_USER="myuser"
DB_PASSWORD="mypassword"
DB_NAME="nest_db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql"

# Crear directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

show_usage() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║        Base de Datos - Dump y Restauración                 ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Uso: $0 [comando] [opciones]"
    echo ""
    echo "Comandos:"
    echo -e "  ${GREEN}backup${NC}           Crear un backup de la BD"
    echo -e "  ${GREEN}backup-gz${NC}        Crear un backup comprimido (.gz)"
    echo -e "  ${GREEN}restore${NC} <archivo> Restaurar un backup"
    echo -e "  ${GREEN}status${NC}           Ver estado de la BD"
    echo -e "  ${GREEN}tables${NC}           Listar todas las tablas"
    echo ""
    echo "Ejemplos:"
    echo "  $0 backup"
    echo "  $0 backup-gz"
    echo "  $0 restore ./backups/nest_db_20260205_142500.sql"
    echo "  $0 status"
    echo "  $0 tables"
    echo ""
}

backup_db() {
    echo -e "${BLUE}📦 Iniciando backup de la BD...${NC}"

    if docker-compose exec -T mysql mysqldump -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE"; then
        local size=$(du -h "$BACKUP_FILE" | cut -f1)
        local lines=$(wc -l < "$BACKUP_FILE")
        echo -e "${GREEN}✓ Backup completado exitosamente${NC}"
        echo -e "${GREEN}  Archivo: $BACKUP_FILE${NC}"
        echo -e "${GREEN}  Tamaño: $size${NC}"
        echo -e "${GREEN}  Líneas: $lines${NC}"
    else
        echo -e "${RED}✗ Error al hacer el backup${NC}"
        exit 1
    fi
}

backup_db_gz() {
    echo -e "${BLUE}📦 Iniciando backup comprimido de la BD...${NC}"
    local backup_file_gz="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

    if docker-compose exec -T mysql mysqldump -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" | gzip > "$backup_file_gz"; then
        local size=$(du -h "$backup_file_gz" | cut -f1)
        echo -e "${GREEN}✓ Backup comprimido completado exitosamente${NC}"
        echo -e "${GREEN}  Archivo: $backup_file_gz${NC}"
        echo -e "${GREEN}  Tamaño: $size${NC}"
    else
        echo -e "${RED}✗ Error al hacer el backup comprimido${NC}"
        exit 1
    fi
}

restore_db() {
    local backup_file="$1"

    if [ -z "$backup_file" ]; then
        echo -e "${RED}✗ Debe especificar el archivo de backup${NC}"
        show_usage
        exit 1
    fi

    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}✗ Archivo no encontrado: $backup_file${NC}"
        exit 1
    fi

    echo -e "${YELLOW}⚠️  ADVERTENCIA: Se va a restaurar la BD desde: $backup_file${NC}"
    echo -e "${YELLOW}Esta acción sobrescribirá los datos actuales.${NC}"
    read -p "¿Está seguro? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}Operación cancelada${NC}"
        exit 0
    fi

    echo -e "${BLUE}🔄 Restaurando base de datos...${NC}"

    if cat "$backup_file" | docker-compose exec -T mysql mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME"; then
        echo -e "${GREEN}✓ Restauración completada exitosamente${NC}"
    else
        echo -e "${RED}✗ Error al restaurar la base de datos${NC}"
        exit 1
    fi
}

show_status() {
    echo -e "${BLUE}📊 Estado de la BD:${NC}"
    docker-compose exec mysql mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 'Base de datos:' AS info, DATABASE() AS valor; SELECT COUNT(*) AS 'Número de tablas' FROM information_schema.TABLES WHERE TABLE_SCHEMA = '$DB_NAME';"
}

list_tables() {
    echo -e "${BLUE}📋 Tablas en la BD $DB_NAME:${NC}"
    docker-compose exec mysql mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME; SHOW TABLES;"
}

# Main
case "${1:-}" in
    backup)
        backup_db
        ;;
    backup-gz)
        backup_db_gz
        ;;
    restore)
        restore_db "$2"
        ;;
    status)
        show_status
        ;;
    tables)
        list_tables
        ;;
    *)
        show_usage
        exit 1
        ;;
esac
