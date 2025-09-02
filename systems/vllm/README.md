# 🚀 Auterity vLLM Service

High-throughput AI model serving with GPU acceleration for the Auterity platform.

## Overview

The vLLM service provides optimized AI model inference capabilities with:
- **GPU Acceleration**: Up to 24x faster inference than CPU-based serving
- **High Throughput**: Process 1000+ tokens/second
- **Auto-scaling**: Intelligent resource management
- **Caching**: Smart response caching for improved performance
- **Monitoring**: Real-time performance metrics and health checks
- **Fallback Support**: Graceful degradation when GPU is unavailable

## Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Configure your settings
nano .env
```

Required environment variables:
```bash
# Model Configuration
VLLM_MODEL_NAME=meta-llama/Llama-2-7b-chat-hf
VLLM_GPU_MEMORY_UTILIZATION=0.9

# Service Configuration
VLLM_PORT=8001
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 2. Start the Service

```bash
# Using Docker Compose
docker-compose -f infrastructure/docker/vllm/docker-compose.yml up -d

# Or build and run manually
docker build -t auterity-vllm .
docker run -p 8001:8001 \
  -e VLLM_MODEL_NAME=meta-llama/Llama-2-7b-chat-hf \
  -e REDIS_HOST=redis \
  auterity-vllm
```

### 3. Verify Installation

```bash
# Check service health
curl http://localhost:8001/health

# Expected response:
{
  "status": "healthy",
  "vllm_initialized": true,
  "active_requests": 0,
  "queue_depth": 0,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## API Usage

### Generate Text

**Endpoint:** `POST /v1/generate`

Generate text using the loaded AI model with optimized performance.

```bash
curl -X POST http://localhost:8001/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain quantum computing in simple terms",
    "temperature": 0.7,
    "max_tokens": 500,
    "top_p": 1.0,
    "stop_sequences": ["\\n\\n"]
  }'
```

**Response:**
```json
{
  "response": "Quantum computing uses quantum mechanics principles...",
  "usage": {
    "prompt_tokens": 8,
    "completion_tokens": 127,
    "total_tokens": 135
  },
  "performance": {
    "latency_ms": 245,
    "model": "meta-llama/Llama-2-7b-chat-hf",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "metadata": {
    "finish_reason": "length",
    "cached": false
  }
}
```

### Streaming Responses

Enable real-time streaming for better user experience:

```bash
curl -X POST http://localhost:8001/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a short story about AI",
    "stream": true,
    "temperature": 0.8,
    "max_tokens": 1000
  }'
```

### Get Service Metrics

**Endpoint:** `GET /v1/metrics`

Monitor service performance and health:

```bash
curl http://localhost:8001/v1/metrics
```

**Response:**
```json
{
  "model_metrics": {
    "model_name": "meta-llama/Llama-2-7b-chat-hf",
    "requests_per_second": 45.2,
    "average_latency_ms": 245.3,
    "gpu_memory_used_gb": 12.4,
    "gpu_memory_total_gb": 16.0,
    "active_requests": 2,
    "queue_depth": 0,
    "cache_hit_rate": 0.23
  },
  "global_metrics": {
    "total_requests": 15420,
    "successful_requests": 15380,
    "failed_requests": 40,
    "total_tokens": 2847500,
    "average_latency": 234.5,
    "gpu_memory_usage": 0.775
  },
  "gpu_info": {
    "available": true,
    "device_count": 1,
    "devices": [
      {
        "id": 0,
        "name": "NVIDIA A100-SXM4-16GB",
        "total_memory_gb": 16.0,
        "allocated_memory_gb": 12.4,
        "reserved_memory_gb": 13.2,
        "utilization": 0.775
      }
    ]
  },
  "health_status": "healthy"
}
```

## Configuration Options

### Model Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `VLLM_MODEL_NAME` | `meta-llama/Llama-2-7b-chat-hf` | Hugging Face model name |
| `VLLM_TENSOR_PARALLEL_SIZE` | `1` | GPU parallelism |
| `VLLM_GPU_MEMORY_UTILIZATION` | `0.9` | GPU memory usage (0.0-1.0) |
| `VLLM_MAX_MODEL_LEN` | `4096` | Maximum sequence length |
| `VLLM_MAX_BATCH_SIZE` | `32` | Maximum batch size |
| `VLLM_DTYPE` | `auto` | Data type (auto, float16, int8) |
| `VLLM_QUANTIZATION` | `null` | Quantization method |

### Service Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `VLLM_PORT` | `8001` | Service port |
| `REDIS_HOST` | `localhost` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `REDIS_DB` | `3` | Redis database |
| `LOG_LEVEL` | `INFO` | Logging level |

## Supported Models

### Text Generation Models
- **Llama 2**: `meta-llama/Llama-2-7b-chat-hf`, `meta-llama/Llama-2-13b-chat-hf`
- **Mistral**: `mistralai/Mistral-7B-Instruct-v0.1`
- **Microsoft**: `microsoft/DialoGPT-medium`
- **Custom Models**: Any Hugging Face model with compatible architecture

### Model Requirements
- **Memory**: Minimum 8GB GPU memory recommended
- **Compatibility**: Models must support the transformers library
- **License**: Ensure you have appropriate licenses for commercial use

## Performance Optimization

### GPU Optimization
```bash
# Maximize GPU utilization
export VLLM_GPU_MEMORY_UTILIZATION=0.95
export VLLM_TENSOR_PARALLEL_SIZE=2  # For multi-GPU setups
export VLLM_DTYPE=float16  # Reduce precision for speed
```

### Caching Strategy
```bash
# Enable response caching
export REDIS_HOST=localhost
export REDIS_PORT=6379

