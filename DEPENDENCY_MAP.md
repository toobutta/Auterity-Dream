# Dependency Mapping & Architecture Documentation

## Overview
This document provides a comprehensive mapping of dependencies, architecture patterns, and integration points within the Auterity AI Platform, following the recent schema consolidation and service layer improvements.

## Architecture Summary

### Core Components
The platform follows a layered architecture pattern:

```
┌─────────────────────────────────────────┐
│            API Layer                    │
│  (FastAPI Endpoints - Type Annotated)  │
├─────────────────────────────────────────┤
│           Service Layer                 │
│   (Business Logic - Schema Aligned)    │
├─────────────────────────────────────────┤
│           Schema Layer                  │
│    (Pydantic Models - Consolidated)    │
├─────────────────────────────────────────┤
│           Database Layer                │
│      (SQLAlchemy Models - ORM)         │
└─────────────────────────────────────────┘
```

## Schema Architecture

### Consolidated Schema Structure
All schemas are centralized in `backend/app/schemas/auterity_expansion.py` with consistent patterns:

#### Base Schema Pattern
```python
class EntityBase(BaseModel):
    """Base schema with common fields and validation."""
    # Common fields and validation rules
    
class EntityCreate(EntityBase):
    """Schema for creating new entities."""
    # Inherits from base, no additional fields typically
    
class EntityUpdate(BaseModel):
    """Schema for updating entities."""
    # All fields optional for partial updates
    
class EntityResponse(EntityBase):
    """Schema for API responses."""
    # Includes database fields (id, created_at, etc.)
    model_config = ConfigDict(from_attributes=True)
```

#### Schema Categories

1. **Triage Schemas**
   - `TriageRuleBase`, `TriageRuleCreate`, `TriageRuleUpdate`, `TriageRuleResponse`
   - `TriageRequest`, `TriageResponse`
   - `TriageResultBase`, `TriageResultCreate`, `TriageResultResponse`

2. **Vector & Similarity Schemas**
   - `VectorEmbeddingBase`, `VectorEmbeddingCreate`, `VectorEmbeddingResponse`
   - `SimilarityResult`, `SimilaritySearchRequest`, `SimilaritySearchResponse`

3. **Integration Schemas**
   - `IntegrationBase`, `IntegrationCreate`, `IntegrationUpdate`, `IntegrationResponse`
   - `IntegrationWebhookBase`, `IntegrationWebhookCreate`, `IntegrationWebhookResponse`
   - `IntegrationSyncRequest`, `IntegrationSyncResponse`

4. **Channel Trigger Schemas**
   - `ChannelTriggerBase`, `ChannelTriggerCreate`, `ChannelTriggerUpdate`, `ChannelTriggerResponse`
   - `ChannelTriggerRequest` (Fixed broken schema definition)

5. **Custom Model Schemas**
   - `CustomModelBase`, `CustomModelCreate`, `CustomModelUpdate`, `CustomModelResponse`
   - `CustomModelHealthCheck`
   - **Note**: Uses aliases to avoid Pydantic namespace conflicts (`model_name` → `name`)

6. **Agent & Memory Schemas**
   - `AgentMemoryBase`, `AgentMemoryCreate`, `AgentMemoryResponse`
   - `AgentDeployRequest`, `AgentDeployResponse`
   - `ExecutionMetricBase`, `ExecutionMetricCreate`, `ExecutionMetricResponse`

7. **Live Insights Schemas**
   - `LiveInsightsRequest`, `LiveInsightsResponse`

### Key Schema Improvements
- ✅ Fixed broken `ChannelTriggerResponse` class definition
- ✅ Resolved Pydantic v2 namespace warnings with proper field aliases
- ✅ Modernized `Config` classes to `ConfigDict` pattern
- ✅ Added common mixins for reusable field patterns
- ✅ Consistent validation patterns across all schemas

## Service Layer Architecture

### Service Structure
Services provide business logic and act as intermediaries between API and database layers:

#### Core Services

1. **SmartTriageService** (`app/services/smart_triage_service.py`)
   - **Purpose**: AI-powered content triage and routing
   - **Key Methods**:
     - `triage_input()` → `TriageDecision`
     - `create_triage_rule()` → `TriageRule`
     - `get_triage_accuracy()` → `Dict[str, Any]`
   - **Dependencies**: `AIService`, `VectorService`
   - **Schema Compatibility**: Includes `to_dict()` for seamless API integration

