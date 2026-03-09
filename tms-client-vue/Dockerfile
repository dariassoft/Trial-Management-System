# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Crear usuario no-root 'nuxt' con home directory
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001 && \
    mkdir -p /app && \
    chown -R nuxt:nodejs /app

# Copiar node_modules del builder
COPY --from=builder --chown=nuxt:nodejs /app/node_modules ./node_modules

# Copiar .nuxt del builder
COPY --from=builder --chown=nuxt:nodejs /app/.nuxt ./.nuxt

# Copiar archivos necesarios
COPY --chown=nuxt:nodejs . .

# Cambiar a usuario no-root
USER nuxt

# Exponer puerto
EXPOSE 3001

# Comando para ejecutar
CMD ["node", "server.mjs"]

