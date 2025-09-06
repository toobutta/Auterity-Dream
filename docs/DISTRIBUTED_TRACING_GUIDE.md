# 🔎 Distributed Tracing Guide (Jaeger)

## Overview

End-to-end tracing for requests across gateway, services, and workers.

## Instrumentation

- Propagate trace/span IDs via headers (W3C Trace Context)
- Wrap async tasks with span context
- Annotate spans with domain tags (tenant, workflow_id)

## Collection & Dashboards

- Export to Jaeger; link traces from logs (Loki)
- Grafana panels for p95 latency and error hotpaths

## Best Practices

- Sample rates per-route; increase for erroring endpoints
- Redact sensitive data in span attributes


