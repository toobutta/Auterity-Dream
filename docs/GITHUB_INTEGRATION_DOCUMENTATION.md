# 🐙 GitHub Integration Documentation

## Overview

Documentation of authentication, PR automation, webhooks, and workflow integrations.

## Components

- Frontend services: `src/services/githubIntegration.ts`
- Backend: webhook handler, OAuth app, workflow triggers

## Capabilities

- OAuth-based sign-in and token storage
- Repo listing and file operations
- PR creation, comments, checks integration
- Webhook ingestion for events (push, PR, issues)

## Flows

```mermaid
sequenceDiagram
  participant UI as Frontend
  participant GH as GitHub
  participant API as Backend

  UI->>GH: OAuth authorize
  GH-->>API: Code exchange
  API-->>UI: Access token (server-held)
  UI->>API: Create PR / comment / fetch repos
  GH->>API: Webhook events
  API-->>UI: Realtime updates
```

## Security

- Store tokens server-side; minimal scopes
- Verify webhook signatures


