# Infrastructure Setup

This directory contains the optimized infrastructure setup for Auterity's analytics stack, including ClickHouse, Kafka, Zookeeper, and Apache Superset with resource limits and performance optimizations.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐
│   API Layer     │────│  ClickHouse     │
│   (Express.js)  │    │  (Analytics DB) │
└─────────────────┘    └─────────────────┘
         │                       │
         │                       │
┌─────────────────┐    ┌─────────────────┐
│     Kafka       │────│   Superset      │
│  (Message Bus)  │    │ (Dashboards)    │
└─────────────────┘    └─────────────────┘
         │
         │
┌─────────────────┐
│   Zookeeper     │
│ (Coordination)  │
└─────────────────┘
```

## 🐳 Services

### ClickHouse (Analytics Database)
- **Image**: `yandex/clickhouse-server:latest`
- **Purpose**: High-performance OLAP database for real-time analytics
- **Ports**:
  - `8123`: HTTP interface for queries
  - `9000`: Native client interface
- **Resource Limits**:
  - Memory: 8GB
  - CPU: 2 cores
- **Optimizations**:
  - Connection pooling enabled
  - Gzip compression
  - Memory usage limits

### Kafka (Message Bus)
- **Image**: `confluentinc/cp-kafka:latest`
- **Purpose**: Real-time data ingestion and streaming
- **Ports**:
  - `9092`: Kafka broker interface
- **Resource Limits**:
  - Memory: 2GB
  - CPU: 1 core
- **Configuration**:
  - Heap size: 1GB
  - Single broker setup
  - Offset replication factor: 1

### Zookeeper (Coordination)
- **Image**: `confluentinc/cp-zookeeper:latest`
- **Purpose**: Distributed coordination for Kafka
- **Ports**:
  - `2181`: Zookeeper client port
- **Resource Limits**:
  - Memory: 512MB
  - CPU: 0.5 cores
- **Configuration**:
  - JVM heap: 512MB
  - Tick time: 2000ms

### Apache Superset (Dashboards)
- **Image**: `apache/superset:latest`
- **Purpose**: Business intelligence and data visualization
- **Ports**:
  - `8088`: Superset web interface
- **Resource Limits**:
  - Memory: 2GB
  - CPU: 1 core
- **Configuration**:
  - Examples disabled for performance
  - Connected to ClickHouse for data sources

## 🚀 Quick Start

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- 16GB+ available RAM
- 4+ CPU cores

### Start All Services
```bash
cd infrastructure
docker-compose up -d
```

### Verify Services
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Test ClickHouse
curl "http://localhost:8123/?query=SELECT%201"

# Test Kafka
docker-compose exec kafka kafka-console-producer --broker-list localhost:9092 --topic test
```

### Stop Services
```bash
docker-compose down
```

## ⚙️ Configuration

### Environment Variables
Services are configured with optimized settings for production use:

```yaml
# ClickHouse
CLICKHOUSE_MAX_MEMORY_USAGE: 8GB

# Kafka
KAFKA_HEAP_OPTS: "-Xmx1g -Xms1g"

# Zookeeper
JVMFLAGS: "-Xmx512m -Xms512m"

# Superset
SUPERSET_LOAD_EXAMPLES: "no"
```

### Resource Limits
All services have resource constraints to prevent resource exhaustion:

| Service | Memory | CPU | Purpose |
|---------|--------|-----|---------|
| ClickHouse | 8GB | 2.0 | Analytics queries |
| Kafka | 2GB | 1.0 | Message processing |
| Zookeeper | 512MB | 0.5 | Coordination |
| Superset | 2GB | 1.0 | Dashboard rendering |

## 📊 Performance Optimizations

### ClickHouse Optimizations
- **Memory Management**: 8GB limit prevents OOM
- **Connection Pooling**: Efficient resource usage
- **Compression**: Gzip for network efficiency
- **Indexing**: Optimized for analytical queries

### Kafka Optimizations
- **Heap Sizing**: 1GB heap for stable performance
- **Replication**: Single replica for development
- **Partitioning**: Configurable partitions per topic

### Superset Optimizations
- **Examples Disabled**: Faster startup, less memory usage
- **Caching**: Built-in query result caching
- **Async Queries**: Non-blocking dashboard loads

## 🔧 Maintenance

### Backup ClickHouse Data
```bash
# Stop ClickHouse
docker-compose stop clickhouse

# Backup data volume
docker run --rm -v auterity_clickhouse_data:/data -v $(pwd):/backup alpine tar czf /backup/clickhouse-backup.tar.gz -C /data .

# Start ClickHouse
docker-compose start clickhouse
```

### Monitor Resource Usage
```bash
# View container stats
docker stats

# Check logs for errors
docker-compose logs --tail=100 [service-name]
```

### Scale Services
```bash
# Scale Kafka brokers
docker-compose up -d --scale kafka=3

# Scale ClickHouse (requires cluster setup)
# See ClickHouse documentation for clustering
```

## 🔒 Security Considerations

### Network Security
- Services communicate via Docker networks
- Exposed ports are documented and minimal
- No default passwords in production

### Data Security
- ClickHouse data persisted in named volumes
- Kafka messages can be encrypted at rest
- Superset requires secure secret key

### Access Control
- API layer handles authentication
- Database access restricted to API
- Monitoring endpoints protected

## 📈 Monitoring

### Built-in Monitoring
- **Health Checks**: Container health endpoints
- **Logs**: Centralized logging with `docker-compose logs`
- **Metrics**: Prometheus integration in API layer

### External Monitoring
```bash
# Install Prometheus and Grafana
# Configure scrape targets for containers
# Set up dashboards for resource monitoring
```

## 🐛 Troubleshooting

### Common Issues

#### ClickHouse Connection Refused
```bash
# Check if container is running
docker-compose ps clickhouse

# View ClickHouse logs
docker-compose logs clickhouse

# Restart ClickHouse
docker-compose restart clickhouse
```

#### Kafka Broker Not Available
```bash
# Check Zookeeper first
docker-compose logs zookeeper

# Check Kafka logs
docker-compose logs kafka

# Test connectivity
docker-compose exec kafka kafka-broker-api-versions --bootstrap-server localhost:9092
```

#### Superset Connection Issues
```bash
# Check Superset logs
docker-compose logs superset

# Verify ClickHouse connectivity from Superset
docker-compose exec superset superset db upgrade
```

### Performance Tuning

#### High Memory Usage
- Reduce ClickHouse memory limit if needed
- Monitor with `docker stats`
- Adjust JVM heap sizes

#### Slow Queries
- Add indexes to ClickHouse tables
- Increase Kafka partitions
- Optimize Superset dashboard queries

## 📚 Additional Resources

- [ClickHouse Documentation](https://clickhouse.com/docs/)
- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [Apache Superset Documentation](https://superset.apache.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🤝 Contributing

1. Update configurations in `docker-compose.yml`
2. Test changes locally
3. Update this README
4. Submit pull request

## 📄 License

This infrastructure setup is part of the Auterity project.
