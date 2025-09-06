# 🧠 Caching Strategy & Invalidation Patterns

## Overview

Defines a layered caching approach for performance and cost efficiency, with clear invalidation strategies and correctness guarantees.

## Layers

- Client cache (HTTP cache, SWR)
- Edge/CDN cache (static assets, API GET)
- Service cache (in-memory LRU)
- Distributed cache (Redis)
- Computation cache (model results, embeddings)

## Cache Keys

```typescript
interface CacheKey {
  namespace: string; // e.g., "analytics:dashboard"
  entityId?: string; // e.g., dashboard id
  variant?: string; // e.g., query hash
  tenantId?: string;
}
```

- Use stable, deterministic keys
- Include tenant and auth scopes when applicable

## Invalidation

### Time-Based (TTL)
- Default TTLs per namespace (e.g., metrics: 60s)

### Event-Based
- Invalidate on domain events using routing rules

```typescript
interface InvalidationRule {
  onEvent: string; // e.g., workflow.instance.updated.v1
  targets: (event: any) => string[]; // cache keys to invalidate
}
```

### Write-Through / Write-Behind
- Write-through for strong consistency on hot keys
- Write-behind for batch-heavy updates

## Coherency & Staleness

- Stale-while-revalidate for non-critical reads
- Use ETags + If-None-Match for HTTP GETs

## Caching Patterns

### Request Result Cache
- Hash request body to key; respect auth scope

### Query Cache
- Parameterized queries with normalized ordering

### Composite Cache
- Multi-source aggregation cached with component version vector

## Hot Path Examples

```typescript
// Redis get-or-set
async function getOrSet<T>(key: string, ttl: number, fn: () => Promise<T>): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached) as T;
  const value = await fn();
  await redis.set(key, JSON.stringify(value), { EX: ttl });
  return value;
}
```

## Observability

- Metrics: hit rate, evictions, latency, stale ratio
- Tracing: annotate spans with cache events

## Risks

- Thundering herd: use request coalescing and jittered TTLs
- Cache stampede: probabilistic early expiration
- Inconsistent reads: use versioning for composite objects

## Related Documentation

- Monitoring & Observability
- Performance Documentation
- Redis Caching Strategy
