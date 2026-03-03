#!/bin/bash

# Script para compilar y ejecutar el backend en el contenedor Docker
# Ejecutar dentro del contenedor del backend

echo "🔨 Compilando backend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en la compilación"
    exit 1
fi

echo "✅ Compilación exitosa"
echo ""
echo "🚀 Iniciando servidor..."
npm start

