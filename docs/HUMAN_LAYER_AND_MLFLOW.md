# 🧑‍⚖️ Human Layer & MLflow Integration

## Overview

Guidance for incorporating human-in-the-loop review, approvals, and interventions with MLflow-powered experiment and model tracking.

## Components

- Frontend: `src/services/humanLayerService.ts`, `src/services/humanlayerMLflowIntegration.ts`, `frontend/src/components/humanlayer-mlflow/HumanLayerMLflowDashboard.tsx`
- Backend: approval queues, audit logs, MLflow tracking server

## Flows

```mermaid
sequenceDiagram
  participant UI as Human Layer UI
  participant API as Human Layer API
  participant Q as Approval Queue
  participant M as MLflow

  UI->>API: Submit item for review
  API->>Q: Enqueue
  UI->>API: List pending items
  API-->>UI: Items + model metadata
  API->>M: Read metrics/artifacts
  UI->>API: Approve/Reject with reason
  API-->>UI: Persist decision + audit
```

## Policies & Audit

- Per-role approval thresholds
- Reason capture, immutable logs
- SLA timers and escalation

## UI

- Dashboard linking model runs (metrics, params, artifacts) to review tasks
- Filters: risk, impact, freshness


