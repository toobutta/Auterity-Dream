# Messaging and Event Orchestration

| Capability | Maturity | Owner | Touchpoints |
| --- | --- | --- | --- |
| Workflow Messaging Fabric | Stable | Platform Operations Guild | `services/api/app/services/message_queue.py`, `systems/relaycore` |

Auterity streams workflow intents through a Redis-backed queue that feeds RelayCore routing and NeuroWeaver model triggers. The
examples below preserve the original quick-start guidance and extend it with ownership context.

## Queue Provisioning in Workflow Studio

```python
# services/api/app/services/workflow_service.py
from app.services.message_queue import get_message_queue

class WorkflowService:
    def __init__(self):
        self.message_queue = get_message_queue()

    async def execute_workflow_async(self, workflow_id: str, input_data: dict):
        message_id = self.message_queue.enqueue(
            queue_name="workflow_execution",
            payload={
                "workflow_id": workflow_id,
                "input_data": input_data,
                "priority": 5
            },
            delay_seconds=0,
            ttl_seconds=3600
        )
        return {"message_id": message_id, "status": "queued"}
```

## Worker Loop Aligned with RelayCore

```python
# services/api/app/workers/workflow_worker.py
import asyncio
from app.services.message_queue import get_message_queue
from app.services.workflow_engine import WorkflowEngine

class WorkflowWorker:
    def __init__(self):
        self.message_queue = get_message_queue()
        self.workflow_engine = WorkflowEngine()

    async def process_workflows(self):
        while True:
            message = self.message_queue.dequeue("workflow_execution", timeout=30)
            if message:
                try:
                    result = await self.workflow_engine.execute_workflow(
                        message.payload["workflow_id"],
                        message.payload["input_data"]
                    )
                    self.message_queue.ack(message)
                except Exception as e:
                    self.message_queue.nack(message, str(e))
            await asyncio.sleep(1)
```

## Event Fan-Out for RelayCore and NeuroWeaver

```python
# services/api/app/events/workflow_events.py
from app.services.message_queue import get_message_queue
from app.services.search_service import get_search_service
from app.services.vector_service import get_vector_service

class WorkflowEventHandler:
    def __init__(self):
        self.message_queue = get_message_queue()
        self.search = get_search_service()
        self.vector_db = get_vector_service()

    async def handle_workflow_created(self, workflow: dict):
        self.message_queue.enqueue(
            queue_name="indexing_tasks",
            payload={"action": "index_workflow", "workflow": workflow}
        )
        self.message_queue.enqueue(
            queue_name="vector_tasks",
            payload={"action": "embed_workflow", "workflow": workflow}
        )

    async def handle_execution_completed(self, execution: dict):
        self.search.index_execution(execution["id"], execution)
        self.message_queue.enqueue(
            queue_name="analytics_tasks",
            payload={
                "action": "update_workflow_stats",
                "workflow_id": execution["workflow_id"],
                "execution": execution
            }
        )
```

### Operational Notes

- **Dead Letter Policy:** Configure `workflow_execution:dlq` queues in Redis for persistent troubleshooting.
- **Observability:** RelayCore publishes queue depth metrics to `monitoring/` dashboards through OpenTelemetry spans.
