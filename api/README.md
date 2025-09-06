# Auterity Analytics API

A high-performance, secure API for Auterity's analytics stack, integrating ClickHouse and Kafka for real-time data processing and analytics.

## 🚀 Features

- **Real-time Analytics**: ClickHouse integration for fast OLAP queries
- **Data Ingestion**: Kafka producer/consumer for streaming data
- **Security**: JWT authentication with role-based access control
- **Performance**: Caching, connection pooling, and rate limiting
- **Monitoring**: Prometheus metrics and health checks
- **Scalability**: Docker-based infrastructure with resource limits

## 📋 Prerequisites

- Node.js 16+
- Docker and Docker Compose
- Git

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/toobutta/auterity-error-iq.git
   cd auterity-error-iq
   ```

2. **Start infrastructure**:
   ```bash
   cd infrastructure
   docker-compose up -d
   ```

3. **Install API dependencies**:
   ```bash
   cd ../api
   npm install --legacy-peer-deps
   ```

4. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run linting and tests**:
   ```bash
   npm run lint
   npm test
   ```

6. **Start the API**:
   ```bash
   npm start
   ```

## 📖 API Documentation

### Authentication

All protected endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

#### Login
```http
POST /login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### ClickHouse Endpoints

#### Query ClickHouse
```http
GET /api/clickhouse/query?sql=SELECT%201
Authorization: Bearer <token>
```

Response:
```json
{
  "data": [...],
  "cached": false
}
```

#### Clear Cache
```http
POST /api/clickhouse/clear-cache
Authorization: Bearer <token>
```

### Kafka Endpoints

#### Produce Message
```http
POST /api/kafka/produce
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "analytics-data",
  "message": {
    "event": "user_action",
    "timestamp": "2025-09-02T16:00:00Z",
    "data": {...}
  }
}
```

### Monitoring Endpoints

#### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "API is running"
}
```

#### Prometheus Metrics
```http
GET /metrics
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | `3000` |
| `JWT_SECRET` | JWT signing secret | Required |
| `CLICKHOUSE_URL` | ClickHouse server URL | `http://localhost` |
| `CLICKHOUSE_PORT` | ClickHouse port | `8123` |
| `KAFKA_BROKERS` | Kafka broker addresses | `localhost:9092` |
| `PROMETHEUS_PORT` | Prometheus metrics port | `9090` |

### Docker Resource Limits

The infrastructure is configured with optimized resource limits:

- **ClickHouse**: 8GB RAM, 2 CPUs
- **Kafka**: 2GB RAM, 1 CPU
- **Zookeeper**: 512MB RAM, 0.5 CPU
- **Superset**: 2GB RAM, 1 CPU

## 🚀 Deployment

### Automated Deployment
```bash
./deploy-api.sh
```

### Manual Deployment
1. Start infrastructure
2. Install dependencies
3. Configure environment
4. Run tests
5. Start API

## 📊 Performance Optimizations

- **Caching**: 5-minute TTL cache for ClickHouse queries
- **Connection Pooling**: Up to 10 concurrent ClickHouse connections
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Compression**: Gzip enabled for responses
- **Resource Limits**: Docker containers with CPU/memory constraints

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (admin/user)
- Rate limiting to prevent abuse
- Input validation and sanitization
- Environment-based configuration
- No hardcoded secrets

## 📈 Monitoring

### Metrics
- HTTP request duration histograms
- Request count by method/route/status
- Cache hit/miss ratios
- Connection pool usage

### Health Checks
- API availability
- Database connectivity
- Kafka broker status

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run linting
npm run lint
```

## 📝 Development

### Project Structure
```
api/
├── app.js              # Main application
├── routes/
│   ├── clickhouse.js   # ClickHouse endpoints
│   └── kafka.js        # Kafka endpoints
├── middleware/
│   ├── auth.js         # Authentication middleware
│   └── metrics.js      # Monitoring middleware
├── tests/
│   └── api.test.js     # API tests
├── .env.example        # Environment template
├── .eslintrc.json      # Linting configuration
└── package.json        # Dependencies
```

### Adding New Endpoints
1. Create route file in `routes/`
2. Import and use in `app.js`
3. Add authentication if needed
4. Update tests
5. Update documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run linting and tests
5. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the health endpoint for system status
