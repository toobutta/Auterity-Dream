# 🔌 Plugin System Overview

## Overview

High-level overview of plugin architecture, registries, and extension points across IDE, AI, and workflow features.

## Architecture

```mermaid
graph TD
  A[Plugin Manager] --> B[Registry]
  A --> C[Loader]
  A --> D[Sandbox]
  B --> E[Core Plugins]
  B --> F[User Plugins]
  C --> G[Lifecycle Hooks]
  D --> H[Isolation & Limits]
```

## Extension Points

- IDE panes, AI tools, workflow nodes, dashboards widgets
- Validation and manifest format

## Security

- Capability-based permissions, sandboxing, resource quotas


