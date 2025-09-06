# 🧵 Celery Workers Documentation

## Overview

Async task processing for long-running/IO-heavy jobs.

## Patterns

- Dedicated queues per service; retries with backoff; DLQ strategy
- Idempotent tasks; outbox pattern for reliability
- Task metrics (duration, failures) exported to Prometheus

## Example Flow

1) API enqueues task with correlation ID
2) Worker executes; updates status in DB
3) WebSocket notifies UI on completion


