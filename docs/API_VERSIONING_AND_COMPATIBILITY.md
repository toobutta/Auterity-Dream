# 🔁 API Versioning & Compatibility Strategy

## Overview

This document defines how APIs are versioned, evolved, and deprecated to ensure backward compatibility and predictable change management across the platform.

## Principles

- Semantic Versioning for SDKs and schemas: MAJOR.MINOR.PATCH
- Explicit HTTP API versions; no silent breaking changes
- Default compatibility target: backward compatible for one MAJOR + 2 MINOR cycles
- Clear deprecation policy and migration guides

## Versioning Approaches

### URL Path Versioning
Examples: `/v1/...`, `/v2/...` for major versions only.

### Header Versioning
Use `Accept: application/vnd.auterity.resource+json; version=1` for fine-grained evolution within major lines.

### Query Param Versioning
Allowed for internal tools: `?apiVersion=1.2`. Not recommended for public APIs.

## Compatibility Policy

- Additive changes (new fields, endpoints) are backward compatible
- Required field additions must provide defaults or be gated behind new versions
- Field removals, behavior changes, and error contract changes require a new MAJOR
- Response ordering is not guaranteed unless documented

## Deprecation Lifecycle

1. Announce deprecation in release notes and docs
2. Provide dual-run period with deprecation headers:
   - `Deprecation: true`
   - `Sunset: <RFC1123-date>`
   - `Link: <migration_guide_url>; rel="deprecation"`
3. Enforce rate-limited warnings before removal
4. Remove after sunset with major release

## Version Negotiation

```typescript
export interface VersionNegotiationInput {
  requestedViaPath?: number; // e.g., /v2
  requestedViaHeader?: string; // e.g., version=1.3
  supported: string[]; // e.g., ["1.0","1.1","1.2","2.0"]
}

export function negotiateVersion(input: VersionNegotiationInput): string {
  const byHeader = input.requestedViaHeader?.trim();
  if (byHeader && input.supported.includes(byHeader)) return byHeader;
  if (input.requestedViaPath) {
    const major = `${input.requestedViaPath}.0`;
    const best = input.supported.filter(v => v.startsWith(`${input.requestedViaPath}.`)).pop();
    return best ?? major;
  }
  return input.supported[input.supported.length - 1];
}
```

## OpenAPI Conventions

```yaml
openapi: 3.0.3
info:
  title: Auterity Public API
  version: 1.2.0
paths:
  /v1/resources:
    get:
      summary: List resources (v1)
      responses:
        '200': { description: OK }
  /v2/resources:
    get:
      summary: List resources (v2)
      parameters:
        - in: header
          name: Accept
          schema: { type: string }
          description: application/vnd.auterity.resource+json; version=2
```

## Change Types

- Non-breaking: new optional fields, new endpoints, new enum values when ignored by clients
- Conditionally breaking: pagination defaults, rate limit changes (document & announce)
- Breaking: remove/rename fields, change data types, change error codes contract

## Testing & Gates

- Contract tests against previous MAJOR and latest MINOR
- Schema diff checks in CI for breaking changes
- Canary rollouts with traffic mirroring for new MAJOR

## Migration Guidance Template

- What changed and why
- Affected endpoints and fields
- Before/After request/response examples
- Rollout plan, fallbacks, and timelines

## Related Documentation

- Cross System Protocol
- Testing & QA Strategy
- DevEx & Release Guide

