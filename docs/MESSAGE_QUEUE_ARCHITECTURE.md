# 📨 Message Queue Architecture (Kafka & RabbitMQ)

## Overview

Event and queue patterns across services for reliability and decoupling.

## Topics & Queues

- Kafka topics: analytics events, workflow events, ai events
- RabbitMQ queues: task queues, DLQ per service

## Patterns

- Producers in core/AI services; consumers in analytics/processors
- Retry with DLQ; idempotent handlers; outbox where needed

## Monitoring

- Export lag, consumer health; alert on DLQ growth


