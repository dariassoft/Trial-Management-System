# Dokploy production deployment

## Repository root

The repository used by Dokploy must have the backend files at its root:

```text
docker-compose.prod.yml
Dockerfile.prod
package.json
tms-client-vue/Dockerfile.prod
```

In this local workspace that directory is `tms-backend/`. If the repository was
created by pushing from `tms-backend/`, configure Dokploy with that repository
root and use `docker-compose.prod.yml` as the Compose file.

## Required Dokploy variables

Add these variables in the application's **Environment** section. Dokploy
writes them to the `.env` file used to interpolate `docker-compose.prod.yml`.

| Variable | Used by | Required value |
|---|---|---|
| `DB_USER` | `app`, `mysql` | Production MySQL user |
| `DB_PASSWORD` | `app`, `mysql` | Production MySQL password |
| `DB_NAME` | `app`, `mysql` | Database name, for example `nest_db` |
| `MYSQL_ROOT_PASSWORD` | `mysql` | MySQL root password |
| `JWT_SECRET` | `app` | Long random signing secret |
| `JWT_EXPIRATION_TIME` | `app` | Optional; defaults to `1d` |
| `FRONTEND_URLS` | `app` | Frontend origin, for example `https://agronomic-tms.dariassoft.com.ar` |
| `NUXT_PUBLIC_API_BASE` | frontend build | Public API URL ending in `/api/v1` |

`DB_HOST`, `DB_PORT`, `NODE_ENV`, `DOCKERIZED`, `HOST`, `PORT`, and
`NITRO_PORT` are defined directly in `docker-compose.prod.yml` or the
production Dockerfile and do not need to be added in Dokploy.

## Domains and internal ports

Configure Dokploy's domains/reverse proxy as follows:

- Frontend: service `client-vue`, container port `3000`.
- API: service `app`, container port `3000`.

The API URL used in `NUXT_PUBLIC_API_BASE` must point to the public API domain,
not to the internal Compose service name `app`.

Never commit a real `.env` or production secret. `.env.prod.example` is only a
versioned list of the required variable names and safe placeholders.