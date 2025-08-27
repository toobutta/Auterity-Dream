"""Error correlation API endpoints."""

from fastapi import APIRouter
from typing import Dict

router = APIRouter(prefix="/error-correlation", tags=["error-correlation"])


@router.get("/health")
async def health_check() -> Dict[str, str]:
    return {"status": "ok"}
