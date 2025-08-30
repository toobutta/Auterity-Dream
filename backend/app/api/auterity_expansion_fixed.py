"""Auterity AI Platform Expansion API endpoints - Fixed Version."""

import logging
from typing import Any, Dict, List, Optional
from uuid import UUID
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.tenant import Tenant
from app.schemas.auterity_expansion import (
    AgentDeployRequest,
    AgentDeployResponse,
    SimilarityResult,
    SimilaritySearchRequest,
    SimilaritySearchResponse,
    TriageRequest,
    TriageResponse,
    TriageRuleCreate,
    TriageRuleResponse,
    VectorEmbeddingCreate,
    VectorEmbeddingResponse,
)
from app.services.autonomous_agent_service import (
    AutonomousAgentService,
    AgentConfig as ServiceAgentConfig,
)
from app.services.smart_triage_service import SmartTriageService
from app.services.vector_duplicate_service import VectorDuplicateService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/auterity", tags=["auterity-expansion"])


# Dependency to get current tenant (placeholder - implement proper auth)
async def get_current_tenant(db: Session = Depends(get_db)) -> Tenant:
    """Get current tenant from request context."""
    # TODO: Implement proper tenant resolution from JWT/auth
    # For now, return a placeholder tenant
    tenant = db.query(Tenant).first()
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No tenant found"
        )
    return tenant


def convert_db_rule_to_response(rule: Any) -> TriageRuleResponse:
    """Convert database TriageRule object to response schema."""
    return TriageRuleResponse(
        id=UUID(str(rule.id)),
        tenant_id=UUID(str(rule.tenant_id)),
        name=str(rule.name),
        rule_type=str(rule.rule_type.value)
        if hasattr(rule.rule_type, "value")
        else str(rule.rule_type),
        conditions=dict(rule.conditions) if rule.conditions else {},
        routing_logic=dict(rule.routing_logic) if rule.routing_logic else {},
        confidence_threshold=Decimal(str(rule.confidence_threshold)),
        priority=int(rule.priority),
        is_active=bool(rule.is_active),
        created_at=rule.created_at,
        updated_at=rule.updated_at,
    )


def convert_db_embedding_to_response(embedding: Any) -> VectorEmbeddingResponse:
    """Convert database VectorEmbedding object to response schema."""
    return VectorEmbeddingResponse(
        id=UUID(str(embedding.id)),
        tenant_id=UUID(str(embedding.tenant_id)),
        item_type=str(embedding.item_type),
        item_id=UUID(str(embedding.item_id)),
        content_hash=str(embedding.content_hash),
        embedding_vector=list(embedding.embedding_vector)
        if embedding.embedding_vector
        else [],
        metadata=dict(embedding.metadata)
        if hasattr(embedding, "metadata") and embedding.metadata
        else {},
        created_at=embedding.created_at,
    )


# Smart Triage Endpoints
@router.post("/triage", response_model=TriageResponse)
async def triage_input(
    request: TriageRequest,
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant),
) -> TriageResponse:
    """Process input through smart triage system.

    Uses AI-powered analysis combined with rule-based logic to determine
    the optimal routing decision for the given input content.

    Args:
        request: Triage request containing content and context
        db: Database session dependency
        tenant: Current tenant dependency

    Returns:
        TriageResponse with routing decision and analysis details

    Raises:
        HTTPException: If triage processing fails
    """
    try:
        service = SmartTriageService(db)
        result = await service.triage_input(
            content=request.content,
            context=request.context,
            tenant_id=UUID(str(tenant.id)),
        )

        # Use the to_dict() method for schema compatibility
        return TriageResponse(**result.to_dict())

    except ValueError as e:
        logger.error(f"Invalid triage request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid request: {str(e)}",
        )
    except Exception as e:
        logger.error(f"Failed to process triage: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred during triage processing",
        )


@router.post("/triage/rules", response_model=TriageRuleResponse)
async def create_triage_rule(
    rule_data: TriageRuleCreate,
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant),
) -> TriageRuleResponse:
    """Create a new triage rule for the current tenant.

    Creates a new AI or rule-based triage rule that will be used for
    automatic content routing decisions.

    Args:
        rule_data: Triage rule creation data including conditions and logic
        db: Database session dependency
        tenant: Current tenant dependency

    Returns:
        TriageRuleResponse with the created rule details

    Raises:
        HTTPException: If rule creation fails or validation errors occur
    """
    try:
        service = SmartTriageService(db)
        rule = await service.create_triage_rule(
            tenant_id=UUID(str(tenant.id)),
            rule_data=rule_data.model_dump(),  # Updated from dict() to model_dump()
        )

        return convert_db_rule_to_response(rule)

    except ValueError as e:
        logger.error(f"Invalid triage rule data: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid rule data: {str(e)}",
        )
    except Exception as e:
        logger.error(f"Failed to create triage rule: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred during rule creation",
        )


