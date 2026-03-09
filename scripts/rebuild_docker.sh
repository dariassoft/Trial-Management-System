#!/bin/bash

# Script para limpiar y reconstruir Docker con la nueva configuración
# Uso: ./scripts/rebuild_docker.sh

set -e

echo "================================================"
echo "🐳 Rebuild Docker con Configuración de Permisos"
echo "================================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}[1/5]${NC} Deteniendo contenedores..."
docker-compose down
echo -e "${GREEN}✓ Contenedores detenidos${NC}"
echo ""

echo -e "${BLUE}[2/5]${NC} Removiendo volúmenes Docker (permisos antiguos)..."
docker-compose down -v
echo -e "${GREEN}✓ Volúmenes removidos${NC}"
echo ""

echo -e "${BLUE}[3/5]${NC} Removiendo imágenes Docker antiguas..."
docker-compose down --rmi all || true
echo -e "${GREEN}✓ Imágenes removidas${NC}"
echo ""

echo -e "${BLUE}[4/5]${NC} Reconstruyendo imágenes y contenedores..."
docker-compose up --build -d
echo -e "${GREEN}✓ Imágenes construidas y contenedores iniciados${NC}"
echo ""

echo -e "${BLUE}[5/5]${NC} Verificando permisos en el contenedor..."
echo ""

# Esperar a que el contenedor esté listo
sleep 5

echo -e "${YELLOW}Usuario ejecutando en contenedor:${NC}"
docker-compose exec -T client-vue whoami
echo ""

echo -e "${YELLOW}Permisos de /app/.nuxt/:${NC}"
docker-compose exec -T client-vue ls -la /app/.nuxt/ 2>/dev/null | head -5 || echo "⚠️  .nuxt aún no generado (normal en primer build)"
echo ""

echo -e "${YELLOW}Permisos de /app/node_modules/:${NC}"
docker-compose exec -T client-vue ls -la /app/node_modules/ 2>/dev/null | head -3
echo ""

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✓ Rebuild completado exitosamente!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "Próximos pasos:"
echo "  1. Ejecutar: npm run build"
echo "  2. Verificar logs: docker-compose logs client-vue"
echo "  3. Probar en navegador: http://localhost:3001"
echo ""

