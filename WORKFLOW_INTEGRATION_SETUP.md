# Workflow Integration Setup

## Quick Start (from monorepo root)

```powershell
# 1. Install all workspace dependencies
npm install

# 2. Build contracts package
npm run contracts:build

# 3. Start the API server
npm run api:dev
```

The API will be available at http://localhost:5055 with docs at http://localhost:5055/docs.

## Test Everything

```powershell
# Run all workflow tests
npm run workflow:test-all

# Run API smoke tests (requires server running)
npm run api:smoke
```

## Manual Testing

1. **Start API**: `npm run api:dev`
2. **Open docs**: http://localhost:5055/docs
3. **Test with PowerShell**: `cd apps/api && pwsh ./smoke-test.ps1`

## Next: UI Integration

Ready for the next step - wiring up the Error-IQ export and Workflow-Studio import buttons!

### Error-IQ Export Integration

Add to your ReactFlow component:

```typescript
import { reactflowToCanonical } from '@auterity/workflow-contracts';

async function exportCanonical() {
  const canonical = reactflowToCanonical(currentWorkflow);
  
  const response = await fetch('http://localhost:5055/v1/workflows/export', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'dev-api-key-123'
    },
    body: JSON.stringify(canonical)
  });
  
  const result = await response.json();
  console.log('Exported workflow:', result.id);
}
```

### Workflow-Studio Import Integration

Add to your canvas component:

```typescript
import { canonicalToReactflow } from '@auterity/workflow-contracts';

async function importCanonical(workflowId: string) {
  const response = await fetch(`http://localhost:5055/v1/workflows/${workflowId}`, {
    headers: { 'x-api-key': 'dev-api-key-123' }
  });
  
  const canonical = await response.json();
  const studioFormat = canonicalToReactflow(canonical);
  
  // Render in your canvas
  setWorkflow(studioFormat);
}
```

## Architecture Summary

```
auterity-error-iq/
├── packages/workflow-contracts/     # Shared contract (Zod + JSON Schema)
│   ├── src/index.ts                # Zod types
│   ├── src/adapters/               # RF ↔ Canonical converters
│   └── src/__tests__/              # Round-trip tests
├── apps/api/                       # Express REST API
│   ├── src/server.ts               # OpenAPI + validation
│   ├── src/routes/workflows.ts     # CRUD + ETag + JSON Patch
│   └── src/services/               # Store + validation
└── package.json                    # Workspace config
```

**Status: ✅ Contracts + API Complete**
**Next: 🔄 UI Integration (Error-IQ + Workflow-Studio)**