@router.get("/triage/rules", response_model=List[TriageRuleResponse])
async def get_triage_rules(
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant),
    active_only: bool = Query(True, description="Return only active rules"),
):
    """Get triage rules for the current tenant."""
    try:
        service = SmartTriageService(db)
        rules = await service._get_active_triage_rules(UUID(str(tenant.id)))

        if not active_only:
            # Get all rules if not filtering by active
            from app.models.auterity_expansion import TriageRule

            rules = db.query(TriageRule).filter(TriageRule.tenant_id == tenant.id).all()

        return [convert_db_rule_to_response(rule) for rule in rules]

    except Exception as e:
        logger.error(f"Failed to get triage rules: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get triage rules: {str(e)}",
        )


@router.get("/triage/accuracy")
async def get_triage_accuracy(
    days: int = Query(30, description="Number of days to analyze"),
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant),
):
    """Get triage accuracy metrics."""
    try:
        service = SmartTriageService(db)
        accuracy = await service.get_triage_accuracy(UUID(str(tenant.id)), days)
        return {"accuracy": accuracy, "period_days": days}

    except Exception as e:
        logger.error(f"Failed to get triage accuracy: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get accuracy metrics: {str(e)}",
        )


# Vector Similarity Endpoints
@router.post("/similarity/search", response_model=SimilaritySearchResponse)
async def search_similar_items(
    request: SimilaritySearchRequest,
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant),
) -> SimilaritySearchResponse:
    """Search for similar items using vector embeddings.

    Performs semantic similarity search across the specified item type
    using AI-generated vector embeddings.

    Args:
        request: Similarity search request with content and parameters
        db: Database session dependency
        tenant: Current tenant dependency

    Returns:
        SimilaritySearchResponse with ranked similarity results

    Raises:
        HTTPException: If search fails or invalid parameters provided
    """
    try:
        # Validate request parameters
        if not request.content.strip():
            raise ValueError("Content cannot be empty")

        service = VectorDuplicateService(db)
        results = await service.find_similar_items(
            content=request.content,
            item_type=request.item_type,
            tenant_id=UUID(str(tenant.id)),
            threshold=request.threshold,
            limit=request.limit,
        )

        # Convert service results to schema objects using to_dict()
        similarity_results = [
            SimilarityResult(**result.to_dict()) for result in results
        ]

        return SimilaritySearchResponse(
            query_content=request.content,
            results=similarity_results,
            total_found=len(similarity_results),
            search_time_ms=0,  # Could be enhanced to track actual search time
        )

    except ValueError as e:
        logger.error(f"Invalid similarity search request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid request: {str(e)}",
        )
    except Exception as e:
        logger.error(f"Failed to search similar items: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred during similarity search",
        )


@router.post("/embeddings", response_model=VectorEmbeddingResponse)
async def create_embedding(
    embedding_data: VectorEmbeddingCreate,
    content: str,
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant),
):
    """Create a new vector embedding."""
    try:
        service = VectorDuplicateService(db)
        embedding = await service.create_embedding(
            tenant_id=UUID(str(tenant.id)),
            item_type=embedding_data.item_type,
            item_id=embedding_data.item_id,
            content=content,
            metadata=embedding_data.metadata,
        )

        if not embedding:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate embedding",
            )

        return convert_db_embedding_to_response(embedding)

    except Exception as e:
        logger.error(f"Failed to create embedding: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create embedding: {str(e)}",
        )


@router.get("/embeddings/clusters")
async def get_similarity_clusters(
    item_type: Optional[str] = Query(None),
    min_cluster_size: int = Query(3),
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant),
):
    """Get similarity clusters for duplicate detection."""
    try:
        if item_type is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="item_type parameter is required",
            )

        service = VectorDuplicateService(db)
        clusters = await service.get_similarity_clusters(
            tenant_id=UUID(str(tenant.id)),
            item_type=item_type,
            min_cluster_size=min_cluster_size,
        )

        return {
            "clusters": clusters,
            "total_clusters": len(clusters),
            "parameters": {
                "item_type": item_type,
                "min_cluster_size": min_cluster_size,
            },
        }

    except Exception as e:
        logger.error(f"Failed to get similarity clusters: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get clusters: {str(e)}",
        )