2. **VectorDuplicateService** (`app/services/vector_duplicate_service.py`)
   - **Purpose**: Vector-based similarity detection and duplicate prevention
   - **Key Methods**:
     - `find_similar_items()` → `List[SimilarityResult]`
     - `create_embedding()` → `Optional[VectorEmbedding]`
     - `get_similarity_clusters()` → cluster data
   - **Dependencies**: `AIService`
   - **Schema Compatibility**: `SimilarityResult` class with `to_dict()` method

3. **AutonomousAgentService** (`app/services/autonomous_agent_service.py`)
   - **Purpose**: Management of autonomous AI agents with memory and coordination
   - **Key Methods**:
     - `deploy_agent()` → `AgentInstance`
     - `assign_task()` → `TaskAssignment`
     - `get_agent_memory()` → memory data
   - **Dependencies**: `AIService`, `VectorService`
   - **Schema Compatibility**: Custom classes compatible with deployment schemas

### Service Layer Improvements
- ✅ Enhanced type hints with complete parameter and return annotations
- ✅ Comprehensive docstrings for all public methods
- ✅ Added `to_dict()` methods for schema compatibility
- ✅ Improved error handling with specific exception types
- ✅ Maintained backward compatibility while aligning with schemas

## API Layer Architecture

### Endpoint Structure
API endpoints in `backend/app/api/auterity_expansion_fixed.py` follow consistent patterns:

#### Endpoint Pattern
```python
@router.post("/endpoint", response_model=ResponseSchema)
async def endpoint_function(
    request: RequestSchema,
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant),
) -> ResponseSchema:
    """Comprehensive docstring with Args, Returns, Raises."""
    try:
        # Input validation
        if not request.field:
            raise ValueError("Validation message")
        
        # Service interaction
        service = ServiceClass(db)
        result = await service.method(...)
        
        # Schema conversion using to_dict()
        return ResponseSchema(**result.to_dict())
        
    except ValueError as e:
        # Handle validation errors with 400 status
        raise HTTPException(status_code=400, detail=f"Invalid request: {e}")
    except Exception as e:
        # Handle general errors with 500 status
        raise HTTPException(status_code=500, detail="Internal server error occurred")
```

#### Key API Endpoints

1. **Triage Endpoints**
   - `POST /triage` - Process content through triage system
   - `POST /triage/rules` - Create new triage rules
   - `GET /triage/rules` - List tenant triage rules
   - `GET /triage/accuracy` - Get accuracy metrics

2. **Vector Similarity Endpoints**
   - `POST /similarity/search` - Search for similar items
   - `POST /embeddings` - Create vector embeddings
   - `GET /embeddings/clusters` - Get similarity clusters

3. **Agent Management Endpoints**
   - `POST /agents/deploy` - Deploy new autonomous agents
   - `POST /agents/{agent_id}/tasks` - Assign tasks to agents
   - `GET /agents/memory` - Retrieve agent memory
   - `GET /agents/coordination` - Get coordination status

### API Layer Improvements
- ✅ Enhanced error handling with proper HTTP status codes
- ✅ Input validation with meaningful error messages
- ✅ Comprehensive docstrings with Args/Returns/Raises
- ✅ Type annotations for all endpoint functions
- ✅ Simplified service-to-schema conversion using `to_dict()`

## External Dependencies

### Core Framework Dependencies
```python
# Web Framework
fastapi==0.104.1          # Modern async web framework
uvicorn[standard]==0.24.0  # ASGI server

# Database & ORM
sqlalchemy==2.0.23        # SQL toolkit and ORM
alembic==1.12.1           # Database migrations
psycopg2-binary==2.9.9    # PostgreSQL adapter

# Data Validation
pydantic==2.7.4           # Data validation using Python type annotations
pydantic-settings==2.0.3  # Settings management
```

### AI & ML Dependencies
```python
# AI Services
openai==1.3.7             # OpenAI API client
litellm==1.10.1           # Universal LLM interface

# ML Frameworks
langchain==0.3.27         # LLM application framework
haystack-ai==2.6.0        # NLP framework
llama-index==0.9.45       # LlamaIndex for RAG

# Vector Operations
sentence-transformers==2.2.2  # Sentence embeddings
qdrant-client==1.7.0      # Vector database client
```

