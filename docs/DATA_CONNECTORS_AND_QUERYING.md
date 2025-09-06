# 🔗 Data Connectors & Querying for Analytics

## Overview

How to configure, query, and monitor external/internal data sources powering dashboards and bespoke analytics.

## Frontend Client

Location: `frontend/src/api/data-connectors.ts`

Capabilities:
- Manage connections (create, update, delete, test)
- Execute queries per-connection
- Inspect schemas and supported types
- Bulk health checks and analytics

## Supported Connector Types

`rest_api`, `postgresql`, `mysql`, `mongodb`, `redis`, `elasticsearch`, `s3`, `bigquery`, `snowflake`, `kafka`, `websocket`, `file_upload`

## Typical Flow

1) Create or select a connection
2) Validate config with `validateConnectionConfig`
3) Execute query via `executeQuery`
4) Normalize results to chart/table shapes

## Example

```ts
const { data } = await executeQuery(connId, 'SELECT ts, value FROM metrics WHERE ts > NOW() - INTERVAL 1 DAY');
const chartData = data.rows.map((r: any) => ({ x: r.ts, y: r.value }));
```

## Health & Monitoring

- `getConnectionHealth` for per-connection status
- `bulkTestConnections` for fleet checks
- `getConnectorAnalytics` for usage distribution

## Security

- Store secrets server-side; never commit credentials
- Enforce RBAC per-connection and per-operation


