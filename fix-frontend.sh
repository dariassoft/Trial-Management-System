#!/bin/bash

# Script para reparar y reiniciar el frontend

echo "🔧 Deteniendo contenedor del frontend..."
docker stop tms-backend_client-vue_1 2>/dev/null || true

echo "🧹 Limpiando cachés y archivos temporales..."
docker exec tms-backend_client-vue_1 sh -c "
  rm -rf /app/.nuxt
  rm -rf /app/.output
  rm -rf /app/node_modules/.cache
  rm -rf /app/dist
" 2>/dev/null || true

echo "🚀 Reiniciando contenedor..."
docker start tms-backend_client-vue_1

echo "⏳ Esperando que el frontend inicie (30 segundos)..."
sleep 30

echo "📋 Verificando logs..."
docker logs tms-backend_client-vue_1 | tail -50

echo "✅ Frontend reiniciado. Accede a: http://localhost:3001/tipos-ensayo"

