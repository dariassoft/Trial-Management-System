```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtener certificados
sudo certbot certonly --nginx -d app.example.com -d api.example.com

# Auto-renovación
sudo certbot renew --dry-run

# Habilitar auto-renewal con cron
sudo systemctl enable certbot.timer
```

---

## 7. Monitoreo y Logging

### PM2 Monitoring

```bash
# Iniciar PM2 plus
pm2 plus

# Monitoreo local
pm2 monit

# Logs
pm2 logs
pm2 logs tms-backend
pm2 logs tms-frontend
```

### Nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log

# Analizar logs
netstat -an | grep :443
netstat -an | grep :3000
```

### Base de Datos

```sql
-- Ver conexiones
SHOW PROCESSLIST;

-- Ver tamaño
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) MB
FROM information_schema.TABLES
WHERE table_schema = 'tms_db'
ORDER BY MB DESC;

-- Backup
mysqldump -h mysql.example.com -u tms_user -p tms_db > backup_$(date +%Y%m%d).sql
```

---

## 8. Backup y Recuperación

### Backup Automático

```bash
#!/bin/bash
# backup-tms.sh

BACKUP_DIR="/var/backups/tms"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="tms_db"
DB_USER="tms_user"
DB_PASSWORD="your_password"

# Crear directorio
mkdir -p $BACKUP_DIR

# Backup base de datos
mysqldump -h mysql.example.com -u $DB_USER -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup de uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/uploads/tms/

# Mantener solo últimos 7 días
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +7 -delete

# Log
echo "Backup completado: $DATE" >> $BACKUP_DIR/backup.log
```

Agregar a crontab:
```bash
0 2 * * * /opt/scripts/backup-tms.sh
```

---

## 9. Checklist de Despliegue

### Pre-Deploy
- [ ] Backend .env configurado correctamente
- [ ] Frontend .env con URL correcta
- [ ] Base de datos creada e inicializada
- [ ] Certificados SSL listos
- [ ] Backups configurados
- [ ] Nginx configurado y testeado

### Deploy
- [ ] Backend build sin errores
- [ ] Frontend build sin errores
- [ ] PM2 iniciados correctamente
- [ ] Nginx reiniciado
- [ ] Servicios arrancando correctamente

### Post-Deploy
- [ ] Login funciona
- [ ] API responde
- [ ] CORS sin errores
- [ ] Swagger disponible
- [ ] Uploads funcionan
- [ ] HTTPS activo
- [ ] Monitoreo configurado

---

## 10. Troubleshooting

### Backend no responde

```bash
# Verificar proceso
pm2 logs tms-backend

# Verificar puerto
netstat -an | grep 3000

# Verificar conexión DB
mysql -h mysql.example.com -u tms_user -p tms_db -e "SELECT 1"

# Reiniciar
pm2 restart tms-backend
```

### CORS error

Ver: `/docs/CORS_CONFIGURATION.md`

### Base de datos lenta

```sql
-- Analizar tablas
ANALYZE TABLE ensayo;
OPTIMIZE TABLE ensayo;

-- Verificar índices
SHOW INDEX FROM ensayo;
```

### Memoria alta

```bash
# Ver consumo
pm2 monit

# Aumentar limite
pm2 start dist/main.js --node-args="--max-old-space-size=2048"
```

---

## 11. Escalabilidad Futura

### Load Balancing
```nginx
upstream tms_backend {
    server backend1.example.com:3000;
    server backend2.example.com:3000;
    server backend3.example.com:3000;
}

server {
    location /api/v1/ {
        proxy_pass http://tms_backend;
    }
}
```

### Cache con Redis
```typescript
// Backend: agregar Redis
npm install redis @nestjs/cache-manager cache-manager-redis

// Cachear responses
@Get('/ensayos')
@CacheKey('ensayos')
@CacheTTL(300)
async findAll() { ... }
```

### CDN para Uploads
- Usar S3/CloudFront en lugar de servidor local
- Reemplazar `/uploads` con URL de CDN

---

**Última actualización**: 2024-11-26
# Guía de Despliegue - TMS Frontend & Backend

Documentación completa para desplegar TMS en producción.

## 1. Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│                   Cliente (Vue/Nuxt)                │
│         TMS Frontend - SPA (tms-client-vue)         │
│  - Corriendo en: https://app.example.com:3001      │
│  - Build estático o Node.js                        │
└─────────────────┬──────────────────────────────────┘
                  │ HTTP/HTTPS
                  │ JWT en Authorization header
┌─────────────────▼──────────────────────────────────┐
│              Backend API (NestJS)                   │
│      TMS Backend - (tms-backend)                   │
│  - Corriendo en: https://api.example.com:3000     │
│  - Endpoints en: /api/v1/*                        │
│  - Base de datos: MySQL                           │
└─────────────────┬──────────────────────────────────┘
                  │ TCP
┌─────────────────▼──────────────────────────────────┐
│              Base de Datos                          │
│         MySQL (nest_db)                            │
└──────────────────────────────────────────────────────┘
```