@router.get("/duplicates/analysis")
async def get_duplicate_analysis(
    item_type: Optional[str] = Query(None),
    days: int = Query(30),
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant),
):
    """Get duplicate analysis report."""
    try:
        if item_type is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="item_type parameter is required",
            )

        service = VectorDuplicateService(db)
        analysis = await service.get_duplicate_analysis(
            tenant_id=UUID(str(tenant.id)), item_type=item_type, days=days
        )

        return {
            "analysis": analysis,
            "period_days": days,
            "item_type": item_type,
        }

    except Exception as e:
        logger.error(f"Failed to get duplicate analysis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get analysis: {str(e)}",
        )


# Autonomous Agent Endpoints
@router.post("/agents/deploy", response_model=AgentDeployResponse)
async def deploy_agent(
    request: AgentDeployRequest,
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant),
) -> AgentDeployResponse:
    """Deploy a new autonomous agent for the current tenant.

    Creates and deploys a new AI agent with the specified configuration,
    including memory systems and coordination capabilities.

    Args:
        request: Agent deployment request with configuration
        db: Database session dependency
        tenant: Current tenant dependency

    Returns:
        AgentDeployResponse with deployment status and agent details

    Raises:
        HTTPException: If deployment fails or configuration is invalid
    """
    try:
        # Validate agent configuration
        if not request.agent_config or not request.agent_config.get("name"):
            raise ValueError("Agent configuration must include a name")

        service = AutonomousAgentService(db)

        # Convert schema AgentConfig to service AgentConfig
        service_config = ServiceAgentConfig(
            name=request.agent_config.get("name", "Unnamed Agent"),
            agent_type=request.agent_config.get("agent_type", "custom"),
            capabilities=request.agent_config.get("capabilities", []),
            memory_config=request.memory_config,
            coordination_rules=request.coordination_rules,
            escalation_policy=request.escalation_policy,
        )

        agent_instance = await service.deploy_agent(
            service_config, UUID(str(tenant.id))
        )

        return AgentDeployResponse(
            agent_id=agent_instance.agent_id,
            status=agent_instance.status,
            deployment_time_ms=agent_instance.deployment_time_ms,
            memory_configured=agent_instance.memory_enabled,
            coordination_enabled=agent_instance.coordination_enabled,
        )

    except ValueError as e:
        logger.error(f"Invalid agent configuration: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid configuration: {str(e)}",
        )
    except Exception as e:
        logger.error(f"Failed to deploy agent: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred during agent deployment",
        )


@router.post("/agents/{agent_id}/tasks")
async def assign_task_to_agent(
    agent_id: UUID,
    task_data: Dict[str, Any],
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant),
):
    """Assign a task to an autonomous agent."""
    try:
        service = AutonomousAgentService(db)
        task = await service.assign_task(agent_id, task_data, UUID(str(tenant.id)))

        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Failed to assign task to agent",
            )

        return {
            "task_id": task.task_id,
            "agent_id": str(agent_id),
            "status": task.status,
            "description": task.description,
            "priority": task.priority,
            "created_at": task.created_at.isoformat(),
        }

    except Exception as e:
        logger.error(f"Failed to assign task: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to assign task: {str(e)}",
        )


@router.get("/agents/memory")
async def get_agent_memory(
    agent_id: UUID = Query(..., description="Agent ID to get memory for"),
    context_key: Optional[str] = Query(None, description="Filter by context key"),
    limit: int = Query(50, description="Maximum memories to return"),
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant),
):
    """Get agent memory entries."""
    try:
        service = AutonomousAgentService(db)
        memories = await service.get_agent_memory(
            agent_id=agent_id,
            context_key=context_key,
            limit=limit,
        )

        return {
            "memories": memories,
            "total": len(memories),
            "filters": {
                "agent_id": str(agent_id),
                "context_key": context_key,
                "limit": limit,
            },
        }

    except Exception as e:
        logger.error(f"Failed to get agent memory: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get memory: {str(e)}",
        )


@router.get("/agents/coordination")
async def get_agent_coordination(
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant),
):
    """Get agent coordination status and metrics."""
    try:
        # Get active agents for this tenant
        from app.models.agent import Agent, AgentStatus

        active_agents = (
            db.query(Agent)
            .filter(Agent.user_id == tenant.id, Agent.status == AgentStatus.ACTIVE)
            .all()
        )

        return {
            "coordination_status": "active" if active_agents else "inactive",
            "active_agents": len(active_agents),
            "agents": [
                {
                    "id": str(agent.id),
                    "name": agent.name,
                    "type": agent.type.value,
                    "capabilities": agent.capabilities,
                    "status": agent.status.value,
                }
                for agent in active_agents
            ],
            "last_updated": (
                active_agents[0].updated_at.isoformat() if active_agents else None
            ),
        }

    except Exception as e:
        logger.error(f"Failed to get coordination status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get coordination: {str(e)}",
        )
