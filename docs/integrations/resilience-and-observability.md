# Resilience, Health, and Observability

| Capability | Maturity | Owner | Touchpoints |
| --- | --- | --- | --- |
| Reliability Patterns | Beta | Reliability Engineering | `services/api/app/services/cache_service.py`, `monitoring/` |

Workflow Studio's integration stack ships with caching, circuit breaking, and proactive health reporting. This guide consolidates
the resilience snippets from the original monolithic document.

## Multi-Tenant Cache Facade

```python
# services/api/app/services/cache_service.py
import json
from typing import Optional, Any
from app.services.message_queue import get_message_queue

class CacheService:
    def __init__(self):
        self.redis_client = get_message_queue().redis_client
        self.default_ttl = 3600

    async def get(self, key: str) -> Optional[Any]:
        try:
            value = self.redis_client.get(f"cache:{key}")
            return json.loads(value) if value else None
        except Exception:
            return None

    async def set(self, key: str, value: Any, ttl: int = None) -> bool:
        try:
            ttl = ttl or self.default_ttl
            self.redis_client.setex(
                f"cache:{key}",
                ttl,
                json.dumps(value, default=str)
            )
            return True
        except Exception:
            return False

    async def delete(self, key: str) -> bool:
        try:
            self.redis_client.delete(f"cache:{key}")
            return True
        except Exception:
            return False
```

## Health Service Composition

```python
# services/api/app/monitoring/health_service.py
from app.services.message_queue import get_message_queue
from app.services.storage_service import get_storage_service
from app.services.vector_service import get_vector_service
from app.services.search_service import get_search_service

class HealthService:
    def __init__(self):
        self.services = {
            "message_queue": get_message_queue(),
            "storage": get_storage_service(),
            "vector_db": get_vector_service(),
            "search": get_search_service()
        }

    async def check_all_services(self) -> dict:
        health_status = {}

        for service_name, service in self.services.items():
            try:
                health = service.health_check()
                health_status[service_name] = health
            except Exception as exc:
                health_status[service_name] = {"status": "degraded", "detail": str(exc)}

        return health_status
```

## Circuit Breakers and Retry Strategy

```python
# services/api/app/services/resilient_search.py
from app.services.search_service import get_search_service
from app.services.vector_service import get_vector_service
from app.utils.retry_utils import CircuitBreaker

class ResilientSearchService:
    def __init__(self):
        self.search_circuit = CircuitBreaker(failure_threshold=3, timeout=30)
        self.vector_circuit = CircuitBreaker(failure_threshold=3, timeout=30)
        self.search = get_search_service()
        self.vector_db = get_vector_service()

    async def search_workflows_resilient(self, query: str):
        try:
            return await self.search_circuit.call(
                self.search.search_workflows,
                query=query
            )
        except Exception:
            return await self.fallback_search(query)
```

```python
# services/api/app/utils/retry.py
import asyncio
import random
from typing import Callable, Any

async def retry_with_backoff(
    func: Callable,
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 60.0,
    backoff_factor: float = 2.0,
    jitter: bool = True
) -> Any:
    last_exception = None

    for attempt in range(max_retries + 1):
        try:
            return await func()
        except Exception as exc:
            last_exception = exc

            if attempt == max_retries:
                break

            delay = min(base_delay * (backoff_factor ** attempt), max_delay)

            if jitter:
                delay *= (0.5 + random.random() * 0.5)

            await asyncio.sleep(delay)

    raise last_exception
```

### Operational Notes

- **Alerting:** Forward health summaries to Grafana OnCall via `monitoring/alertmanager.yml`.
- **Fallback Search:** Implement `fallback_search` with direct Postgres reads for parity when vector search is offline.
