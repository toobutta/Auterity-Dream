# Auterity Unified AI Platform - Comprehensive Deployment Guide

## 🎯 Deployment Overview

**Platform**: Auterity Unified AI Platform  
**Architecture**: Microservices with 26 Integrated Services  
**Deployment Options**: Development, Staging, Production  
**Container Technology**: Docker + Docker Compose  
**Orchestration**: Kubernetes Ready  

## 🚀 Quick Start Deployment

### Prerequisites

```bash
# Required Software
- Docker 24.0+
- Docker Compose 2.20+
- Git 2.40+
- Node.js 18.0+ (for local development)
- Python 3.11+ (for backend development)

# System Requirements
- CPU: 4+ cores
- RAM: 8GB+ (16GB recommended for production)
- Storage: 20GB+ available space
- Network: Ports 80, 443, 3000, 8000, 8001 available
```

### 1. Repository Setup

```bash
# Clone the repository
git clone https://github.com/toobutta/auterity-error-iq.git
cd auterity-error-iq

# Copy environment configuration
cp .env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

### 2. Environment Configuration

```bash
# .env - Core Configuration
POSTGRES_DB=auterity
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here

REDIS_URL=redis://redis:6379
RABBITMQ_PASSWORD=your_rabbitmq_password

# AI Service Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
PINECONE_API_KEY=your_pinecone_api_key

# Communication Services
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token

# Infrastructure
VAULT_TOKEN=your_vault_token
KAFKA_BOOTSTRAP_SERVERS=kafka:9092

# Monitoring
GRAFANA_PASSWORD=your_grafana_password
SLACK_WEBHOOK_URL=your_slack_webhook
```

### 3. Development Deployment

```bash
# Start all services in development mode
npm run dev

# Alternative: Direct Docker Compose
docker-compose -f docker-compose.unified.yml up -d

# Check service status
npm run health-check

# View logs
npm run dev:logs
```

### 4. Production Deployment

```bash
# Deploy production stack
npm run prod

# Alternative: Full production stack
docker-compose -f docker-compose.unified.yml -f docker-compose.production.yml up -d

# Verify deployment
./scripts/health-check.sh
```

## 🏗️ Service Architecture

### **26 Integrated Services**

| Service               | Type          | Port        | Health Check                    |
| --------------------- | ------------- | ----------- | ------------------------------- |
| **kong**              | Gateway       | 8000, 8001  | `curl localhost:8001/status`    |
| **nginx**             | Load Balancer | 80, 443     | `curl localhost/health`         |
| **backend**           | API           | 8080        | `curl localhost:8080/api/health`|
| **frontend**          | Web           | 3000        | `curl localhost:3000`           |
| **postgres**          | Database      | 5432        | `pg_isready -h localhost`       |
| **redis**             | Cache         | 6379        | `redis-cli ping`                |
| **rabbitmq**          | Queue         | 5672, 15672 | `curl localhost:15672`          |
| **kafka**             | Streaming     | 9092        | `kafka-topics.sh --list`       |
| **vault**             | Secrets       | 8200        | `curl localhost:8200/v1/sys/health`|
| **mlflow**            | ML            | 5000        | `curl localhost:5000/health`    |
| **weaviate**          | Vector DB     | 8081        | `curl localhost:8081/v1/meta`   |
| **puppeteer**         | Automation    | 3000        | `curl localhost:3000/health`    |
| **celery-worker**     | Workers       | -           | `celery inspect ping`           |
| **prometheus**        | Metrics       | 9090        | `curl localhost:9090/-/healthy` |
| **grafana**           | Monitoring    | 3001        | `curl localhost:3001/api/health`|
| **jaeger**            | Tracing       | 16686       | `curl localhost:16686/health`   |
| **minio**             | Storage       | 9000, 9001  | `curl localhost:9000/minio/health/live`|

## 🔧 Configuration Management

### **Environment Configurations**

#### Development Environment
```yaml
# docker-compose.unified.yml
version: '3.8'
services:
  backend:
    build: ./backend
    environment:
      - DEBUG=true
      - LOG_LEVEL=debug
      - CORS_ORIGINS=http://localhost:3000
    volumes:
      - ./backend:/app
      - /app/node_modules
```

#### Production Environment
```yaml
# docker-compose.production.yml
version: '3.8'
services:
  backend:
    environment:
      - DEBUG=false
      - LOG_LEVEL=info
      - CORS_ORIGINS=https://yourdomain.com
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

### **Service Dependencies**

```yaml
# Service startup order and health checks
depends_on:
  postgres:
    condition: service_healthy
  redis:
    condition: service_healthy
  rabbitmq:
    condition: service_healthy
  kafka:
    condition: service_healthy
  vault:
    condition: service_started
```

## 🔒 Security Configuration

### **SSL/TLS Setup**

```bash
# Generate self-signed certificates for development
./scripts/generate-ssl-certs.sh

# Production: Use Let's Encrypt
certbot certonly --webroot -w /var/www/html -d yourdomain.com
```

### **Vault Configuration**

```bash
# Initialize Vault
docker-compose exec vault vault operator init

# Unseal Vault
docker-compose exec vault vault operator unseal <unseal_key>

# Configure secrets
docker-compose exec vault vault auth -method=userpass username=admin password=<password>
```

### **API Gateway Security**

