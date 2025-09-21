# Vector Intelligence and Search Mesh

| Capability | Maturity | Owner | Touchpoints |
| --- | --- | --- | --- |
| Vector & Search Services | Production | Insight Systems Team | `services/api/app/services/vector_service.py`, `services/api/app/services/search_service.py` |

RelayCore relies on curated embeddings and search indices to surface workflow recommendations. The snippets below keep the
original semantic search implementations with added operational framing.

## Vector Enrichment

```python
# services/api/app/services/workflow_search_service.py
from app.services.vector_service import get_vector_service

class WorkflowSearchService:
    def __init__(self):
        self.vector_db = get_vector_service()

    async def index_workflow(self, workflow: dict):
        searchable_text = f"{workflow['name']} {workflow['description']}"

        vector_id = self.vector_db.store_vector(
            collection_name="workflows",
            text=searchable_text,
            metadata={
                "workflow_id": workflow["id"],
                "name": workflow["name"],
                "tags": workflow.get("tags", []),
                "created_at": workflow["created_at"],
                "category": workflow.get("category", "general")
            }
        )

        return vector_id
```

### Context-Aware Recommendations

```python
# services/api/app/services/recommendation_service.py
from app.services.vector_service import get_vector_service

class RecommendationService:
    def __init__(self):
        self.vector_db = get_vector_service()

    async def get_workflow_recommendations(self, user_context: dict):
        context_text = f"User interested in {' '.join(user_context.get('interests', []))}"

        similar_workflows = self.vector_db.search_similar(
            collection_name="workflows",
            query_text=context_text,
            limit=10,
            score_threshold=0.6
        )

        filtered_recommendations = []
        for workflow in similar_workflows:
            if self._matches_user_preferences(workflow["metadata"], user_context):
                filtered_recommendations.append(workflow)

        return filtered_recommendations[:5]
```

## Search APIs

```python
# services/api/app/api/endpoints/search.py
from typing import List
from fastapi import APIRouter, Query
from app.services.search_service import get_search_service

router = APIRouter()
search = get_search_service()

@router.get("/search/workflows")
async def search_workflows(
    q: str = Query(..., description="Search query"),
    tags: List[str] = Query([], description="Filter by tags"),
    limit: int = Query(10, le=50)
):
    results = search.search_workflows(
        query=q,
        tags=tags if tags else None,
        limit=limit
    )

    return {
        "query": q,
        "total": len(results),
        "results": results
    }
```

## Automated Indexing Pipelines

```python
# services/api/app/services/indexing_service.py
from app.services.search_service import get_search_service

class IndexingService:
    def __init__(self):
        self.search = get_search_service()

    async def index_workflow_execution(self, execution: dict):
        indexed = self.search.index_execution(
            execution_id=execution["id"],
            execution_data={
                "workflow_id": execution["workflow_id"],
                "status": execution["status"],
                "started_at": execution["started_at"],
                "completed_at": execution.get("completed_at"),
                "error_message": execution.get("error_message"),
                "input_data": execution["input_data"],
                "output_data": execution.get("output_data", {})
            }
        )

        if "logs" in execution:
            for log_entry in execution["logs"]:
                self.search.index_log({
                    "timestamp": log_entry["timestamp"],
                    "level": log_entry["level"],
                    "message": log_entry["message"],
                    "service": "workflow_engine",
                    "execution_id": execution["id"]
                })

        return indexed
```

### Operational Notes

- **Collections:** Default Qdrant collection `workflows` is provisioned via `services/api/startup/ai_ecosystem_startup.py`.
- **Cost Controls:** RelayCore applies TTL policies on stale embeddings; monitor via `monitoring/vector-metrics.json`.
