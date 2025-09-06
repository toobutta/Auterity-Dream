# 🚀 **Auterity Analytics Platform - Production Deployment Guide**

## **Overview**

This guide provides comprehensive instructions for deploying the enhanced Auterity Analytics Platform to production environments. The platform includes unified analytics, AI/ML optimization, real-time WebSocket updates, enterprise security, and comprehensive monitoring.
## **Platform Components**

### **Core Services**
- **Frontend Application**: React/TypeScript UI with integrated Workflow Studio
- **API Gateway**: Main REST API service (Port: 8080)
- **LangGraph Service**: AI-powered workflow orchestration (Port: 8002)
- **vLLM Service**: High-throughput AI model serving (Port: 8001)
- **RelayCore**: AI model routing and management (Port: 8001)
- **Workflow Studio**: Visual workflow designer
- **PostgreSQL**: Primary database (Port: 5432)
- **Redis**: Caching and session management (Port: 6379)

### **AI Services Architecture**
```
Frontend (3000) → API Gateway (8080) → AI Services
                                      ├── LangGraph (8002)
                                      ├── vLLM (8001)
                                      └── RelayCore (8001)
```

### **Service Dependencies**
- **LangGraph Service**: Requires Redis for caching and state management
- **vLLM Service**: Requires GPU support for optimal performance (optional CPU fallback)
- **RelayCore**: Requires API keys for AI providers (OpenAI, Anthropic, etc.)

## **Prerequisites**

### **System Requirements**
- **CPU**: 4+ cores (8+ recommended)
- **RAM**: 16GB minimum (32GB+ recommended)
- **Storage**: 100GB SSD minimum
- **Network**: 1Gbps connection minimum