```yaml
# kong/kong.yml
_format_version: "3.0"
services:
  - name: backend-api
    url: http://backend:8000
    plugins:
      - name: rate-limiting
        config:
          minute: 1000
          hour: 10000
      - name: cors
        config:
          origins: ["https://yourdomain.com"]
          methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
```

## 📊 Monitoring & Observability

### **Health Checks**

```bash
#!/bin/bash
# scripts/health-check.sh

echo "🔍 Checking service health..."

# Core services
curl -f http://localhost:8080/api/health || echo "❌ Backend unhealthy"
curl -f http://localhost:3000 || echo "❌ Frontend unhealthy"
curl -f http://localhost:8001/status || echo "❌ Kong unhealthy"

# Databases
pg_isready -h localhost -p 5432 || echo "❌ PostgreSQL unhealthy"
redis-cli -h localhost -p 6379 ping || echo "❌ Redis unhealthy"

# Monitoring
curl -f http://localhost:9090/-/healthy || echo "❌ Prometheus unhealthy"
curl -f http://localhost:3001/api/health || echo "❌ Grafana unhealthy"

echo "✅ Health check completed"
```

### **Metrics Collection**

```yaml
# monitoring/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'backend-api'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

### **Log Aggregation**

```yaml
# monitoring/loki/local-config.yaml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h
```

## 🚀 Deployment Strategies

### **Rolling Deployment**

```bash
#!/bin/bash
# scripts/rolling-deployment.sh

echo "🚀 Starting rolling deployment..."

# Update backend services one by one
for service in backend-1 backend-2 backend-3; do
    echo "📦 Updating $service..."
    docker-compose stop $service
    docker-compose pull $service
    docker-compose up -d $service
    
    # Wait for health check
    sleep 30
    curl -f http://localhost:8080/api/health || exit 1
done

echo "✅ Rolling deployment completed"
```

### **Blue-Green Deployment**

```bash
#!/bin/bash
# scripts/blue-green-deployment.sh

# Deploy to green environment
docker-compose -f docker-compose.green.yml up -d

# Run health checks on green
./scripts/health-check-green.sh

# Switch traffic to green
./scripts/switch-traffic.sh green

# Keep blue for rollback capability
echo "✅ Blue-green deployment completed"
```

## 🧪 Testing in Production

### **Smoke Tests**

```bash
#!/bin/bash
# scripts/smoke-tests.sh

echo "🧪 Running smoke tests..."

# API endpoints
curl -f http://localhost:8080/api/health
curl -f http://localhost:8080/api/auth/me
curl -f http://localhost:8080/api/workflows

# Database connectivity
python -c "import psycopg2; conn = psycopg2.connect('postgresql://postgres:password@localhost:5432/auterity')"

# Cache connectivity
redis-cli ping

echo "✅ Smoke tests passed"
```

### **Load Testing**

```bash
# Install k6 for load testing
curl https://github.com/grafana/k6/releases/download/v0.45.0/k6-v0.45.0-linux-amd64.tar.gz -L | tar xvz --strip-components 1

# Run load tests
k6 run tests/load/api-load-test.js
```

## 🔧 Troubleshooting

### **Common Issues**

#### Service Won't Start
```bash
# Check logs
docker-compose logs backend

# Check resources
docker stats

# Check disk space
df -h
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
docker-compose exec postgres pg_isready

# Check connection string
docker-compose exec backend env | grep DATABASE_URL
```

#### Performance Issues
```bash
# Monitor resource usage
docker stats

# Check slow queries
docker-compose exec postgres psql -U postgres -d auterity -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"
```

### **Recovery Procedures**

#### Database Recovery
```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres auterity > backup.sql

# Restore database
docker-compose exec postgres psql -U postgres auterity < backup.sql
```

#### Service Recovery
```bash
# Restart specific service
docker-compose restart backend

# Full system restart
docker-compose down && docker-compose up -d
```

## 📈 Scaling Considerations

### **Horizontal Scaling**

```yaml
# docker-compose.scale.yml
version: '3.8'
services:
  backend:
    deploy:
      replicas: 3
  
  frontend:
    deploy:
      replicas: 2
      
  celery-worker:
    deploy:
      replicas: 5
```

### **Database Scaling**

```yaml
# PostgreSQL clustering
postgres-master:
  image: postgres:15-alpine
  environment:
    - POSTGRES_REPLICATION_MODE=master

postgres-slave:
  image: postgres:15-alpine
  environment:
    - POSTGRES_REPLICATION_MODE=slave
    - POSTGRES_MASTER_SERVICE=postgres-master
```

## 🔐 Production Security Checklist

- [ ] SSL/TLS certificates configured
- [ ] Secrets stored in Vault
- [ ] Database encrypted at rest
- [ ] Network segmentation implemented
- [ ] Regular security updates
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting active
- [ ] Access controls configured
- [ ] Audit logging enabled
- [ ] Security scanning automated

## 📞 Support & Maintenance

### **Monitoring Dashboards**

- **Application**: http://localhost:3001 (Grafana)
- **API Gateway**: http://localhost:8001 (Kong Admin)
- **Message Queue**: http://localhost:15672 (RabbitMQ)
- **Service Mesh**: http://localhost:16686 (Jaeger)

### **Emergency Contacts**

- **DevOps Team**: devops@auterity.com
- **Security Team**: security@auterity.com
- **On-Call**: +1-XXX-XXX-XXXX

---

**Last Updated**: August 25, 2025  
**Version**: 1.0.0  
**Maintained By**: Auterity DevOps Team
