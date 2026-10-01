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
| `DB_TYPE` | `app` | `mysql` |
| `DB_USER` | `app`, `mysql` | Production MySQL user |
| `DB_PASSWORD` | `app`, `mysql` | Production MySQL password |
| `DB_NAME` | `app`, `mysql` | Database name, for example `nest_db` |
| `MYSQL_ROOT_PASSWORD` | `mysql` | MySQL root password |
| `MYSQL_DATABASE` | `mysql` | Same database name as `DB_NAME` |
| `MYSQL_USER` | `mysql` | Same user name as `DB_USER` |
| `MYSQL_PASSWORD` | `mysql` | Same password as `DB_PASSWORD` |
| `JWT_SECRET` | `app` | Long random signing secret |
| `JWT_EXPIRATION_TIME` | `app` | Expiration in seconds |
| `FRONTEND_URLS` | `app` | Frontend origin, for example `https://tms2.dariassoft.com.ar` |
| `NUXT_PUBLIC_API_BASE` | frontend build | Public API URL ending in `/api/v1` |
| `DB_HOST` | `app` | `mysql` |
| `DB_PORT` | `app` | `3306` |
| `NODE_ENV` | `app`, frontend | `production` |
| `DOCKERIZED` | `app` | `true` |
| `HOST` | frontend | `0.0.0.0` |
| `PORT` | frontend | `3000` |
| `NITRO_PORT` | frontend | `3000` |

All variables above are present with concrete values in `.env.prod.example`.
Copy those values into Dokploy's Environment section. The `MYSQL_*` values
must remain consistent with their corresponding `DB_*` values.

## Database initialization

The production backend waits for MySQL before starting Nest. Its startup script
imports `2026-09-30.nest_db.dump.sql` whenever the `Laboratorio` table is absent,
including an already-existing Dokploy volume. If the table exists, the dump is
not imported again. The Compose application contains exactly three services:
`app`, `client-vue`, and `mysql`.

If the logs show an import error, inspect the `app` container logs. The dump
contains `DROP TABLE` statements, so an import replaces the current database:

1. Back up any data that must be preserved.
2. Restore the database using the startup script or import the dump manually.
3. Redeploy the Compose application and confirm that `app` starts without
   migration errors.

Do not perform this repair without a backup if the persistent volume contains
data that must be preserved. The dump contains the `Laboratorio` table and the
corresponding migration records, so a restored database will not attempt to add
that table's columns again.

## Domains and internal ports

Configure Dokploy's domains/reverse proxy as follows:

- Frontend: host `tms2.dariassoft.com.ar`, service `client-vue`, protocol `http`,
  internal path `/`, external path `/`, container port `3000`.
- API: host `api.tms2.dariassoft.com.ar`, service `app`, protocol `http`,
  internal path `/`, external path `/`, container port `3000`.

Do not configure the frontend domain to target `app`, `mysql`, port `80`, or the
Docker host. The frontend container is healthy on port `3000`; if the API
domain returns a Nest/Express response but the frontend domain returns `502`,
the frontend domain entry in Dokploy is pointing to the wrong service or port.

The API URL used in `NUXT_PUBLIC_API_BASE` must point to the public API domain,
not to the internal Compose service name `app`.

`.env.prod.example` contains a complete set of values that can be imported into
Dokploy. If the repository is public or has already been shared, rotate the
database passwords and `JWT_SECRET` before using them in production.