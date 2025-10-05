# Storage and Artifact Operations

| Capability | Maturity | Owner | Touchpoints |
| --- | --- | --- | --- |
| Artifact Storage | Stable | Data Experience Team | `services/api/app/services/storage_service.py`, `monitoring/minio` |

Workflow Studio persists execution assets in MinIO buckets with signed delivery through the API. This guide preserves the upload
patterns and clarifies lifecycle responsibilities.

## File Upload API Pattern

```python
# services/api/app/api/endpoints/files.py
from fastapi import APIRouter, UploadFile, File
from app.services.storage_service import get_storage_service

router = APIRouter()
storage = get_storage_service()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = storage.upload_file(
        bucket_name="user-uploads",
        object_name=f"uploads/{file.filename}",
        file_data=file.file,
        content_type=file.content_type
    )

    download_url = storage.get_presigned_url(
        "user-uploads",
        f"uploads/{file.filename}"
    )

    return {
        "file_path": file_path,
        "download_url": download_url,
        "filename": file.filename
    }
```

## Artifact Retention per Execution

```python
# services/api/app/services/workflow_execution_service.py
import json
from app.services.storage_service import get_storage_service

class WorkflowExecutionService:
    def __init__(self):
        self.storage = get_storage_service()

    async def save_execution_result(self, execution_id: str, result_data: dict):
        result_json = json.dumps(result_data, indent=2)
        file_path = self.storage.upload_text(
            bucket_name="workflow-artifacts",
            object_name=f"executions/{execution_id}/result.json",
            text=result_json
        )

        if "output_files" in result_data:
            for file_info in result_data["output_files"]:
                self.storage.upload_file(
                    bucket_name="workflow-artifacts",
                    object_name=f"executions/{execution_id}/{file_info['name']}",
                    file_data=file_info["content"],
                    content_type=file_info["type"]
                )

        return file_path
```

### Operational Notes

- **Bucket Policies:** Terraform modules under `infrastructure/` enforce private ACLs with explicit presigned access windows.
- **Lifecycle Management:** Large artifacts older than 30 days roll to cold storage via MinIO ILM rules; adjust in
  `services/api/config/storage.yaml` when present.
