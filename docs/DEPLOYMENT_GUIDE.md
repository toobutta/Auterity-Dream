# Deployment Guide

## Prerequisites

- Docker 24.0+
- Docker Compose 2.20+
- 16GB RAM minimum (32GB recommended)
- 50GB disk space minimum
- NVIDIA GPU (optional, for vLLM acceleration)

## Architecture Overview

The Auterity platform consists of 30+ microservices organized into the following layers:

### **Application Layer**
- Frontend (React/TypeScript) - Port 3000
- Workflow Studio - Port 3001
- API Gateway (Kong) - Port 8000
- Main API Service - Port 8000

### **AI Services Layer**
- RelayCore - Port 8001
- LangGraph Service - Port 8002
- CrewAI Service - Port 8003
- NeuroWeaver Platform - Port 8004
- MCP Orchestrator - Port 8005
- n8n AI Enhancements - Port 8006
- Integration Layer - Port 8007
- vLLM Service - Port 8001

### **Data & Infrastructure Layer**
- PostgreSQL - Port 5432
- Redis - Port 6379
- RabbitMQ - Port 5672, 15672
- Kafka + Zookeeper - Ports 9092, 2181
- Weaviate - Port 8080
- MLflow - Port 5000
- Vault - Port 8200

### **Monitoring & Observability**
- Prometheus - Port 9090
- Grafana - Port 3000
- Jaeger - Port 16686
- Loki - Port 3100
- AlertManager - Port 9093
- Node Exporter - Port 9100

### **Development Tools**
- pgAdmin - Port 5050
- MailHog - Ports 1025, 8025
- Puppeteer (headless browser)

## Quick Deploy

```bash
git clone https://github.com/toobutta/auterity-error-iq.git
cd auterity-error-iq
cp deployment/docker-compose.env .env
docker-compose -f infrastructure/docker/docker-compose.unified.yml up -d
./scripts/init-all-services.sh
```

## Environment Configuration

### **Required Environment Variables**

```bash
# AI Service API Keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_AI_API_KEY=your_google_key
AZURE_AI_API_KEY=your_azure_key

# Database Configuration
POSTGRES_USER=auterity
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=auterity_db

# Redis Configuration
REDIS_PASSWORD=secure_redis_password

# RabbitMQ Configuration
RABBITMQ_DEFAULT_USER=auterity
RABBITMQ_DEFAULT_PASS=secure_rabbitmq_password

# Vault Configuration
VAULT_DEV_ROOT_TOKEN_ID=your_vault_token

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Service URLs
AUTERITY_FRONTEND_URL=http://localhost:3000
AUTERITY_API_URL=http://localhost:8000
```

### **GPU Configuration (for vLLM)**
```bash
# Enable GPU support
VLLM_GPU_ENABLED=true
VLLM_GPU_MEMORY_UTILIZATION=0.9
CUDA_VISIBLE_DEVICES=0
```

## Service Deployment Order

1. **Infrastructure Services** (Start first)
   ```bash
   docker-compose -f infrastructure/docker/docker-compose.unified.yml up -d postgres redis rabbitmq kafka zookeeper vault
   ```

2. **Monitoring Stack**
   ```bash
   docker-compose -f infrastructure/docker/docker-compose.unified.yml up -d prometheus grafana jaeger loki alertmanager node-exporter
   ```

3. **AI and ML Services**
   ```bash
   docker-compose -f infrastructure/docker/docker-compose.unified.yml up -d weaviate mlflow
   docker-compose -f infrastructure/docker/vllm/docker-compose.yml up -d
   docker-compose -f infrastructure/docker/langgraph/docker-compose.yml up -d
   docker-compose -f infrastructure/docker/crewai/docker-compose.yml up -d
   ```

4. **Application Services**
   ```bash
   docker-compose -f infrastructure/docker/docker-compose.unified.yml up -d backend frontend workflow-studio kong celery-worker
   ```

5. **Integration Services**
   ```bash
   docker-compose -f systems/integration/docker-compose.yml up -d
   ```

## Service Verification

### **Core Services Health Checks**
```bash
# API Gateway
curl http://localhost:8000/health

# Main API
curl http://localhost:8000/api/health

# AI Services
curl http://localhost:8001/health  # RelayCore/vLLM
curl http://localhost:8002/health  # LangGraph
curl http://localhost:8003/health  # CrewAI
curl http://localhost:8004/health  # NeuroWeaver
curl http://localhost:8005/health  # MCP
curl http://localhost:8006/health  # n8n AI
curl http://localhost:8007/health  # Integration Layer

# Databases
curl http://localhost:5432/health  # PostgreSQL
curl http://localhost:6379/health  # Redis

# Monitoring
curl http://localhost:9090/health  # Prometheus
curl http://localhost:3000/health  # Grafana
```

### **Application Access**
- **Frontend**: http://localhost:3000
- **Workflow Studio**: http://localhost:3001
- **API Documentation**: http://localhost:8000/api/docs
- **Grafana**: http://localhost:3000 (admin/admin)
- **pgAdmin**: http://localhost:5050
- **MailHog**: http://localhost:8025

## Production Considerations

### **Security**
- Use external managed databases (AWS RDS, Google Cloud SQL)
- Configure SSL/TLS certificates for all services
- Implement secrets management with HashiCorp Vault
- Set up network segmentation and firewalls
- Enable authentication and authorization for all services

### **Scalability**
- Configure horizontal scaling for AI services
- Set up load balancers for high-traffic services
- Implement auto-scaling based on resource usage
- Use managed Kubernetes for production deployments

### **Monitoring & Observability**
- Set up comprehensive logging with Loki
- Configure alerting with AlertManager
- Implement distributed tracing with Jaeger
- Monitor AI model performance and accuracy
- Track API usage and response times

### **Backup & Recovery**
- Regular database backups (PostgreSQL, Redis)
- AI model checkpoints and versioning
- Configuration backups
- Disaster recovery planning

### **Performance Optimization**
- GPU acceleration for vLLM services
- Redis caching for frequently accessed data
- Database query optimization
- CDN for static assets
- API response caching

## Scaling

```bash
# Scale Celery workers
docker-compose up -d --scale celery-worker=3

# Scale backend instances
docker-compose up -d --scale backend=2
```