---

## 2. Requisitos de Producción

### Hardware Mínimo
- **Frontend**: 512 MB RAM (Node.js) o estático
- **Backend**: 1 GB RAM, 1 CPU
- **Base de Datos**: 2 GB RAM, SSD recomendado
- **Total**: 2-4 GB RAM mínimo

### Software
- Node.js 18+
- MySQL 8+
- Nginx o Apache (reverse proxy)
- SSL/TLS Certificate (Let's Encrypt)
- Git (para deployments)

---

## 3. Despliegue del Backend

### 3.1 Preparación

```bash
# Clonar repositorio
git clone <repo-url> tms-backend
cd tms-backend

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env.production
```

### 3.2 Configuración (.env.production)

```env
# Base de Datos
DB_HOST=mysql.example.com
DB_PORT=3306
DB_USER=tms_user
DB_PASSWORD=STRONG_PASSWORD_HERE
DB_NAME=tms_db

# JWT
JWT_SECRET=GENERATE_STRONG_SECRET_HERE
JWT_EXPIRATION=3600

# API
API_PORT=3000
NODE_ENV=production

# CORS
FRONTEND_URL=https://app.example.com
FRONTEND_URLS=https://app.example.com,https://www.app.example.com

# Uploads
UPLOADS_DIR=/var/uploads/tms

# Logging
LOG_LEVEL=info
```

### 3.3 Build y Deploy

```bash
# Build
npm run build

# Crear carpeta de uploads
mkdir -p /var/uploads/tms
chown -R node:node /var/uploads/tms

# Iniciar con PM2
npm install -g pm2
pm2 start dist/main.js --name "tms-backend" --env production
pm2 save
```

### 3.4 Inicializar Base de Datos

```bash
# Conectar a MySQL
mysql -h mysql.example.com -u root -p

# Crear base de datos
CREATE DATABASE tms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tms_user'@'%' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON tms_db.* TO 'tms_user'@'%';
FLUSH PRIVILEGES;

# Salir
exit

# Ejecutar migraciones/seed
mysql -h mysql.example.com -u tms_user -p tms_db < docs/database.sql
mysql -h mysql.example.com -u tms_user -p tms_db < docs/auth_seed.sql

# Hashear contraseña del usuario seed
curl -X POST https://api.example.com/api/v1/auth/bootstrap-hash \
  -H "Content-Type: application/json" \
  -d '{"username":"dariassoft@gmail.com"}'
```

---

## 4. Despliegue del Frontend

### 4.1 Preparación

```bash
# Clonar
git clone <repo-url> tms-client-vue
cd tms-client-vue

# Instalar
npm install

# Copiar .env
cp .env.production .env
```

### 4.2 Configuración (.env)

```env
# API
NUXT_PUBLIC_API_BASE=https://api.example.com/api/v1
```

### 4.3 Build Estático (Recomendado)

```bash
# Build
npm run build

# Salida en: .output/public/
# Subir esta carpeta a CDN o servidor web estático
```

### 4.4 Build con Node.js

```bash
# Build
npm run build

# Iniciar con PM2
pm2 start "npm run preview" --name "tms-frontend" --env production
pm2 save
```

### 4.5 Servir con Nginx

```nginx
# /etc/nginx/sites-available/tms-frontend.conf

server {
    listen 443 ssl http2;
    server_name app.example.com;

    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache headers para assets estáticos
    location /_nuxt/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3001;
    }

    # SPA routing
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Para SPA: servir index.html para rutas no encontradas
        error_page 404 =200 /index.html;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name app.example.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 5. Configuración de Nginx para Backend

```nginx
# /etc/nginx/sites-available/tms-backend.conf

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    limit_req zone=api burst=200 nodelay;

    location /api/v1/ {
        limit_req zone=api burst=200 nodelay;
        
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (si es necesario)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Swagger docs
    location /docs/ {
        proxy_pass http://localhost:3000/docs/;
        proxy_set_header Host $host;
    }

    # Uploads
    location /uploads/ {
        alias /var/uploads/tms/;
        expires 7d;
        add_header Cache-Control "public";
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.example.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 6. Certificados SSL

### Con Let's Encrypt (Certbot)


