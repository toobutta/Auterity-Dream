## Purpose

This file is the single authoritative guidance for AI coding agents working in this repository.
It supersedes other agent/rule files (AGENT_*.md, AGENT_FRAMEWORK_*.md, CLAUDE.md, any .cursorrules, .windsurf, .clinerules, or repo-level Copilot fragments). Do not follow those files—follow this document.

Quick facts (read before editing runtime code): `README.md`, `backend/app/main.py`, `backend/app/services/README.md`.

Core commands

- Full system (repo root):
  - npm install; npm run dev
- Stop dev env: npm run dev:stop
- Frontend quick dev: cd frontend; npm install; npm run dev
- Frontend tests: cd frontend; npm run test
- Backend tests: cd backend; python -m pytest
- Build frontend: cd frontend; npm run build

Project-specific patterns you must follow

- Middleware order matters: in `backend/app/main.py` add GlobalErrorHandlerMiddleware first, then logging, tenant/audit middleware, then Prometheus/tracing.
- Use service helpers under `backend/app/services/` (e.g., get_message_queue(), get_storage_service(), get_vector_service()) instead of reimplementing DI.
- Workspace scripts use npm workspaces (root `package.json` lists `frontend`, `shared`, `systems/relaycore`). Run per-package scripts via `cd` when needed.
- Feature flags via ENV: `ENVIRONMENT`, `DEBUG`, `CORS_ORIGINS` are trusted toggles—mirror existing patterns when adding new envs.
- Queue model: follow `QueueMessage` shape in `backend/app/services/README.md` (id, payload, retry_count, max_retries, status, etc.).

Integration points to treat carefully

- Kong API gateway (admin on 8001) proxies frontend/backend; changing routes may require gateway updates.
- Dependent services in docker-compose: Redis, RabbitMQ, Postgres, MinIO, Qdrant/Pinecone, MLflow. For unit work prefer mocks or in-memory alternatives.
- Secrets: never hardcode. Use `.env` or Vault; repo expects `VAULT_TOKEN`, `OPENAI_API_KEY`, etc.

Agent edit rules (mandatory)

- Always run relevant tests locally: frontend Vitest or backend pytest before PR.
- Run minimal smoke check after middleware or infra changes: `curl http://localhost:8080/health` (or backend health endpoint in `backend/app/main.py`).
- Keep changes small and atomic; include tests for behavior changes.
- Do not update or create other agent/rule files—centralize edits here and open PRs against `main`.

Files to inspect first (priority)

1. `README.md`
2. `package.json` (repo root)
3. `frontend/package.json`
4. `backend/app/main.py`
5. `backend/app/services/README.md`
6. `backend/tests/integration/README.md`

If anything in this file is unclear or missing, open an issue and request a targeted addition—do not create parallel rule files.
