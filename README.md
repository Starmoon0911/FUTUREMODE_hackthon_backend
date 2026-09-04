# Futuremode backend

Express 5 + TypeScript API using a server-only Supabase client. The liveness endpoint is available at `GET /health` (and `/api/health`) and needs no authentication.

## Local development

1. Use Node.js 22+ and enable Corepack: `corepack enable`.
2. Copy `.env.example` to `.env`, then set values from Supabase Dashboard **Project Settings → API**.
3. Install and run:

   ```bash
   pnpm install
   pnpm dev
   ```

The service runs at `http://localhost:3001` by default. Run quality checks with `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.

## Supabase security

`SUPABASE_SERVICE_ROLE_KEY` is intentionally server-only and bypasses Row Level Security. Do not use it in frontend code, publish it in `NEXT_PUBLIC_*`, or return it from API responses. For endpoints acting on behalf of users, validate their access token first and enforce authorization in the API and appropriate Supabase RLS policies.

## Docker

Create `.env`, then run:

```bash
docker compose up --build
```

The image uses a multi-stage build, production-only dependencies, a non-root user, and a `/health` Docker health check.

## CI/CD

`ci.yml` runs dependency installation, linting, type checking, tests, TypeScript build, and Docker build for pull requests and pushes to `main`.

`cd.yml` publishes immutable (`sha-<commit>`) and `latest` images to GitHub Container Registry on pushes to `main`. To activate the deployment job, set the repository variable `DEPLOY_ENABLED` to `true` after these repository/environment secrets are supplied:

| Secret | Purpose |
| --- | --- |
| `DEPLOY_HOST` | Production server hostname or IP |
| `DEPLOY_USER` | SSH account running Docker Compose |
| `DEPLOY_SSH_KEY` | Private key for that SSH account |
| `DEPLOY_PORT` | SSH port; defaults to `22` |
| `DEPLOY_PATH` | Directory on the server containing `compose.production.yaml` and a production `.env` |
| `GHCR_PULL_TOKEN` | Fine-grained token with read access to this package |

Before enabling deployment, copy `compose.production.yaml` to `DEPLOY_PATH` and create its `.env` there with production `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CORS_ORIGIN`, and `PORT`. Keep that `.env` on the server only.
