# 🔔 Notifications & Proactive Alerts

## Overview

End-user and system notifications: toasts, notification center, and proactive alerting.

## Components

- Frontend: `frontend/src/components/notifications/NotificationSystem.tsx`, `NotificationCenter.tsx`
- Hooks/services: push channels, WS topics

## Patterns

- Levels: info, success, warning, error
- Deduplication and rate limiting
- Inbox vs transient toasts

## Proactive Alerts

- Define rules from metrics/events (SLOs, anomalies)
- Deliver via email, Slack, in-app notifications


