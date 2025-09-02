# Auterity LangGraph Service

AI-powered workflow orchestration with intelligent decision making and dynamic routing capabilities.

## 🚀 Overview

The LangGraph Service provides advanced workflow orchestration that combines the power of LangGraph with AI-driven decision making. It enables:

- **Intelligent Workflow Execution**: AI-powered routing and decision making
- **Multi-Provider AI Integration**: Support for OpenAI, Anthropic, and custom vLLM models
- **Dynamic Node Execution**: Support for LLM, Tool, Condition, Integration, and Human nodes
- **Real-time Monitoring**: Comprehensive metrics and execution tracking
- **Enterprise Integration**: Seamless integration with n8n, Temporal, and Celery

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Kong Gateway  │    │ LangGraph       │
│   (React)       │────│   (API Routes)  │────│ Service         │
│                 │    │                 │    │ (FastAPI)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   AI Services   │
                    │ - vLLM         │
                    │ - OpenAI       │
                    │ - Anthropic    │
                    └─────────────────┘
```

## 🎯 Key Features

### Intelligent Workflow Engine
- **AI-Driven Decisions**: Use LLM models to make routing decisions
- **Dynamic Execution**: Conditional branching based on AI analysis
- **Error Recovery**: Automatic retry and alternative path selection
- **Performance Optimization**: Parallel execution where possible

### Node Types
- **LLM Nodes**: Direct integration with AI models for generation
- **Tool Nodes**: Execute external tools and integrations
- **Condition Nodes**: AI-powered condition evaluation
- **Integration Nodes**: Connect with n8n, Temporal, Celery
- **Human Nodes**: Human-in-the-loop processing
- **Decision Nodes**: Multi-option AI decision making

### Enterprise Integration
- **Kong Gateway**: API routing and rate limiting
- **Redis**: Caching and session management
- **n8n**: Visual workflow integration
- **Temporal**: Reliable workflow execution
- **Celery**: Background task processing

## 📋 Prerequisites

- Python 3.11+
- Docker & Docker Compose
- Redis
- API keys for AI providers (OpenAI, Anthropic)

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Clone and navigate to the project
cd auterity-error-iq

# Set environment variables
export OPENAI_API_KEY="your-openai-key"
export ANTHROPIC_API_KEY="your-anthropic-key"
export LANGGRAPH_PORT=8002
```

### 2. Docker Deployment

```bash
# Start all services including LangGraph
docker-compose -f infrastructure/docker/docker-compose.unified.yml --profile ai-services up -d

# Check service health
curl http://localhost:8002/health
```

### 3. Manual Development Setup

```bash
# Install dependencies
cd systems/langgraph
pip install -r requirements.txt

# Start the service
python src/langgraph_service.py
```

## 📚 API Reference

### Create Workflow

```bash
curl -X POST http://localhost:8002/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_id": "example-workflow",
    "name": "AI Content Generator",
    "description": "Multi-step content creation pipeline",
    "nodes": [
      {
        "id": "research",
        "type": "llm",
        "config": {
          "prompt": "Research the topic: {{topic}}",
          "model": "gpt-4",
          "temperature": 0.3
        }
      },
      {
        "id": "generate",
        "type": "llm",
        "config": {
          "prompt": "Create content about: {{research}}",
          "model": "claude-3-sonnet-20240229"
        }
      }
    ],
    "edges": [
      {
        "source": "research",
        "target": "generate"
      }
    ]
  }'
```

### Execute Workflow

```bash
curl -X POST http://localhost:8002/workflows/example-workflow/execute \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "topic": "AI-powered workflow orchestration"
    }
  }'
```

### Get Metrics

```bash
curl http://localhost:8002/metrics
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | - | OpenAI API key |
| `ANTHROPIC_API_KEY` | - | Anthropic API key |
| `LANGGRAPH_PORT` | 8002 | Service port |
| `REDIS_HOST` | localhost | Redis host |
| `REDIS_PORT` | 6379 | Redis port |
| `REDIS_DB` | 4 | Redis database |
| `MAX_CONCURRENT_EXECUTIONS` | 50 | Max concurrent workflows |
| `MAX_EXECUTION_TIME` | 3600 | Max execution time (seconds) |

### Advanced Configuration

Edit `config/default.json` for detailed service configuration:

```json
{
  "ai": {
    "default_provider": "openai",
    "decision_making": {
      "temperature": 0.3,
      "max_tokens": 100,
      "model": "gpt-4"
    }
  },
  "integrations": {
    "n8n": {
      "base_url": "http://workflow-studio:3000"
    },
    "temporal": {
      "base_url": "http://temporal:7233"
    }
  }
}
```

## 🧪 Testing

### Unit Tests

```bash
cd systems/langgraph
python -m pytest tests/ -v
```

### Integration Tests

```bash
# Test with external services
python -m pytest tests/integration/ -v --integration
```

### Load Testing

```bash
# Install locust for load testing
pip install locust

# Run load tests
locust -f tests/load/test_langgraph_load.py
```

## 📊 Monitoring

### Health Checks

```bash
# Service health
curl http://localhost:8002/health

