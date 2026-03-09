#!/bin/bash

# Validar sintaxis básica de los archivos Vue

echo "🔍 Validando archivos Vue..."
echo ""

# Archivo 1: mediciones
echo "📄 Verificando: /pages/mediciones/[id]/index.vue"
file1="/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/pages/mediciones/[id]/index.vue"

# Contar tags de apertura
opening_divs=$(grep -o "<div" "$file1" | wc -l)
closing_divs=$(grep -o "</div>" "$file1" | wc -l)
opening_template=$(grep -o "<template" "$file1" | wc -l)
closing_template=$(grep -o "</template>" "$file1" | wc -l)
opening_script=$(grep -o "<script" "$file1" | wc -l)
closing_script=$(grep -o "</script>" "$file1" | wc -l)

echo "   <div>: $opening_divs (apertura), $closing_divs (cierre)"
echo "   <template>: $opening_template (apertura), $closing_template (cierre)"
echo "   <script>: $opening_script (apertura), $closing_script (cierre)"

if [ "$opening_divs" -eq "$closing_divs" ] && [ "$opening_template" -eq "$closing_template" ] && [ "$opening_script" -eq "$closing_script" ]; then
  echo "   ✅ Balance correcto"
else
  echo "   ❌ Balance incorrecto"
  exit 1
fi

echo ""

# Archivo 2: siembra
echo "📄 Verificando: /pages/siembra.vue"
file2="/media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue/pages/siembra.vue"

# Contar tags de apertura
opening_divs=$(grep -o "<div" "$file2" | wc -l)
closing_divs=$(grep -o "</div>" "$file2" | wc -l)
opening_template=$(grep -o "<template" "$file2" | wc -l)
closing_template=$(grep -o "</template>" "$file2" | wc -l)
opening_script=$(grep -o "<script" "$file2" | wc -l)
closing_script=$(grep -o "</script>" "$file2" | wc -l)

echo "   <div>: $opening_divs (apertura), $closing_divs (cierre)"
echo "   <template>: $opening_template (apertura), $closing_template (cierre)"
echo "   <script>: $opening_script (apertura), $closing_script (cierre)"

if [ "$opening_divs" -eq "$closing_divs" ] && [ "$opening_template" -eq "$closing_template" ] && [ "$opening_script" -eq "$closing_script" ]; then
  echo "   ✅ Balance correcto"
else
  echo "   ❌ Balance incorrecto"
  exit 1
fi

echo ""
echo "✅ Todos los archivos tienen balance correcto"

