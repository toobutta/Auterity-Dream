# Auterity Unified AI Platform

[![Production Ready](<https://img.shields.io/badge/Status-Production%20Ready%20(90%25)-brightgreen>)](https://github.com/toobutta/auterity-error-iq)
[![Services](https://img.shields.io/badge/Services-26%20Integrated-blue)](#services)
[![Architecture](https://img.shields.io/badge/Architecture-Three--System%20Integration-purple)](#architecture)
[![Documentation](https://img.shields.io/badge/Documentation-Comprehensive-orange)](#documentation)

## 🎯 Enterprise AI Platform with Three-System Integration

**Auterity** is a **production-ready unified AI platform** featuring three integrated systems: **AutoMatrix** (workflow automation), **RelayCore** (AI routing), and **NeuroWeaver** (model management) with 26 enterprise services for intelligent operations.

### **🏗️ Three-System Architecture**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTERITY UNIFIED AI PLATFORM                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐        │
│  │   AutoMatrix    │◄──►│   RelayCore     │◄──►│ NeuroWeaver     │        │
│  │   (Core Engine) │    │   (AI Router)   │    │ (Model Mgmt)    │        │
│  │   Port: 8000    │    │   Port: 3001    │    │ Port: 3002      │        │
│  │   Python/React  │    │   Node.js/TS    │    │   Python/React  │        │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘        │
│           │                       │                       │                │
│           └───────────────────────┼───────────────────────┘                │
│                                   │                                        │
│              ┌─────────────────────────────────────┐                       │
│              │        Shared Infrastructure        │                       │
│              │   Auth • Monitoring • Database     │                       │
│              └─────────────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔧 Recent Architecture Improvements

**Latest Enhancement: Dependency Mapping & Refactoring Initiative**

We've completed a comprehensive refactoring of the platform's core architecture focusing on:

### ✅ Schema Consolidation & Modernization
- **Fixed Critical Issues**: Resolved broken schema definitions (ChannelTriggerResponse)
- **Namespace Resolution**: Eliminated Pydantic v2 namespace warnings with proper field aliases
- **Modern Patterns**: Updated all schemas to use `ConfigDict` instead of legacy `Config` classes
- **Consistency**: Standardized schema patterns across all 40+ models

### ✅ Service Layer Enhancement
- **Type Safety**: Added comprehensive type hints to all service methods
- **Documentation**: Enhanced docstrings with Args/Returns/Raises for 25+ service methods
- **Schema Alignment**: Implemented `to_dict()` methods for seamless API integration
- **Error Handling**: Improved exception handling with specific error types

### ✅ API Endpoint Optimization
- **Error Handling**: Proper HTTP status codes (400 for validation, 500 for server errors)
- **Input Validation**: Enhanced validation with meaningful error messages
- **Type Annotations**: Complete type safety for all endpoint functions
- **Service Integration**: Simplified service-to-schema conversion patterns

### ✅ Comprehensive Documentation
- **Architecture Overview**: Complete system architecture documentation in [DEPENDENCY_MAP.md](./DEPENDENCY_MAP.md)
- **Dependency Mapping**: Detailed mapping of all internal and external dependencies
- **Configuration Guide**: Environment variables and deployment considerations
- **Testing Strategy**: Comprehensive test coverage for all improvements

**Impact**: These improvements enhance code quality, maintainability, and developer experience while maintaining 100% backward compatibility.

## ⚡ Quick Start

Note: For AI coding agents and contributor rules, consult `.github/copilot-instructions.md` (canonical source of truth).

```bash
# Clone and deploy complete platform
git clone https://github.com/toobutta/auterity-error-iq.git
cd auterity-error-iq

# Setup environment
cp .env.example .env
# Edit .env with your API keys and configuration

# Install dependencies
npm install
cd frontend && npm install
cd ../backend && pip install -r requirements-dev.txt

# Start development environment (all 26 services)
npm run dev

# Production deployment
npm run prod
```

**🌐 Access Points:**

- **Application Dashboard**: http://localhost:3000
- **API Gateway**: http://localhost:8000
- **Kong Admin**: http://localhost:8001
- **Monitoring (Grafana)**: http://localhost:3001
- **ML Tracking (MLflow)**: http://localhost:5000
- **Tracing (Jaeger)**: http://localhost:16686

## 🏗️ System Components

### **AutoMatrix** - Core Workflow Engine (Port 8000)

- **Visual Workflow Builder**: Drag-and-drop interface with React Flow
- **Execution Engine**: Parallel processing with retry mechanisms
- **Template Library**: Pre-built workflow templates
- **Real-time Monitoring**: WebSocket-based progress tracking
- **API Integration**: RESTful API with OpenAPI documentation

### **RelayCore** - AI Request Router (Port 3001)

- **Intelligent Routing**: Cost-optimized AI model selection
- **Budget Management**: Real-time cost tracking and limits
- **Performance Analytics**: Latency and accuracy metrics
- **Multi-Provider Support**: OpenAI, Anthropic, custom models
- **Steering Rules**: Configurable routing logic

### **NeuroWeaver** - Model Management (Port 3002)

- **Custom Model Training**: Automated fine-tuning pipeline
- **Model Registry**: Centralized catalog with versioning
- **Performance Monitoring**: Model accuracy and speed tracking
- **Automotive Specialization**: Pre-built automotive AI templates
- **Deployment Automation**: One-click model deployment

## 🏗️ Service Architecture

### **Core Services** (Production Ready)

- **Authentication**: JWT, OAuth2, SSO integration
- **Database**: PostgreSQL with clustering
- **Cache**: Redis with persistence
- **Queue**: RabbitMQ + Celery workers

### **Communication Services** (Production Ready)

- **Twilio**: SMS, voice, campaigns, IVR
- **WhatsApp**: Business API, templates, interactive messages
- **Email**: SMTP integration with MailHog development server
- **Notifications**: Multi-channel (Email, Slack, SMS, WhatsApp, webhooks)

### **Automation Services** (Production Ready)

- **Playwright**: Web scraping, form automation, testing
- **Puppeteer**: Browser automation, PDF generation, screenshots
- **Workflow Engine**: Visual workflow builder with AI integration

### **AI/ML Services** (Production Ready)

- **Vector Databases**: Pinecone, Weaviate integration
- **LLM Providers**: OpenAI, Anthropic, Azure OpenAI
- **MLflow**: Experiment tracking, model registry
- **Embeddings**: Automated text embedding generation

### **Infrastructure Services** (Production Ready)

- **API Gateway**: Kong with rate limiting, CORS
- **Load Balancer**: Nginx with SSL termination
- **Monitoring**: Prometheus, Grafana, Jaeger tracing, Alertmanager
- **Logging**: Loki centralized logging with Promtail collection
- **Secrets**: HashiCorp Vault integration
- **Event Streaming**: Apache Kafka with Zookeeper
- **Object Storage**: MinIO S3-compatible storage
- **System Monitoring**: Node, Redis, Postgres exporters

## 📊 Complete Service List (26 Services)

| Service               | Type          | Status         | Port        | Description            |
| --------------------- | ------------- | -------------- | ----------- | ---------------------- |
| **kong**              | Gateway       | ✅ Production  | 8000, 8001  | API Gateway & Admin    |
| **nginx**             | Load Balancer | ✅ Production  | 80, 443     | Load Balancer & SSL    |
| **backend**           | API           | ✅ Production  | 8080        | FastAPI Backend        |
| **frontend**          | Web           | ✅ Production  | 3000        | React Frontend         |
| **postgres**          | Database      | ✅ Production  | 5432        | Primary Database       |
| **redis**             | Cache         | ✅ Production  | 6379        | Cache & Sessions       |
| **rabbitmq**          | Queue         | ✅ Production  | 5672, 15672 | Message Queue          |
| **kafka**             | Streaming     | ✅ Production  | 9092        | Event Streaming        |
| **zookeeper**         | Coordination  | ✅ Production  | 2181        | Kafka Dependency       |
| **vault**             | Secrets       | ✅ Production  | 8200        | Secrets Management     |
| **mlflow**            | ML            | ✅ Production  | 5000        | ML Experiment Tracking |
| **weaviate**          | Vector DB     | ✅ Production  | 8081        | Vector Database        |
| **puppeteer**         | Automation    | ✅ Production  | 3000        | Browser Automation     |
| **mailhog**           | Email         | ✅ Development | 1025, 8025  | SMTP Development       |
| **celery-worker**     | Workers       | ✅ Production  | -           | Task Processing        |
| **prometheus**        | Metrics       | ✅ Production  | 9090        | Metrics Collection     |
| **grafana**           | Monitoring    | ✅ Production  | 3001        | Monitoring Dashboard   |
| **alertmanager**      | Alerts        | ✅ Production  | 9093        | Alert Management       |
| **jaeger**            | Tracing       | ✅ Production  | 16686       | Distributed Tracing    |
| **loki**              | Logging       | ✅ Production  | 3100        | Log Aggregation        |
| **promtail**          | Logs          | ✅ Production  | 9080        | Log Collection         |
| **node-exporter**     | Metrics       | ✅ Production  | 9100        | System Metrics         |
| **redis-exporter**    | Metrics       | ✅ Production  | 9121        | Redis Metrics          |
| **postgres-exporter** | Metrics       | ✅ Production  | 9187        | Postgres Metrics       |
| **minio**             | Storage       | ✅ Production  | 9000, 9001  | Object Storage         |

## 🔧 Configuration

### Environment Variables

```bash
# Core Services
POSTGRES_PASSWORD=your_secure_password
REDIS_URL=redis://redis:6379
RABBITMQ_PASSWORD=your_rabbitmq_password

# AI Services
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
PINECONE_API_KEY=your_pinecone_key

# Communication Services
TWILIO_ACCOUNT_SID=your_twilio_sid
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token

# Infrastructure
VAULT_TOKEN=your_vault_token
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
```

### Service Health Checks

```bash
# Check all services
curl http://localhost:8001/status

# Individual service health
curl http://localhost:8080/api/health (Backend)
curl http://localhost:8081/v1/meta (Weaviate)
curl http://localhost:5000/health (MLflow)
curl http://localhost:8200/v1/sys/health (Vault)
```

## 🚀 Deployment Options

### **Development**

```bash
docker-compose -f docker-compose.unified.yml up -d
```

### **Production**

```bash
# With load balancing and clustering
docker-compose -f docker-compose.unified.yml -f docker-compose.production.yml up -d
```

### **Kubernetes**

```bash
kubectl apply -f kubernetes/
```

## 📈 Monitoring & Observability

- **Metrics**: Prometheus + Grafana dashboards
- **Tracing**: Jaeger distributed tracing
- **Logging**: Loki centralized logging
- **Health Checks**: Automated service monitoring
- **Alerts**: Multi-channel alerting system

## 🔒 Security Features

- **API Gateway**: Rate limiting, CORS, authentication
- **Secrets Management**: HashiCorp Vault integration
- **SSL/TLS**: End-to-end encryption
- **Input Validation**: SQL injection and XSS protection
- **Audit Logging**: Complete audit trail

## 🧪 Testing

```bash
# Run all tests
docker-compose exec backend python -m pytest

# Integration tests
python -m pytest tests/integration/

# Load testing
python -m pytest tests/load/

# Security testing
python -m pytest tests/security/
```

## 📚 Comprehensive Documentation

### **📖 For AI Coding Tools**

- **[AI Comprehensive Context Document](AI_COMPREHENSIVE_CONTEXT_DOCUMENT.md)** - Essential context for any AI coding tool to immediately understand the project

### **🔧 Development & Technical**

- **[Development Guide](docs/DEVELOPMENT_GUIDE_COMPREHENSIVE.md)** - Complete development workflow, testing, debugging
- **[API Documentation](docs/API_DOCUMENTATION_COMPREHENSIVE.md)** - Full API reference with examples and SDKs
- **[Technical Specifications](docs/TECHNICAL_SPECIFICATIONS.md)** - System architecture and design patterns
- **[Technology Stack](docs/architecture/technology-stack.md)** - Detailed framework and tooling documentation

### **🚀 Deployment & Operations**

- **[Deployment Guide](docs/DEPLOYMENT_GUIDE_COMPREHENSIVE.md)** - Production deployment with 26 services
- **[Architecture Overview](docs/ARCHITECTURE_OVERVIEW.md)** - System design and data flow
- **[Monitoring Setup](docs/MONITORING_SETUP.md)** - Observability and performance tracking

### **📊 Project Status & Planning**

- **[Current Project Status](CURRENT_PROJECT_STATUS.md)** - Real-time implementation progress
- **[Project Structure](PROJECT_STRUCTURE_COMPREHENSIVE.md)** - Complete directory organization
- **[Development Roadmap](DEVELOPMENT_ROADMAP.md)** - Future features and milestones

## 🧪 Testing & Quality

```bash
# Complete test suite
npm run test                       # All tests across systems
npm run test:frontend              # React component tests
npm run test:backend               # Python API tests
npm run test:integration           # Cross-system integration tests
npm run test:e2e                   # End-to-end Playwright tests

# Code quality pipeline
npm run quality-gate               # Full CI/CD quality check
npm run lint                       # ESLint + Flake8 linting
npm run type-check                 # TypeScript compliance
npm run security-scan              # Dependency vulnerability scan
```

## 🔒 Security & Compliance

- **🔐 Authentication**: JWT with refresh tokens, OAuth2, SAML integration
- **🛡️ API Security**: Rate limiting, CORS, input validation
- **🔑 Secrets Management**: HashiCorp Vault integration
- **📊 Audit Logging**: Comprehensive audit trail with structured logging
- **🔍 Security Scanning**: Automated dependency and vulnerability scanning

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🎯 Enterprise-ready AI platform with 25+ integrated services, production deployment, and comprehensive monitoring.**
