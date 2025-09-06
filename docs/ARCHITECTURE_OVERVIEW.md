# Architecture Overview

## Three-System Integration Architecture

Auterity is built on a **three-system architecture** that provides comprehensive AI-powered workflow automation:

### **1. AutoMatrix (Core Engine)**
- **Purpose**: Visual workflow automation platform with enterprise features
- **Components**: Frontend UI, Workflow Studio, API Gateway, Core Services
- **Technology**: React, TypeScript, FastAPI, PostgreSQL
- **Ports**: 3000 (Frontend), 8000 (API)

### **2. RelayCore (AI Router)**  
- **Purpose**: Intelligent AI request routing and cost optimization
- **Components**: Model routing, performance monitoring, cost optimization
- **Technology**: Python, FastAPI, AI SDK, Redis
- **Port**: 8001

### **3. NeuroWeaver (Model Management)**
- **Purpose**: Specialized AI model training, fine-tuning, and deployment
- **Components**: Model registry, training pipelines, custom model serving
- **Technology**: Python, FastAPI, PyTorch, ML Pipeline
- **Port**: 8004

## Unified Platform Architecture

```
Auterity Unified AI Platform
├── 🎨 Frontend Applications (Port: 3000)
│   ├── Main Application (React/TypeScript)
│   ├── Workflow Studio (Integrated Visual Designer)
│   └── Chrome DevTools Integration
├── 🔧 Backend Services
│   ├── API Gateway (apps/api - Port: 8000)
│   ├── RelayCore AI Router (systems/relaycore - Port: 8001)
│   ├── LangGraph Service (systems/langgraph - Port: 8002)
│   ├── vLLM Service (systems/vllm - Port: 8001)
│   ├── CrewAI Service (systems/crewai - Port: 8003)
│   ├── NeuroWeaver Platform (systems/neuroweaver - Port: 8004)
│   ├── MCP Orchestrator (systems/mcp - Port: 8005)
│   ├── n8n AI Enhancements (systems/n8n-ai-enhancements - Port: 8006)
│   └── Integration Layer (systems/integration - Port: 8007)
├── 📦 Applications
│   ├── API Application (apps/api - Port: 8000)
│   └── Workflow Studio (apps/workflow-studio - Port: 3001)
├── 📦 Shared Libraries
│   ├── Design System (packages/design-system)
│   ├── Workflow Contracts (packages/workflow-contracts)
│   ├── Shared UI (packages/shared-ui)
│   └── Scaffolding (packages/scaffolding)
└── 🛠️ Infrastructure (30+ Services)
    ├── Databases: PostgreSQL, Redis, Weaviate, Kafka
    ├── Message Queue: RabbitMQ
    ├── Monitoring: Prometheus, Grafana, Jaeger, Loki
    ├── Security: Vault, Kong Gateway
    ├── AI/ML: MLflow, Celery Workers
    ├── Development: MailHog, Puppeteer, pgAdmin
    └── Networking: AlertManager, Node Exporter
```

## Integrated Services Overview

| Service | Location | Technology | Purpose | Port |
|---------|----------|------------|---------|------|
| **Frontend** | `frontend/` | React 18, TypeScript, Vite | Main application UI | 3000 |
| **Workflow Studio** | `apps/workflow-studio/` | React Flow, PixiJS, AI SDK | Visual workflow designer | 3001 |
| **API Services** | `apps/api/` | Node.js, Express, TypeScript | RESTful API endpoints | 8000 |
| **RelayCore** | `systems/relaycore/` | Python, FastAPI, AI SDK | AI model routing & management | 8001 |
| **LangGraph Service** | `systems/langgraph/` | Python, FastAPI, LangGraph | AI-powered workflow orchestration | 8002 |
| **vLLM Service** | `systems/vllm/` | Python, FastAPI, vLLM | High-throughput AI model serving | 8001 |
| **CrewAI Service** | `systems/crewai/` | Python, FastAPI, CrewAI | Multi-agent collaborative systems | 8003 |
| **NeuroWeaver** | `systems/neuroweaver/` | Python, FastAPI, PyTorch | Model specialization platform | 8004 |
| **MCP Orchestrator** | `systems/mcp/` | TypeScript, Node.js | Model Context Protocol orchestrator | 8005 |
| **n8n AI Enhancements** | `systems/n8n-ai-enhancements/` | Node.js, n8n, AI SDK | AI-enhanced workflow platform | 8006 |
| **Integration Layer** | `systems/integration/` | Python, FastAPI, RabbitMQ | Cross-system integration | 8007 |
| **Kong Gateway** | `infrastructure/docker/` | Kong, Lua | API gateway & load balancing | 8000 |
| **PostgreSQL** | `infrastructure/docker/` | PostgreSQL | Primary database | 5432 |
| **Redis** | `infrastructure/docker/` | Redis | Caching & sessions | 6379 |
| **RabbitMQ** | `infrastructure/docker/` | RabbitMQ | Message queuing | 5672 |
| **Kafka** | `infrastructure/docker/` | Kafka, Zookeeper | Event streaming | 9092 |
| **Weaviate** | `infrastructure/docker/` | Weaviate | Vector database | 8080 |
| **MLflow** | `infrastructure/docker/` | MLflow | ML experiment tracking | 5000 |
| **Prometheus** | `infrastructure/docker/` | Prometheus | Metrics collection | 9090 |
| **Grafana** | `infrastructure/docker/` | Grafana | Monitoring dashboards | 3000 |
| **Jaeger** | `infrastructure/docker/` | Jaeger | Distributed tracing | 16686 |
| **Loki** | `infrastructure/docker/` | Loki | Log aggregation | 3100 |
| **Vault** | `infrastructure/docker/` | HashiCorp Vault | Secrets management | 8200 |
| **Celery Worker** | `infrastructure/docker/` | Python, Celery | Background task processing | - |
| **Design System** | `packages/design-system/` | React, TypeScript, CSS | Shared UI components | - |
| **Workflow Contracts** | `packages/workflow-contracts/` | TypeScript | Type-safe workflow definitions | - |
| **Shared UI** | `packages/shared-ui/` | React, TypeScript | Common UI components | - |
| **Scaffolding** | `packages/scaffolding/` | TypeScript | Project scaffolding tools | - |