### **Software Requirements**
- Docker 20.10+
- Docker Compose 2.0+
- PostgreSQL 15+
- Redis 7+
- Nginx (for production proxy)
- SSL certificates (Let's Encrypt recommended)

### **Environment Setup**
```bash
# Clone repository
git clone https://github.com/your-org/auterity-analytics.git
cd auterity-analytics

# Create environment file
cp .env.example .env.production
```

## **Environment Configuration**

### **Required Environment Variables**
```bash
# Application
ENVIRONMENT=production
SECRET_KEY=your-256-bit-secret-key-here
ENCRYPTION_KEY=your-fernet-encryption-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# Database
DATABASE_URL=postgresql://user:password@postgres:5432/analytics_db
POSTGRES_DB=analytics_db
POSTGRES_USER=analytics_user
POSTGRES_PASSWORD=your-secure-password

# Cache
REDIS_URL=redis://:password@redis:6379/0
REDIS_PASSWORD=your-redis-password

# AI Services Configuration
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key
AZURE_AI_API_KEY=your-azure-ai-api-key

# LangGraph Service
LANGGRAPH_PORT=8002
LANGGRAPH_MEMORY_LIMIT=2G

# vLLM Service
VLLM_PORT=8001
VLLM_MODEL_NAME=meta-llama/Llama-2-7b-chat-hf
VLLM_GPU_MEMORY_UTILIZATION=0.9
VLLM_TENSOR_PARALLEL_SIZE=1
VLLM_MAX_MODEL_LEN=4096
VLLM_MAX_BATCH_SIZE=32

# External Services
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Monitoring
PROMETHEUS_URL=http://monitoring:9090
GRAFANA_URL=http://monitoring:3000
```

## **Deployment Steps**

### **1. Security Setup**

#### **SSL Certificate Configuration**
```bash
# Install certbot for Let's Encrypt
sudo apt-get install certbot

# Generate certificates
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com

# Copy certificates to deployment directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem deployment/nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem deployment/nginx/ssl/
```

#### **Firewall Configuration**
```bash
# Allow necessary ports
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22

# Enable firewall
sudo ufw enable
```

### **2. Database Setup**

#### **PostgreSQL Configuration**
```bash
# Create database and user
sudo -u postgres psql

CREATE DATABASE analytics_db;
CREATE USER analytics_user WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE analytics_db TO analytics_user;
ALTER USER analytics_user CREATEDB;

# Enable required extensions
\c analytics_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
```

#### **Database Migration**
```bash
# Run database migrations
cd services/api
python -m alembic upgrade head

# Initialize analytics tables
python init_db.py
```

### **3. Docker Deployment**

#### **Production Deployment**
```bash
# Build and deploy
cd deployment
docker-compose -f docker-compose.prod.yml up -d

# Verify deployment
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f analytics-api
```

#### **Zero-Downtime Deployment**
```bash
# Update with zero downtime
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --no-deps analytics-api

# Health check
curl -f https://api.yourdomain.com/health
```

### **4. Load Balancing Setup**

#### **Nginx Configuration**
```nginx
# /etc/nginx/sites-available/auterity-analytics
upstream analytics_backend {
    server analytics-api:8000;
    server analytics-api-backup:8000 backup;
}

server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    location / {
        proxy_pass http://analytics_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

### **5. Monitoring Setup**

#### **Grafana Dashboard Import**
```bash
# Access Grafana at http://your-server:3000
# Default credentials: admin/admin

# Import analytics dashboard
curl -X POST -H "Content-Type: application/json" \
  -d @deployment/monitoring/grafana/dashboard.json \
  http://admin:admin@localhost:3000/api/dashboards/import
```

#### **Alert Configuration**
```bash
# Configure alert notifications
# Edit deployment/monitoring/alertmanager.yml
# Add email, Slack, or other notification channels
```

### **6. Backup Strategy**

#### **Database Backup**
```bash
# Create backup script
cat > /usr/local/bin/backup-analytics.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/var/backups/analytics"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/analytics_$TIMESTAMP.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
docker exec analytics_postgres pg_dump -U analytics_user analytics_db > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Clean old backups (keep last 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Upload to cloud storage (optional)
# aws s3 cp $BACKUP_FILE.gz s3://your-backup-bucket/
EOF

chmod +x /usr/local/bin/backup-analytics.sh
```

#### **Automated Backup Schedule**
```bash
# Add to crontab for daily backups at 2 AM
0 2 * * * /usr/local/bin/backup-analytics.sh
```

## **Performance Optimization**

### **Database Optimization**
```sql
-- Create performance indexes
CREATE INDEX CONCURRENTLY idx_analytics_events_composite
ON analytics_events (tenant_id, timestamp DESC, user_id);

CREATE INDEX CONCURRENTLY idx_performance_metrics_time
ON performance_metrics (bucket_start, bucket_end, service_name);

-- Analyze tables for query optimization
ANALYZE analytics_events;
ANALYZE performance_metrics;
ANALYZE user_sessions;
```

### **Cache Configuration**
```bash
# Redis configuration
docker exec -it analytics_redis redis-cli

# Set max memory and policy
CONFIG SET maxmemory 1gb
CONFIG SET maxmemory-policy allkeys-lru

# Enable persistence
CONFIG SET appendonly yes
CONFIG SET appendfsync everysec
```

### **Application Scaling**
```bash
# Scale API service
docker-compose -f docker-compose.prod.yml up -d --scale analytics-api=3

# Scale worker service
docker-compose -f docker-compose.prod.yml up -d --scale worker=2
```

## **Security Hardening**

### **Container Security**
```bash
# Run security scan
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasecurity/trivy image auterity-analytics-api:latest

# Apply security updates
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### **Network Security**
```bash
# Enable fail2ban for SSH protection
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Configure UFW rules
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## **Monitoring & Maintenance**

### **Health Checks**
```bash
# Application health
curl -f https://api.yourdomain.com/health

# Database health
docker exec analytics_postgres pg_isready -U analytics_user -d analytics_db

# Redis health
docker exec analytics_redis redis-cli ping

# System resources
docker stats
```

### **Log Management**
```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f analytics-api

# View all service logs
docker-compose -f docker-compose.prod.yml logs

# Log rotation
# Configure logrotate for /var/log/analytics/
```

### **Performance Monitoring**
```bash
# Monitor API performance
curl -w "@curl-format.txt" -o /dev/null -s https://api.yourdomain.com/api/enhanced-analytics/unified

# Database performance
docker exec analytics_postgres psql -U analytics_user -d analytics_db -c "SELECT * FROM pg_stat_activity;"

# Cache performance
docker exec analytics_redis redis-cli info stats
```

## **Troubleshooting**

### **Common Issues**

#### **High Memory Usage**
```bash
# Check memory usage
docker stats

# Restart services if needed
docker-compose -f docker-compose.prod.yml restart analytics-api

# Clear cache if necessary
docker exec analytics_redis redis-cli FLUSHALL
```

#### **Database Connection Issues**
```bash
# Check database connectivity
docker exec analytics_postgres pg_isready -U analytics_user -d analytics_db

# Restart database
docker-compose -f docker-compose.prod.yml restart postgres

# Check connection pool
docker exec analytics_postgres psql -U analytics_user -d analytics_db -c "SHOW max_connections;"
```

#### **WebSocket Connection Issues**
```bash
# Check WebSocket connections
docker exec analytics_redis redis-cli PUBSUB CHANNELS

# Restart WebSocket service
docker-compose -f docker-compose.prod.yml restart analytics-api

# Check Nginx WebSocket configuration
nginx -t
nginx -s reload
```

### **Performance Issues**
```bash
# Analyze slow queries
docker exec analytics_postgres psql -U analytics_user -d analytics_db -c "
SELECT query, calls, total_time/calls as avg_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
"

# Check cache hit rate
docker exec analytics_redis redis-cli INFO stats | grep keyspace

# Monitor API response times
# Check Grafana dashboards for performance metrics
```

## **Backup & Recovery**

### **Database Recovery**
```bash
# Stop application
docker-compose -f docker-compose.prod.yml stop analytics-api

# Restore from backup
gunzip /var/backups/analytics/analytics_20231201_020000.sql.gz
docker exec -i analytics_postgres psql -U analytics_user analytics_db < /var/backups/analytics/analytics_20231201_020000.sql

# Restart application
docker-compose -f docker-compose.prod.yml start analytics-api
```

### **Application Rollback**
```bash
# Rollback to previous version
docker tag auterity-analytics-api:v1 auterity-analytics-api:rollback
docker-compose -f docker-compose.prod.yml up -d --no-deps analytics-api
```

## **Support & Maintenance**

### **Regular Maintenance Tasks**
- **Daily**: Monitor system health and performance
- **Weekly**: Review security logs and failed authentication attempts
- **Monthly**: Update SSL certificates and security patches
- **Quarterly**: Performance optimization and database maintenance

### **Support Contacts**
- **Technical Support**: support@auterity.com
- **Security Issues**: security@auterity.com
- **Emergency**: +1-800-AUTERITY

### **Documentation**
- **API Documentation**: https://api.yourdomain.com/docs
- **Monitoring Dashboards**: https://monitoring.yourdomain.com
- **System Architecture**: See ARCHITECTURE.md

---

## **Quick Start Checklist**

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database created and migrated
- [ ] Docker containers deployed
- [ ] Nginx configured and running
- [ ] Monitoring dashboards configured
- [ ] Backup strategy implemented
- [ ] Security hardening completed
- [ ] Health checks passing
- [ ] Team notified of deployment

## **Production Go-Live**

Once all checks pass:

```bash
# Final verification
curl -f https://api.yourdomain.com/health
curl -f https://api.yourdomain.com/api/enhanced-analytics/unified

# Enable production traffic
# Update DNS records
# Notify stakeholders
# Monitor for 24 hours post-deployment
```

**🎉 Your Auterity Analytics Platform is now live and production-ready!**
