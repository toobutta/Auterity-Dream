# Auterity Architecture Narrative

Auterity unifies Workflow Studio, RelayCore, NeuroWeaver, and the bundled Auterity IDE into a single automation mesh. The
architecture below describes how each capability collaborates from commit to runtime.

## Platform Topology

```
┌───────────────────────────┐        ┌──────────────────────────┐
│  Auterity IDE Bundle      │        │  GitHub Enterprise       │
│  (VS Code + GitHub Apps)  │        │  Remote Repos            │
└─────────────┬─────────────┘        └─────────────┬────────────┘
              │ DevContainers & Codespaces         │ Pull Requests
              │                                     │
┌─────────────▼─────────────┐        ┌─────────────▼────────────┐
│ Workflow Studio (UI/API)  │◄──────►│ RelayCore AI Router      │
│ - React frontend          │        │ - Cost-aware routing     │
│ - services/api (FastAPI)  │        │ - Multi-provider orches. │
└─────────────┬─────────────┘        └─────────────┬────────────┘
              │ Workflow Events                      │ Model Triggers
              │                                      │
              ▼                                      ▼
        ┌─────────────┐                      ┌───────────────────┐
        │ Data Fabric │◄────────────────────►│ NeuroWeaver       │
        │ - PostgreSQL│    Feature vectors    │ - Model registry  │
        │ - Redis     │    + Feedback loops   │ - Training jobs   │
        │ - MinIO     │                      │ - Evaluation      │
        └─────────────┘                      └───────────────────┘
```

## Ownership Snapshot

| Capability | Owner | Maturity |
| --- | --- | --- |
| Workflow Studio (UI + services/api) | Workflow Experience Crew | Production |
| RelayCore Routing Mesh | Applied AI Guild | Production |
| NeuroWeaver Model Platform | Insight Systems Team | Production |
| Auterity IDE Bundle | Developer Productivity | Beta |

## Workflow Studio

Workflow Studio couples the React frontend (`frontend/`) with the FastAPI service at `services/api`. Studio collects workflow
definitions, persists execution state, and emits events that RelayCore consumes. Key threads:

- **Execution Lifecycle:** `/app/services/workflow_engine.py` orchestrates steps, defers AI routing to RelayCore via
  `/app/services/relaycore_client.py`, and persists results to PostgreSQL and MinIO.
- **Template Delivery:** `/app/api/templates.py` exposes curated accelerators while the frontend uses
  `frontend/src/components/workflow` modules for editing and simulation.
- **Observability:** `/app/monitoring` publishes OpenTelemetry spans; metrics surface in `monitoring/` dashboards.

## RelayCore

RelayCore (`systems/relaycore`) receives intents from Workflow Studio, picks the optimal LLM provider, and applies guardrails.
Highlights:

- **Router Services:** `systems/relaycore/src/services/relaycore-integration.ts` integrates back to Workflow Studio using the
  shared messaging fabric.
- **Cost Controls:** Policy files under `systems/relaycore/config` enforce model budgets, surfacing alerts to Auterity IDE status
  panels.
- **Edge Delivery:** RelayCore returns normalized responses to Studio and NeuroWeaver, allowing deterministic auditing.

## NeuroWeaver

NeuroWeaver (`systems/neuroweaver`) manages long-running model assets and evaluations.

- **Training Pipelines:** Python services in `systems/neuroweaver/backend/app/services` schedule fine-tuning jobs triggered by
  RelayCore signals.
- **Feedback Loops:** Frontend dashboards stream metrics into Workflow Studio, enabling curators to promote models into
  production routes.
- **Artifact Sync:** Vector embeddings and evaluation reports land in shared MinIO buckets for Studio re-use.

## Auterity IDE Bundle

The Auterity IDE delivers an integrated VS Code + GitHub experience.

- **Unified Canvas:** `frontend/src/components/ide/UnifiedIDE.tsx` presents Workflow Studio dashboards alongside repository
  insights and model telemetry.
- **Git Operations:** `frontend/src/components/ide/GitPanel.tsx` and `frontend/src/services/githubIntegration.ts` expose PR
  workflows, branch management, and relay build status.
- **Environment Parity:** `.devcontainer/devcontainer.json` provisions the same stack used in CI, while `.vscode/extensions.json`
  enforces linting and RelayCore tooling.

Developers authenticate through the IDE, clone repos via GitHub Apps, and launch Workflow Studio with pre-wired endpoints for
RelayCore and NeuroWeaver. The IDE is also the onboarding entry point documented in `docs/features/auterity-ide.md`.

## Data Fabric and Observability

- **Persistence:** PostgreSQL stores workflow metadata, Redis handles messaging and caching, and MinIO captures artifacts and
  NeuroWeaver model bundles.
- **Telemetry:** Prometheus, Grafana, Jaeger, and Loki (under `monitoring/`) form the observability backbone. Workflow Studio and
  RelayCore both emit correlation IDs for cross-system traceability.

## End-to-End Flow

1. A developer opens the Auterity IDE, loads the Workflow Studio workspace, and edits automation logic.
2. Commits sync via GitHub integration; CI triggers `npm run test:frontend` and `npm run test:api`.
3. Approved workflows deploy to services/api, where execution requests queue through Redis and route into RelayCore.
4. RelayCore selects the correct model path, requests specialized runs from NeuroWeaver when required, and responds with
   structured outputs.
5. Results and model feedback persist in the data fabric, surfacing to Studio dashboards and IDE telemetry panes.

This narrative replaces the previous fragmented overview with a cohesive description of how Auterity delivers automation from the
IDE down to model execution.