## Data Flow Architecture

```mermaid
User Request
    ↓
Frontend Application (Port: 3000)
    ↓
API Gateway (Port: 8000)
    ↓
┌─────────────────────────────────────┐
│         Service Routing             │
├─────────────────────────────────────┤
│ • Workflow Studio → apps/workflow-studio │
│ • AI Services → systems/relaycore       │
│ • Data Services → apps/api              │
└─────────────────────────────────────┘
    ↓
Infrastructure Layer
├── PostgreSQL (Data Storage)
├── Redis (Caching)
├── MinIO (File Storage)
└── Kafka (Event Streaming)
```

## Service Layers

### **Presentation Layer**
- **Main Frontend** (`frontend/`): React/TypeScript application with integrated Workflow Studio
- **Workflow Studio UI** (`apps/workflow-studio/`): Visual workflow designer with drag-and-drop interface
- **Chrome DevTools Integration**: Complete debugging and performance monitoring suite

### **Application Layer**
- **API Gateway** (`apps/api/`): Centralized API management and routing
- **Workflow Engine** (`apps/workflow-studio/`): Workflow execution and management
- **RelayCore** (`systems/relaycore/`): AI model orchestration and routing

### **Data Layer**
- **PostgreSQL** (Port: 5432): Primary relational database
- **Redis** (Port: 6379): Caching and session management
- **MinIO** (Port: 9000): Object storage for files and assets
- **Kafka** (Port: 9092): Event streaming and messaging

### **Infrastructure Layer**
- **Kong Gateway** (Port: 8000): API gateway and load balancing
- **PostgreSQL** (Port: 5432): Primary relational database
- **Redis** (Port: 6379): High-performance caching and session storage
- **RabbitMQ** (Port: 5672): Message queuing for asynchronous processing
- **Kafka** (Port: 9092): Event streaming and real-time data processing
- **Zookeeper** (Port: 2181): Coordination service for Kafka cluster
- **Weaviate** (Port: 8080): Vector database for AI embeddings and semantic search
- **MLflow** (Port: 5000): Machine learning experiment tracking and model registry
- **Vault** (Port: 8200): Secrets management and encryption
- **Prometheus** (Port: 9090): Metrics collection and monitoring
- **Grafana** (Port: 3000): Visualization and monitoring dashboards
- **Jaeger** (Port: 16686): Distributed tracing and performance monitoring
- **Loki** (Port: 3100): Log aggregation and analysis
- **Celery Worker**: Background task processing and job queues
- **Celery Beat**: Scheduled task management
- **Puppeteer**: Headless browser automation for testing and scraping
- **MailHog** (Port: 1025/8025): Email testing and development
- **AlertManager** (Port: 9093): Alert management and notification routing
- **Node Exporter** (Port: 9100): System metrics collection
- **pgAdmin** (Port: 5050): PostgreSQL database administration
- **Docker Compose**: Container orchestration for all services

## Integration Points

### Workflow Studio Integration
- **Location**: Integrated as `apps/workflow-studio/` in unified platform
- **Access**: Available at `/workflow-studio` route in main application
- **Technology**: React Flow for visual workflow design
- **AI Integration**: Vercel AI SDK for multi-model support

### Chrome DevTools Integration
- **Global API**: Available via `window.auterity.devtools`
- **Components**: 7 monitoring modules (Web Vitals, Network, Memory, Console, Accessibility, Security)
- **Integration**: Built into main frontend application

