# Advanced Integration Guides

Auterity's integration layer connects Workflow Studio, RelayCore, and NeuroWeaver with shared infrastructure services. This
index links focused guides that expand the legacy `ADVANCED_INTEGRATIONS_SUMMARY.md` into maintainable playbooks.

## Ownership & Maturity

| Capability Cluster | Maturity | Owner | Source of Truth |
| --- | --- | --- | --- |
| Messaging & Event Fabric | Stable | Platform Operations Guild | [`services/api`](../../services/api) |
| Storage & Artifact Pipeline | Stable | Data Experience Team | [`services/api`](../../services/api) |
| Vector & Search Intelligence | Production | Insight Systems Team | [`services/api`](../../services/api) + `systems/relaycore` |
| Resilience & Observability | Beta | Reliability Engineering | [`services/api`](../../services/api) + `monitoring/` |
| Testing & Simulation Harness | Stable | Quality Engineering | [`services/api/tests`](../../services/api/tests) |

## Guide Index

1. [Messaging and Event Orchestration](./messaging-and-events.md)
2. [Storage and Artifact Operations](./storage-and-artifacts.md)
3. [Vector Intelligence and Search Mesh](./vector-and-search.md)
4. [Resilience, Health, and Observability](./resilience-and-observability.md)
5. [Testing and Simulation Playbooks](./testing-and-simulation.md)

> **Note:** The original `docs/development/SERVICE_INTEGRATION_GUIDE.md` now serves as a pointer to this structure. All content has
> been retained, normalized to UTF-8, and regrouped by integration capability for faster onboarding and ownership alignment.
