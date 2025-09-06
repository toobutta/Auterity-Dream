# 🚪 Kong API Gateway Documentation

## Overview

Gateway configuration, routing, auth, rate-limiting, and observability.

## Configuration

- Routes/services for `/api/v1/*`
- Plugins: JWT auth, rate limiting, request-transformer, prometheus

## Deployment

- Declarative config via `kong.yml` (infra repo)
- Health checks and blue/green rollouts

## Monitoring

- Prometheus metrics; Grafana dashboards; logs to Loki


