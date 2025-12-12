# File: `tms-client-vue/Dockerfile`
FROM node:20-alpine
WORKDIR /app

# herramienta ligera para ejecutar como otro usuario
RUN apk add --no-cache su-exec

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# asegurar que Nuxt use siempre el puerto 3001 dentro del contenedor
ENV PORT=3001
EXPOSE 3001

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
