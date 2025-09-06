# 🚀 Frontend Performance Patterns for Dashboards & Charts

## Overview

Actionable patterns to keep dashboard UIs responsive under heavy data and frequent updates.

## Rendering

- Prefer virtualized lists/tables when > 200 rows
- Memoize chart datasets and props (useMemo)
- Avoid unnecessary legends/grids on dense pages
- Lazy-load heavy charts (`optimized/Lazy*Chart.tsx`)

## Data

- Downsample/aggregate on server; cap points client-side
- Cache with TTL; reuse across widgets where feasible
- Batch API requests; avoid N-per-widget waterfall

## State & Updates

- Coalesce updates; throttle WS-driven re-renders
- Keep fixed-size windows for time-series (e.g., last 1k points)

## Network

- Gzip/Brotli responses; paginate large payloads
- Use HTTP/2+ and keep-alive

## Diagnostics

- Track TTI, FID, long tasks; log chart render times
- Feature flags to toggle expensive visuals