### AI Service Integration
- **RelayCore**: Handles AI model routing and performance optimization
- **LangGraph Service**: AI-powered workflow orchestration with intelligent decision making
- **vLLM Service**: High-throughput AI model serving with GPU acceleration
- **Multi-Model Support**: OpenAI, Anthropic, Google, Azure AI, and custom vLLM models
- **Load Balancing**: Intelligent routing based on model performance and cost

### LangGraph Service Integration
- **Location**: `systems/langgraph/` (Port: 8002)
- **Technology**: Python, FastAPI, LangGraph, Redis
- **Features**: AI-driven workflow execution, dynamic routing, multi-provider AI integration
- **Integration**: Works with n8n, Temporal, and Celery for enterprise workflow automation

### vLLM Service Integration
- **Location**: `systems/vllm/` (Port: 8001)
- **Technology**: Python, FastAPI, vLLM, PyTorch
- **Features**: GPU-accelerated inference, up to 24x faster than CPU, intelligent caching
- **Integration**: Supports multiple AI models with automatic scaling and monitoring

### CrewAI Service Integration
- **Location**: `systems/crewai/` (Port: 8003)
- **Technology**: Python, FastAPI, CrewAI framework
- **Features**: Multi-agent collaborative systems, hierarchical/democratic modes, role-based agents, dynamic task assignment
- **Purpose**: Advanced multi-agent workflows for complex problem-solving and collaborative AI tasks
- **Integration**: Works with LangGraph for workflow orchestration and RelayCore for model routing

### NeuroWeaver Platform Integration
- **Location**: `systems/neuroweaver/` (Port: 8004)
- **Technology**: Python, FastAPI, PyTorch, specialized ML frameworks
- **Features**: Model specialization platform, fine-tuning pipeline, model registry, performance monitoring
- **Domain**: Automotive industry focus with specialized models for vehicle diagnostics, autonomous systems, and manufacturing
- **Integration**: Connects with vLLM for inference, MLflow for experiment tracking, and Weaviate for vector storage

### MCP Orchestrator Integration
- **Location**: `systems/mcp/` (Port: 8005)
- **Technology**: TypeScript, Node.js, Model Context Protocol
- **Features**: AI model management, context orchestration, multi-model coordination
- **Purpose**: Unified interface for managing different AI models and their contexts
- **Integration**: Bridges various AI services and provides consistent API for model interactions

### n8n AI Enhancements Integration
- **Location**: `systems/n8n-ai-enhancements/` (Port: 8006)
- **Technology**: Node.js, n8n workflow engine, AI SDK integrations
- **Features**: AI-enhanced workflow platform, intelligent analysis, smart node suggestions, automated workflow generation
- **Purpose**: Enhanced workflow automation with AI-powered decision making and optimization
- **Integration**: Extends n8n with AI capabilities, connects to all AI services in the platform

### Integration Layer
- **Location**: `systems/integration/` (Port: 8007)
- **Technology**: Python, FastAPI, RabbitMQ, Redis
- **Features**: Unified authentication, cross-system messaging, distributed caching, service discovery
- **Purpose**: Provides seamless integration between all platform services
- **Integration**: Acts as the central hub for inter-service communication and data flow

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication across all services
- **Role-Based Access Control**: Granular permissions for users and services
- **API Gateway Security**: Centralized security policies via Kong

### Data Protection
- **Encryption**: Data encryption at rest and in transit
- **Secrets Management**: Secure credential storage and rotation
- **Audit Logging**: Complete audit trail for all operations

### Network Security
- **CORS Protection**: Configured for allowed origins
- **Rate Limiting**: DDoS protection and abuse prevention
- **SSL/TLS**: End-to-end encryption for all communications

## Deployment Architecture

### Development Environment
```bash
npm run dev  # Starts all services via Docker Compose
```

### Production Environment
```bash
npm run prod  # Production deployment with optimizations
```

### Service Scaling
- **Horizontal Scaling**: Services can be scaled independently
- **Load Balancing**: Kong Gateway distributes traffic
- **Health Checks**: Automated service health monitoring

## Monitoring & Observability

### Application Monitoring
- **Chrome DevTools**: Integrated performance monitoring
- **OpenTelemetry**: Distributed tracing and metrics
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization and dashboards

### Infrastructure Monitoring
- **Docker Health Checks**: Container-level monitoring
- **Resource Usage**: CPU, memory, and disk monitoring
- **Log Aggregation**: Centralized logging with Loki

## Development Workflow

### Local Development
1. **Clone Repository**: Single repository for entire platform
2. **Install Dependencies**: `npm install` (handles all workspaces)
3. **Start Services**: `npm run dev`
4. **Access Applications**: All services available on localhost

### Code Organization
- **Monorepo Structure**: All services in single repository
- **Workspace Management**: npm workspaces for dependency management
- **Shared Libraries**: Common code in `packages/` and `shared/`

This unified architecture provides a scalable, maintainable, and feature-rich platform for AI-powered workflow automation in the automotive industry.
