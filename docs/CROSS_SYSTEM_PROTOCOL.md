# 🔁 Cross-System Protocol

## Overview

Contracts and policies for communication across services (HTTP, WS, events).

## Conventions

- Trace IDs propagated via `X-Request-ID`
- Auth via JWT; service-to-service via mTLS when applicable
- Error schema: code, message, details, remediation

## Eventing

- Topics: `analytics.*`, `workflow.*`, `ai.*`, `alerts.*`
- Payload versioning and compatibility


