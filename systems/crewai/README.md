# Auterity CrewAI Service

Intelligent multi-agent collaborative systems with AI-powered orchestration and role-based teamwork.

## 🚀 Overview

The CrewAI Service provides advanced multi-agent collaboration capabilities that enable intelligent teams of AI agents to work together on complex tasks. It supports hierarchical, democratic, and swarm collaboration strategies with intelligent task assignment and performance optimization.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Kong Gateway  │    │   CrewAI        │
│   (React)       │────│   (API Routes)  │────│   Service       │
│                 │    │                 │    │   (FastAPI)     │
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

### Intelligent Multi-Agent Orchestration
- **Role-Based Agents**: Specialized agents with defined capabilities and expertise
- **Dynamic Task Assignment**: AI-powered assignment of tasks to best-suited agents
- **Collaboration Strategies**: Hierarchical, democratic, and swarm coordination
- **Performance Tracking**: Real-time monitoring and optimization

### Agent Capabilities System
- **Capability Registry**: Extensible system for agent skills and tools
- **Expertise Matching**: Intelligent matching of tasks to agent expertise
- **Performance Scoring**: Continuous learning and improvement
- **Collaboration Patterns**: Pre-defined interaction patterns between agents

### Advanced Collaboration Modes

#### Hierarchical Mode
- **Manager-Agent Coordination**: Structured command chain with intelligent delegation
- **Task Breakdown**: Automatic decomposition of complex tasks
- **Quality Control**: Multi-level review and approval processes
- **Progress Tracking**: Detailed execution monitoring and reporting

#### Democratic Mode
- **Consensus-Based Decisions**: Agent voting and agreement protocols
- **Peer Review**: Collaborative quality assurance and improvement
- **Conflict Resolution**: Intelligent resolution of conflicting recommendations
- **Knowledge Sharing**: Cross-agent learning and skill transfer

#### Swarm Mode
- **Parallel Processing**: Concurrent task execution across multiple agents
- **Load Balancing**: Dynamic distribution of work based on agent capacity
- **Emergent Intelligence**: Collective problem-solving capabilities
- **Scalability**: Horizontal scaling with additional agents

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
export CREWAI_PORT=8003
```

### 2. Docker Deployment

```bash
# Start all services including CrewAI
docker-compose -f infrastructure/docker/docker-compose.unified.yml --profile ai-services up -d

# Check service health
curl http://localhost:8003/health
```

### 3. Manual Development Setup

```bash
# Install dependencies
cd systems/crewai
pip install -r requirements.txt

# Start the service
python src/crewai_service.py
```

## 📚 API Reference

### Create Crew

```bash
curl -X POST http://localhost:8003/crews \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Content Creation Team",
    "description": "AI-powered content creation and optimization crew",
    "goal": "Create high-quality, SEO-optimized content",
    "collaboration_strategy": "hierarchical",
    "agents": [
      {
        "id": "researcher",
        "name": "Research Specialist",
        "role": {
          "name": "Research Analyst",
          "description": "Expert at gathering information",
          "capabilities": [
            {
              "name": "web_research",
              "description": "Research topics online",
              "required_tools": ["web_search"]
            }
          ],
          "expertise_areas": ["research", "data_analysis"]
        },
        "model": "gpt-4",
        "temperature": 0.3
      },
      {
        "id": "writer",
        "name": "Content Writer",
        "role": {
          "name": "Creative Writer",
          "description": "Skilled at creating content",
          "capabilities": [
            {
              "name": "content_creation",
              "description": "Write articles and blog posts"
            }
          ],
          "expertise_areas": ["creative_writing", "copywriting"]
        },
        "model": "claude-3-sonnet-20240229",
        "temperature": 0.7
      }
    ],
    "tasks": [
      {
        "id": "research_topic",
        "description": "Research the given topic comprehensively",
        "priority": 1
      },
      {
        "id": "write_content",
        "description": "Write engaging content based on research",
        "priority": 2,
        "dependencies": ["research_topic"]
      }
    ]
  }'
