# Testing and Simulation Playbooks

| Capability | Maturity | Owner | Touchpoints |
| --- | --- | --- | --- |
| Integration Test Harness | Stable | Quality Engineering | `services/api/tests`, `tests/integration` |

Automated validation is required before promoting integrations to RelayCore routing. This guide collects the fixture and test
snippets that previously lived in the monolithic integration summary.

## Service Double Fixtures

```python
# services/api/tests/conftest.py
import pytest
from unittest.mock import Mock

@pytest.fixture
def mock_message_queue():
    mock = Mock()
    mock.enqueue = Mock(return_value="test-message-id")
    mock.dequeue = Mock(return_value=None)
    mock.ack = Mock(return_value=True)
    mock.nack = Mock(return_value=True)
    return mock

@pytest.fixture
def mock_storage_service():
    mock = Mock()
    mock.upload_file = Mock(return_value="test-bucket/test-file")
    mock.download_file = Mock(return_value=b"test content")
    mock.get_presigned_url = Mock(return_value="https://test-url")
    return mock

@pytest.fixture
def mock_vector_service():
    mock = Mock()
    mock.store_vector = Mock(return_value="test-vector-id")
    mock.search_similar = Mock(return_value=[])
    return mock
```

## Integration Test Example

```python
# services/api/tests/integration/test_service_integration.py
import pytest
from app.services.workflow_service import WorkflowService

@pytest.mark.integration
async def test_workflow_execution_with_services():
    workflow_service = WorkflowService()

    result = await workflow_service.execute_workflow_async(
        workflow_id="test-workflow",
        input_data={"test": "data"}
    )

    assert result["status"] == "queued"
    assert "message_id" in result
```

## Storage and Search Validation

```python
# services/api/tests/integration/test_storage_search.py
import pytest
from app.services.storage_service import get_storage_service
from app.services.search_service import get_search_service

@pytest.mark.integration
async def test_file_upload_and_search():
    storage = get_storage_service()
    search = get_search_service()

    file_path = storage.upload_text(
        "test-bucket",
        "test-file.txt",
        "This is test content for search"
    )

    indexed = search.index_log({
        "timestamp": "2024-01-01T00:00:00Z",
        "level": "INFO",
        "message": "Test file uploaded",
        "service": "test",
        "file_path": file_path
    })

    assert indexed

    results = search.search_logs(query="Test file uploaded")
    assert len(results) > 0
```

### Operational Notes

- **Pytest Markers:** Ensure `pytest.ini` in `services/api` activates the `integration` marker for selective runs.
- **CI Wiring:** `.github/workflows/quality.yml` should call `npm run test:api` after unit mocks pass.
