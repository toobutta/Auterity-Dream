"""Tests for schema consolidation and validation."""
import pytest
import sys
import os
from datetime import datetime
from decimal import Decimal
from uuid import uuid4
from typing import Any, Dict

# Add the app path to import directly
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))

# Import schemas directly from the module
from app.schemas.auterity_expansion import (
    # Triage schemas
    TriageRuleBase, TriageRuleCreate, TriageRuleUpdate, TriageRuleResponse,
    TriageRequest, TriageResponse,
    # Vector schemas
    VectorEmbeddingBase, VectorEmbeddingCreate, VectorEmbeddingResponse,
    SimilarityResult, SimilaritySearchRequest, SimilaritySearchResponse,
    # Integration schemas
    IntegrationBase, IntegrationCreate, IntegrationUpdate, IntegrationResponse,
    # Channel trigger schemas
    ChannelTriggerBase, ChannelTriggerCreate, ChannelTriggerUpdate, ChannelTriggerResponse,
    ChannelTriggerRequest,  # Fixed schema that was broken
    # Custom model schemas (with namespace fixes)
    CustomModelBase, CustomModelCreate, CustomModelUpdate, CustomModelResponse,
    CustomModelHealthCheck,
    # Agent schemas
    AgentMemoryBase, AgentMemoryCreate, AgentMemoryResponse,
    AgentDeployRequest, AgentDeployResponse,
    # Execution schemas  
    ExecutionMetricBase, ExecutionMetricCreate, ExecutionMetricResponse,
    # Live insights
    LiveInsightsRequest, LiveInsightsResponse,
)


class TestSchemaConsolidation:
    """Test suite for schema consolidation changes."""

    def test_triage_schemas_validation(self):
        """Test triage schema validation and consistency."""
        # Test base schema
        triage_data = {
            "name": "Test Rule",
            "rule_type": "ml",
            "conditions": {"field": "value"},
            "routing_logic": {"action": "route_to_team_a"},
            "confidence_threshold": Decimal("0.8"),
            "priority": 5,
            "is_active": True
        }
        
        rule_base = TriageRuleBase(**triage_data)
        assert rule_base.name == "Test Rule"
        assert rule_base.confidence_threshold == Decimal("0.8")
        
        # Test create schema (inherits from base)
        rule_create = TriageRuleCreate(**triage_data)
        assert rule_create.name == "Test Rule"
        
        # Test update schema (all optional)
        rule_update = TriageRuleUpdate(name="Updated Rule")
        assert rule_update.name == "Updated Rule"
        assert rule_update.priority is None

    def test_custom_model_namespace_fixes(self):
        """Test that custom model schemas handle model namespace correctly."""
        model_data = {
            "model_name": "test-model",
            "endpoint_url": "https://api.example.com/model",
            "model_type": "llm",
            "config": {"temperature": 0.7},
            "version": "1.0.0"
        }
        
        # Test that aliases work correctly
        model_base = CustomModelBase(**model_data)
        assert model_base.name == "test-model"  # aliased from model_name
        assert model_base.type == "llm"  # aliased from model_type
        
        # Test health check with namespace fixes
        health_data = {
            "model_id": uuid4(),
            "endpoint_url": "https://api.example.com/model",
            "model_type": "llm",
            "status": "healthy"
        }
        
        health_check = CustomModelHealthCheck(**health_data)
        assert health_check.id is not None  # aliased from model_id
        assert health_check.type == "llm"  # aliased from model_type

    def test_execution_metric_namespace_fixes(self):
        """Test execution metric schema namespace fixes."""
        metric_data = {
            "step_name": "data_processing",
            "duration_ms": 1500,
            "status": "completed",
            "model_confidence": Decimal("0.95")
        }
        
        metric = ExecutionMetricBase(**metric_data)
        assert metric.step_name == "data_processing"
        assert metric.confidence == Decimal("0.95")  # aliased from model_confidence

    def test_channel_trigger_response_fix(self):
        """Test that the fixed ChannelTriggerResponse schema works correctly."""
        # This schema was broken and has been fixed
        response_data = {
            "triggered": True,
            "workflows_triggered": ["workflow_1", "workflow_2"], 
            "processing_time_ms": 250,
            "errors": []
        }
        
        response = ChannelTriggerResponse(**response_data)
        assert response.triggered is True
        assert len(response.workflows_triggered) == 2
        assert response.processing_time_ms == 250
        assert response.errors == []

    def test_schema_consistency_patterns(self):
        """Test that schemas follow consistent patterns."""
        # Test that response schemas have consistent database fields
        response_schemas = [
            TriageRuleResponse,
            VectorEmbeddingResponse, 
            IntegrationResponse,
            ChannelTriggerResponse,
            CustomModelResponse,
            AgentMemoryResponse,
            ExecutionMetricResponse,
        ]
        
        for schema_class in response_schemas:
            # Check that response schemas have id field
            assert 'id' in schema_class.model_fields
            # Check that most have tenant_id (except some like ExecutionMetricResponse)
            if schema_class != ExecutionMetricResponse:
                assert 'tenant_id' in schema_class.model_fields or 'agent_id' in schema_class.model_fields

    def test_vector_similarity_schemas(self):
        """Test vector and similarity schema validation."""
        # Test vector embedding
        embedding_data = {
            "item_type": "workflow",
            "item_id": uuid4(),
            "content_hash": "abc123",
            "embedding_vector": [0.1, 0.2, 0.3],
            "metadata": {"source": "test"}
        }
        
        embedding = VectorEmbeddingBase(**embedding_data)
        assert embedding.item_type == "workflow"
        assert len(embedding.embedding_vector) == 3
        
        # Test similarity search
        search_data = {
            "content": "test content",
            "item_type": "ticket",
            "threshold": 0.85,
            "limit": 5
        }
        
        search_request = SimilaritySearchRequest(**search_data)
        assert search_request.threshold == 0.85
        assert search_request.limit == 5

    def test_integration_schemas(self):
        """Test integration schema validation."""
        integration_data = {
            "provider": "slack",
            "name": "Slack Integration",
            "config": {"webhook_url": "https://hooks.slack.com/..."},
            "sync_interval_minutes": 30
        }
        
        integration = IntegrationBase(**integration_data)
        assert integration.provider == "slack"
        assert integration.sync_interval_minutes == 30

    def test_agent_schemas(self):
        """Test agent-related schema validation."""
        # Test agent memory
        memory_data = {
            "context_hash": "hash123",
            "memory_data": {"key": "value"},
            "importance_score": Decimal("0.7")
        }
        
        memory = AgentMemoryBase(**memory_data)
        assert memory.context_hash == "hash123"
        assert memory.importance_score == Decimal("0.7")
        
        # Test agent deployment
        deploy_data = {
            "agent_config": {"name": "Test Agent", "type": "assistant"},
            "memory_config": {"max_memories": 1000},
            "coordination_rules": {"team_coordination": True}
        }
        
        deploy_request = AgentDeployRequest(**deploy_data)
        assert "name" in deploy_request.agent_config
        assert deploy_request.memory_config is not None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])