```

### Execute Crew

```bash
curl -X POST http://localhost:8003/crews/crew-123/execute \
  -H "Content-Type: application/json" \
  -d '{
    "input_data": {
      "topic": "AI-powered workflow automation",
      "target_audience": "enterprise developers",
      "word_count": 1500
    },
    "context": {
      "deadline": "2024-12-31",
      "quality_requirements": "high"
    }
  }'
```

### Get Crew Information

```bash
# Get crew details
curl http://localhost:8003/crews/crew-123

# List all crews
curl http://localhost:8003/crews

# Get agent pool
curl http://localhost:8003/agents

# Get metrics
curl http://localhost:8003/metrics
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | - | OpenAI API key |
| `ANTHROPIC_API_KEY` | - | Anthropic API key |
| `CREWAI_PORT` | 8003 | Service port |
| `REDIS_HOST` | localhost | Redis host |
| `REDIS_PORT` | 6379 | Redis port |
| `REDIS_DB` | 5 | Redis database |
| `MAX_CONCURRENT_CREWS` | 10 | Max concurrent crews |
| `MAX_AGENTS_PER_CREW` | 20 | Max agents per crew |
| `MAX_TASKS_PER_CREW` | 50 | Max tasks per crew |

### Advanced Configuration

Edit `config/default.json` for detailed service configuration:

```json
{
  "crew": {
    "max_concurrent_crews": 10,
    "max_agents_per_crew": 20,
    "max_tasks_per_crew": 50,
    "default_collaboration_strategy": "hierarchical",
    "task_timeout_seconds": 300,
    "crew_execution_timeout": 1800
  },
  "ai": {
    "agent_defaults": {
      "temperature": 0.7,
      "max_tokens": 2000,
      "memory_size": 100
    }
  },
  "collaboration": {
    "strategies": {
      "hierarchical": {
        "max_chain_depth": 5,
        "manager_selection": "capability_based"
      },
      "democratic": {
        "voting_timeout": 30,
        "consensus_threshold": 0.6
      },
      "swarm": {
        "max_parallel_tasks": 10,
        "load_balancing": "round_robin"
      }
    }
  }
}
```

## 🧪 Testing

### Unit Tests

```bash
cd systems/crewai
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
locust -f tests/load/test_crewai_load.py
```

## 📊 Monitoring

### Health Checks

```bash
# Service health
curl http://localhost:8003/health

# Detailed metrics
curl http://localhost:8003/metrics
```

### Prometheus Integration

Metrics are exposed at `/metrics` endpoint for Prometheus scraping:

```yaml
scrape_configs:
  - job_name: 'crewai'
    static_configs:
      - targets: ['crewai-service:8003']
    metrics_path: '/metrics'
```

### Key Metrics

- `crewai_crews_total`: Total crews created
- `crewai_crews_active`: Currently executing crews
- `crewai_execution_time_avg`: Average crew execution time
- `crewai_collaboration_efficiency`: Collaboration efficiency score
- `crewai_agent_utilization_rate`: Agent utilization percentage
- `crewai_task_completion_rate`: Task completion success rate

## 🔌 Integration Examples

### Frontend Integration (React/TypeScript)

```typescript
import { CrewAIService, Crew } from './services/CrewAIService';

const crewAI = new CrewAIService();

// Create a content creation crew
const crew: Crew = {
  name: 'Content Creation Team',
  description: 'AI-powered content creation crew',
  goal: 'Create high-quality blog posts',
  collaboration_strategy: 'hierarchical',
  agents: [...],
  tasks: [...]
};

const result = await crewAI.createCrew(crew);

// Execute the crew
const execution = await crewAI.executeCrew(result.crew_id, {
  topic: 'Machine Learning Trends 2024',
  target_audience: 'developers',
  word_count: 2000
});

console.log('Crew execution result:', execution);
```

### Template-Based Crew Creation