# Configure cache settings in config/default.json
{
  "cache": {
    "enabled": true,
    "ttl_seconds": 3600,
    "max_cache_size": 10000
  }
}
```

### Batch Processing
The service automatically optimizes batch processing based on:
- Queue depth
- GPU utilization
- Memory availability
- Request patterns

## Monitoring & Observability

### Health Checks
```bash
# Service health
curl http://localhost:8001/health

# Detailed metrics
curl http://localhost:8001/v1/metrics
```

### Prometheus Metrics
The service exposes metrics at `/v1/metrics` compatible with Prometheus monitoring.

### Logging
Logs are available at:
- Console output (when running locally)
- Docker logs: `docker logs auterity-vllm`
- File logs: `/app/logs/vllm_service.log`

## Troubleshooting

### Common Issues

#### 1. GPU Not Available
```bash
# Check GPU status
nvidia-smi

# Solution: Ensure NVIDIA drivers are installed
# For Docker: Use --gpus flag
docker run --gpus all -p 8001:8001 auterity-vllm
```

#### 2. Model Loading Failures
```bash
# Check model availability
curl http://localhost:8001/v1/models

# Solution: Verify model name and access permissions
# Some models require authentication
export HF_TOKEN=your_huggingface_token
```

#### 3. Memory Issues
```bash
# Reduce memory utilization
export VLLM_GPU_MEMORY_UTILIZATION=0.7

# Use smaller models
export VLLM_MODEL_NAME=microsoft/DialoGPT-small
```

#### 4. High Latency
```bash
# Check metrics
curl http://localhost:8001/v1/metrics

# Solutions:
# - Reduce batch size
# - Use quantization
# - Enable caching
# - Scale GPU resources
```

### Performance Tuning

#### For Maximum Throughput
```bash
export VLLM_MAX_BATCH_SIZE=64
export VLLM_GPU_MEMORY_UTILIZATION=0.95
export VLLM_DTYPE=float16
```

#### For Low Latency
```bash
export VLLM_MAX_BATCH_SIZE=1
export VLLM_MAX_MODEL_LEN=2048
export VLLM_DTYPE=float32
```

## Integration Examples

### With Auterity Workflow Studio
```typescript
import { AuterityAI } from '@auterity/ai-sdk';

const ai = new AuterityAI({
  apiKey: process.env.AUTERITY_API_KEY,
  vllmEndpoint: 'http://localhost:8001'
});

// Use vLLM for high-throughput tasks
const result = await ai.generate({
  prompt: "Analyze this dataset",
  service: 'vllm',  // Explicitly use vLLM
  temperature: 0.3,  // Lower temperature for analysis
  max_tokens: 1000
});
```

### With Celery Tasks
```python
from celery import Celery
from auterity_vllm import VLLMClient

app = Celery('auterity')
vllm = VLLMClient('http://localhost:8001')

@app.task
def process_ai_request(prompt: str) -> dict:
    """Process AI request using vLLM"""
    return vllm.generate({
        'prompt': prompt,
        'temperature': 0.7,
        'max_tokens': 500
    })
```

### With Redis Queue
```python
import redis
from auterity_vllm import VLLMClient

redis_client = redis.Redis()
vllm = VLLMClient('http://localhost:8001')

def process_queue():
    """Process queued AI requests"""
    while True:
        request = redis_client.blpop('ai_queue', timeout=1)
        if request:
            result = vllm.generate(request[1])
            redis_client.set(f"result:{request[0]}", json.dumps(result))
```

## Security Considerations

### API Security
- All endpoints require proper authentication
- Rate limiting prevents abuse
- Request size limits prevent DoS attacks
- CORS configuration for web applications

### Model Security
- Validate all input prompts
- Sanitize model outputs
- Monitor for adversarial inputs
- Log all requests for audit trails

### Infrastructure Security
- Run in isolated containers
- Use read-only file systems where possible
- Implement network segmentation
- Regular security updates

## Contributing

### Development Setup
```bash
# Clone the repository
git clone https://github.com/auterity/platform.git
cd systems/vllm

# Install dependencies
pip install -r requirements.txt

# Run tests
python -m pytest tests/

# Start development server
python src/vllm_service.py
```

### Code Structure
```
systems/vllm/
├── src/
│   ├── vllm_service.py      # Main service implementation
│   ├── warmup.py           # Model warmup script
│   └── __init__.py
├── config/
│   └── default.json        # Configuration file
├── tests/
│   └── test_vllm.py        # Unit tests
├── requirements.txt         # Python dependencies
├── Dockerfile              # Container definition
└── README.md              # This file
```

## License

This service is part of the Auterity platform and follows the same licensing terms.

## Support

For issues and questions:
- 📧 Email: support@auterity.com
- 💬 Discord: https://discord.gg/auterity
- 📖 Docs: https://docs.auterity.com/vllm
- 🐛 Issues: https://github.com/auterity/platform/issues

---

**Version:** 1.0.0
**Last Updated:** January 2025
**Compatibility:** Auterity Platform v2.0+