# Detailed metrics
curl http://localhost:8002/metrics
```

### Prometheus Integration

Metrics are exposed at `/metrics` endpoint for Prometheus scraping:

```yaml
scrape_configs:
  - job_name: 'langgraph'
    static_configs:
      - targets: ['langgraph-service:8002']
    metrics_path: '/metrics'
```

### Key Metrics

- `langgraph_workflows_total`: Total workflows created
- `langgraph_workflows_active`: Currently executing workflows
- `langgraph_execution_time_avg`: Average execution time
- `langgraph_decision_time_avg`: Average AI decision time
- `langgraph_success_rate`: Workflow success rate

## 🔌 Integration Examples

### Frontend Integration (React/TypeScript)

```typescript
import { LangGraphService, WorkflowDefinition } from './services/LangGraphService';

const langGraph = new LangGraphService();

// Create a workflow
const workflow: WorkflowDefinition = {
  workflowId: 'my-workflow',
  name: 'AI Content Pipeline',
  nodes: [...],
  edges: [...]
};

const result = await langGraph.createWorkflow(workflow);

// Execute workflow
const execution = await langGraph.executeWorkflow('my-workflow', {
  topic: 'Machine Learning'
});

console.log('Execution result:', execution);
```

### n8n Integration

```javascript
// Convert n8n workflow to LangGraph
const langGraphWorkflow = await langGraph.createFromN8nCanvas(
  n8nNodes,
  n8nEdges
);

// Execute with LangGraph intelligence
const result = await langGraph.executeWorkflow(
  langGraphWorkflow.workflowId,
  inputData
);
```

### Temporal Integration

```javascript
// Call from Temporal workflow
const langGraphResult = await temporal.callActivity(
  'langgraph.executeWorkflow',
  {
    workflowId: 'temporal-integrated-workflow',
    input: temporalInput
  }
);
```

## 🏗️ Development

### Project Structure

```
systems/langgraph/
├── src/
│   ├── langgraph_service.py      # Main FastAPI service
│   └── ...
├── config/
│   └── default.json              # Configuration
├── tests/
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── load/                     # Load tests
├── Dockerfile                    # Docker configuration
├── requirements.txt              # Python dependencies
└── README.md                     # This file
```

### Adding New Node Types

1. Add node type to `IntelligentWorkflowEngine.node_registry`
2. Implement node execution method
3. Update TypeScript types
4. Add tests

Example:

```python
async def _execute_custom_node(self, node: WorkflowNode, state: WorkflowState) -> Any:
    # Custom node implementation
    result = await self.custom_service.process(node.config)
    return result

# Register the new node type
self.node_registry['custom'] = self._execute_custom_node
```

### Custom AI Decision Making

Extend the decision making capabilities:

```python
async def _custom_ai_decision(self, state: WorkflowState, edges: List[WorkflowEdge]) -> Dict[str, Any]:
    # Custom decision logic
    decision = await self.ai_model.make_decision(state, edges)
    return decision
```

## 🚀 Deployment

### Docker Compose (Recommended)

```yaml
version: '3.8'
services:
  langgraph-service:
    build: ./systems/langgraph
    ports:
      - "8002:8002"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - langgraph_logs:/app/logs
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: langgraph-service
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: langgraph
        image: auterity/langgraph:latest
        ports:
        - containerPort: 8002
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: ai-secrets
              key: openai-key
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Redis connection established
- [ ] AI provider API keys set
- [ ] Monitoring and logging configured
- [ ] Health checks passing
- [ ] Load balancing configured
- [ ] Backup strategy implemented

## 📈 Performance Optimization

### Caching Strategies

- Workflow definitions cached in Redis
- AI model responses cached for similar inputs
- Execution results cached for debugging

### Resource Management

- Connection pooling for external services
- Rate limiting for AI provider calls
- Memory management for large workflows

### Scaling Considerations

- Horizontal scaling with load balancer
- Redis cluster for distributed caching
- Database persistence for workflow history

## 🔒 Security

### Authentication

- API key authentication
- JWT token support
- Kong Gateway integration

### Authorization

- Role-based access control
- Workflow ownership validation
- Execution permission checks

### Data Protection

- Input/output sanitization
- Secure credential storage
- Audit logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is part of the Auterity Unified AI Platform. See the main project LICENSE file for details.

## 🆘 Support

### Troubleshooting

**Common Issues:**

1. **Connection Refused**: Check if Redis is running and accessible
2. **API Key Errors**: Verify AI provider keys are correctly set
3. **Timeout Errors**: Increase timeout values in configuration
4. **Memory Issues**: Monitor resource usage and scale accordingly

### Getting Help

- Check the [Auterity Documentation](https://docs.auterity.com)
- Open an issue in the main repository
- Contact the development team

## 🎯 Roadmap

### Upcoming Features

- [ ] Advanced workflow templates
- [ ] Real-time collaboration
- [ ] Workflow versioning
- [ ] Advanced analytics dashboard
- [ ] Multi-tenant support
- [ ] Custom node development SDK
- [ ] Integration with additional AI providers
- [ ] Workflow marketplace

---

**Built with ❤️ for the Auterity Unified AI Platform**