```typescript
// Create from pre-built template
const contentCrew = await crewAI.createTemplate('content-creation');
const crewResult = await crewAI.createCrew(contentCrew);

// Execute with custom input
const execution = await crewAI.executeCrew(crewResult.crew_id, {
  topic: 'Sustainable AI Development',
  style: 'technical',
  audience: 'enterprise'
});
```

### Advanced Collaboration Patterns

```typescript
// Monitor crew execution in real-time
const execution = await crewAI.executeCrew(crewId, inputData, {
  onProgress: (result) => {
    console.log('Execution progress:', result.status);
    console.log('Completed tasks:', result.task_results?.length || 0);
  }
});

// Get detailed performance metrics
const metrics = await crewAI.getMetrics();
console.log('Collaboration efficiency:', metrics.collaboration_efficiency);
```

## 🏗️ Development

### Project Structure

```
systems/crewai/
├── src/
│   ├── crewai_service.py      # Main FastAPI service
│   └── ...
├── config/
│   └── default.json          # Configuration
├── tests/
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── load/                 # Load tests
├── Dockerfile                # Docker configuration
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

### Adding New Agent Roles

1. Define the agent role with capabilities
2. Add role to the agent registry
3. Implement role-specific behaviors
4. Update collaboration patterns
5. Add tests

Example:

```python
# Define new role
analyst_role = AgentRole(
    name="Business Analyst",
    description="Expert at business analysis and insights",
    capabilities=[
        AgentCapability(
            name="market_analysis",
            description="Analyze market trends and opportunities",
            required_tools=["data_analysis", "reporting"]
        )
    ],
    expertise_areas=["business_intelligence", "market_research"]
)

# Create agent with role
analyst_agent = CrewAgent(
    id="business_analyst_001",
    name="Business Analyst",
    role=analyst_role,
    model="gpt-4",
    temperature=0.3
)
```

### Custom Collaboration Strategies

Extend collaboration strategies:

```python
async def custom_collaboration_strategy(self, crew: Crew, tasks: List[Task]) -> Any:
    """Implement custom collaboration logic"""
    # Custom strategy implementation
    results = []

    for task in tasks:
        # Custom task assignment logic
        agent = self.select_agent_by_custom_criteria(task, crew.agents)
        result = await self.execute_agent_task(agent, task, {})
        results.append(result)

    return self.combine_results(results)
```

### Performance Optimization

- **Agent Caching**: Cache agent capabilities and performance metrics
- **Task Parallelization**: Execute independent tasks concurrently
- **Resource Pooling**: Share resources across multiple crews
- **Intelligent Scheduling**: Optimize task execution order

## 🔒 Security

### Authentication

- **API Key Authentication**: Secure access to crew operations
- **Role-Based Access Control**: Different permissions for crew management
- **Audit Logging**: Track all crew operations and agent actions

### Data Protection

- **Input Sanitization**: Validate and sanitize all inputs
- **Output Filtering**: Filter sensitive information from results
- **Secure Storage**: Encrypted storage of crew configurations

### Access Control

- **Crew Ownership**: Users can only access their own crews
- **Agent Permissions**: Control which agents can perform certain actions
- **Execution Limits**: Rate limiting and resource quotas

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

1. **Agent Assignment Failures**: Check agent capabilities match task requirements
2. **Execution Timeouts**: Increase timeout values or optimize task complexity
3. **Collaboration Deadlocks**: Review task dependencies and agent availability
4. **Performance Issues**: Monitor resource usage and scale appropriately

### Getting Help

- Check the [Auterity Documentation](https://docs.auterity.com)
- Open an issue in the main repository
- Contact the development team

## 🎯 Roadmap

### Upcoming Features

- [ ] Advanced agent training and specialization
- [ ] Cross-crew collaboration and knowledge sharing
- [ ] Real-time collaboration dashboards
- [ ] Agent marketplace and sharing
- [ ] Custom collaboration strategy builder
- [ ] Advanced performance analytics
- [ ] Integration with external agent frameworks
- [ ] Multi-modal agent capabilities
- [ ] Autonomous crew evolution and adaptation

---

**Built with ❤️ for the Auterity Unified AI Platform**

