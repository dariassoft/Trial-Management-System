#!/bin/sh
set -e

# asegurar existencia y permisos del volumen node_modules
mkdir -p /app/node_modules

# No tocar todo el código del host; solo node_modules y caches generados
chown -R node:node /app/node_modules 2>/dev/null || true
chown -R node:node /app/.nuxt /app/.output 2>/dev/null || true

# decidir si instalar dependencias:
# instalar si node_modules está vacío o si package-lock.json es más nuevo que node_modules
NEEDS_INSTALL=0
if [ ! -d /app/node_modules ] || [ -z "$(ls -A /app/node_modules 2>/dev/null)" ]; then
  NEEDS_INSTALL=1
elif [ -f /app/package-lock.json ] && [ /app/package-lock.json -nt /app/node_modules ]; then
  NEEDS_INSTALL=1
elif [ -f /app/package.json ] && [ /app/package.json -nt /app/node_modules ]; then
  NEEDS_INSTALL=1
fi

if [ "$NEEDS_INSTALL" -eq 1 ]; then
  echo "Instalando dependencias dentro del contenedor como usuario 'node'..."
  # usar npm install (no npm ci) para permitir actualizar package-lock.json
  su-exec node npm install --prefer-offline --no-audit --no-fund
  # asegurar permisos por si acaso
  chown -R node:node /app/node_modules 2>/dev/null || true
fi

# ejecutar npm run dev directamente como usuario node (ignorar CMD del compose)
echo "Iniciando npm run dev..."
exec su-exec node npm run dev -- --host 0.0.0.0 --port 3001
