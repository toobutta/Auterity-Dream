# 🧱 Template System Documentation

## Overview

Templates for workflows, dashboards, and industry packages: structure, storage, and instantiation.

## Components

- Frontend templates: `frontend/src/templates/`
- UI: `TemplateLibrary.tsx`, `TemplateInstantiationForm.tsx`, `TemplatePreviewModal.tsx`, `TemplateCard.tsx`

## Template Model (Conceptual)

```json
{
  "id": "tpl-001",
  "name": "Workflow Analytics Starter",
  "category": "analytics",
  "layout": {},
  "widgets": [],
  "theme": "default",
  "tags": ["starter", "analytics"]
}
```

## Flow

1) Browse templates; preview
2) Instantiate with parameters
3) Persist new dashboard/workflow

## Best Practices

- Version templates; avoid breaking changes
- Provide sample data for previews