### Infrastructure Dependencies
```python
# Task Queue & Messaging
celery==5.3.4             # Distributed task queue
kafka-python==2.0.2       # Apache Kafka client
confluent-kafka==2.3.0    # Confluent Kafka client

# Caching & Storage
redis==5.0.1              # In-memory data store
minio==7.2.0              # Object storage client

# Monitoring & Observability
prometheus-client==0.19.0  # Metrics collection
opentelemetry-api==1.21.0  # Observability framework
```

### Development Dependencies
```python
# Code Quality
black==23.11.0            # Code formatting
flake8==6.1.0             # Code linting
isort==5.12.0             # Import sorting
mypy==1.7.1               # Static type checking

# Testing
pytest==7.4.3            # Testing framework
pytest-asyncio==0.21.1   # Async testing support
pytest-cov==4.1.0        # Coverage reporting
httpx==0.25.2             # HTTP client for testing
```

## Internal Dependencies

### Service Dependencies
```python
# AI Service Dependencies
SmartTriageService → AIService, VectorService
VectorDuplicateService → AIService
AutonomousAgentService → AIService, VectorService

# Database Dependencies
All Services → SQLAlchemy Session
All Models → SQLAlchemy Base
All Schemas → Pydantic BaseModel
```

### Schema Dependencies
```python
# Schema Imports
API Layer → Consolidated Schemas (auterity_expansion.py)
Service Layer → Database Models + Schema Compatibility
Database Layer → SQLAlchemy Models
```

### Cross-Module Dependencies
```python
# API → Service → Database Flow
auterity_expansion_fixed.py → SmartTriageService → TriageRule Model
auterity_expansion_fixed.py → VectorDuplicateService → VectorEmbedding Model
auterity_expansion_fixed.py → AutonomousAgentService → Agent/AgentMemory Models
```

## Configuration & Environment

### Environment Variables
```bash
# Database Configuration
DATABASE_URL=postgresql://user:pass@host:port/db
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=10

# AI Service Configuration
OPENAI_API_KEY=sk-...
LITELLM_PROVIDER=openai
AI_MODEL_DEFAULT=gpt-4

# Vector Database Configuration
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=...

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# Monitoring Configuration
PROMETHEUS_PORT=8000
OTEL_EXPORTER_JAEGER_ENDPOINT=http://localhost:14268/api/traces
```

### Key Configuration Files
- `backend/requirements.txt` - Production dependencies
- `backend/requirements-dev.txt` - Development dependencies
- `backend/pyproject.toml` - Project metadata and tool configuration
- `backend/alembic.ini` - Database migration configuration
- `backend/.flake8` - Linting configuration

## Testing Strategy

### Test Files Created
1. `test_direct_schema.py` - Schema validation and compatibility tests
2. `test_service_improvements.py` - Service layer integration tests
3. `test_api_improvements.py` - API endpoint pattern validation

### Testing Patterns
```python
# Schema Testing
def test_schema_validation():
    schema = SchemaClass(**test_data)
    assert schema.field == expected_value

# Service Testing
def test_service_method():
    result = service.method(**params)
    assert result.to_dict()["field"] == expected

# API Testing
def test_api_integration():
    # Mock service → test schema conversion
    mock_result = MockServiceResult()
    schema_dict = mock_result.to_dict()
    response = ResponseSchema(**schema_dict)
```

## Migration & Deployment Notes

### Schema Migration Strategy
1. ✅ **Backward Compatibility**: All changes maintain existing API contracts
2. ✅ **Gradual Adoption**: Services can adopt `to_dict()` methods incrementally
3. ✅ **Validation**: Comprehensive test coverage ensures stability

### Deployment Considerations
- No breaking changes to existing API endpoints
- Service layer improvements are internal and transparent
- Schema consolidation reduces complexity and maintenance overhead
- Enhanced error handling provides better debugging capabilities

## Future Improvements

### Recommended Next Steps
1. **Enhanced Monitoring**: Add more detailed metrics collection
2. **API Versioning**: Implement versioning strategy for future changes
3. **Performance Optimization**: Add caching layers for frequently accessed data
4. **Security Enhancements**: Implement rate limiting and advanced authentication
5. **Documentation**: Auto-generate API documentation from enhanced docstrings

### Technical Debt Addressed
- ✅ Fixed broken schema definitions
- ✅ Resolved Pydantic namespace warnings
- ✅ Improved type annotations throughout codebase
- ✅ Standardized error handling patterns
- ✅ Enhanced documentation coverage

---

*This document reflects the current state of the codebase after the dependency mapping and refactoring initiative. All improvements maintain backward compatibility while enhancing code quality, maintainability, and developer experience.*