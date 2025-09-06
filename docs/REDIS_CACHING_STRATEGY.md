# 🧰 Redis Caching Strategy

## Overview

Standardized caching for APIs, dashboards, and real-time channels.

## Patterns

- Key design: `namespace:entity:id` with TTLs
- Cache aside: read-through with TTL; write-through for critical aggregates
- Invalidation: event-driven on writes; versioned keys to avoid stampedes
- Use per-tenant prefixes to isolate data

## Observability

- Track hit rate, evictions; alert on abnormal churn


