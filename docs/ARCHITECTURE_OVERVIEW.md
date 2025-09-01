# Architecture Overview

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
│   └── Workflow Engine (apps/workflow-studio)
├── 📦 Shared Libraries
│   ├── Design System (packages/design-system)
│   ├── Workflow Contracts (packages/workflow-contracts)
│   └── Utilities (shared/)
└── 🛠️ Infrastructure
    ├── PostgreSQL (Port: 5432)
    ├── Redis (Port: 6379)
    ├── MinIO (Port: 9000)
    ├── Kong Gateway (Port: 8000)
    └── Monitoring Stack
```

## Integrated Services Overview

| Service | Location | Technology | Purpose |
|---------|----------|------------|---------|
| **Frontend** | `frontend/` | React 18, TypeScript, Vite | Main application UI |
| **Workflow Studio** | `apps/workflow-studio/` | React Flow, PixiJS, AI SDK | Visual workflow designer |
| **API Services** | `apps/api/` | Node.js, Express, TypeScript | RESTful API endpoints |
| **RelayCore** | `systems/relaycore/` | Python, FastAPI, AI SDK | AI model routing & management |
| **Design System** | `packages/design-system/` | React, TypeScript, CSS | Shared UI components |
| **Workflow Contracts** | `packages/workflow-contracts/` | TypeScript | Type-safe workflow definitions |

## Data Flow Architecture

```
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
- **Docker Compose**: Container orchestration
- **Monitoring Stack**: Prometheus, Grafana, Jaeger, Loki

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
- **Multi-Model Support**: OpenAI, Anthropic, Google, Azure AI
- **Load Balancing**: Intelligent routing based on model performance and cost

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
