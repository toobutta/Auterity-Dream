# Auterity Unified AI Platform - API Documentation

## 🎯 API Overview

**Base URL**: `http://localhost:8080/api` (Development) | `https://api.auterity.com/api` (Production)
**Version**: v1
**Authentication**: JWT Bearer Token
**Content Type**: `application/json`
**Rate Limiting**: 1000 requests/minute per user

## 🔐 Authentication

### **JWT Authentication Flow**

```bash
# 1. Login to get access token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Response
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}

# 2. Use token in subsequent requests
curl -X GET http://localhost:8080/api/workflows \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### **Authentication Endpoints**

#### `POST /api/auth/login`

Authenticate user and return JWT tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### `POST /api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "full_name": "John Doe",
  "role": "user"
}
```

#### `POST /api/auth/refresh`

Refresh access token using refresh token.

**Request Body:**

```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### `POST /api/auth/logout`

Invalidate current session tokens.

## 🔄 Workflow Management

### **Workflow Endpoints**

#### `GET /api/workflows`

Retrieve all workflows for authenticated user.

**Query Parameters:**

- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 20)
- `status` (string): Filter by status (active, inactive, archived)
- `category` (string): Filter by category

**Response:**

```json
{
  "workflows": [
    {
      "id": "workflow-uuid",
      "name": "Customer Onboarding",
      "description": "Automated customer onboarding workflow",
      "status": "active",
      "category": "automation",
      "steps": [
        {
          "id": "step-1",
          "type": "email",
          "name": "Welcome Email",
          "config": {
            "template": "welcome-template",
            "delay": 0
          }
        }
      ],
      "created_at": "2025-08-25T10:00:00Z",
      "updated_at": "2025-08-25T15:30:00Z",
      "created_by": "user-uuid"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 20,
  "has_next": true
}
```

#### `POST /api/workflows`

Create a new workflow.

**Request Body:**

```json
{
  "name": "New Workflow",
  "description": "Description of the workflow",
  "category": "automation",
  "steps": [
    {
      "type": "ai_prompt",
      "name": "Generate Response",
      "config": {
        "prompt": "Analyze the following customer feedback:",
        "model": "gpt-4",
        "max_tokens": 500
      },
      "position": { "x": 100, "y": 100 }
    },
    {
      "type": "email",
      "name": "Send Summary",
      "config": {
        "template": "summary-template",
        "to": "manager@company.com"
      },
      "position": { "x": 300, "y": 100 },
      "dependencies": ["step-1"]
    }
  ]
}
```

#### `GET /api/workflows/{workflow_id}`

Retrieve specific workflow by ID.

#### `PUT /api/workflows/{workflow_id}`

Update existing workflow.

#### `DELETE /api/workflows/{workflow_id}`

Delete workflow (soft delete).

### **Workflow Execution**

#### `POST /api/workflows/{workflow_id}/execute`

Execute a workflow with input data.

**Request Body:**

```json
{
  "input_data": {
    "customer_email": "customer@example.com",
    "customer_name": "John Smith",
    "feedback": "Great service, but delivery was slow"
  },
  "priority": "normal",
  "scheduled_at": "2025-08-25T16:00:00Z"
}
```

**Response:**

```json
{
  "execution_id": "execution-uuid",
  "workflow_id": "workflow-uuid",
  "status": "running",
  "started_at": "2025-08-25T15:45:00Z",
  "input_data": {
    "customer_email": "customer@example.com",
    "customer_name": "John Smith"
  },
  "progress": {
    "completed_steps": 0,
    "total_steps": 3,
    "current_step": "Generate Response"
  }
}
```

#### `GET /api/executions/{execution_id}`

Get execution status and results.

**Response:**

```json
{
  "id": "execution-uuid",
  "workflow_id": "workflow-uuid",
  "status": "completed",
  "started_at": "2025-08-25T15:45:00Z",
  "completed_at": "2025-08-25T15:47:30Z",
  "duration": 150,
  "progress": {
    "completed_steps": 3,
    "total_steps": 3,
    "current_step": null
  },
  "results": {
    "step-1": {
      "status": "completed",
      "output": "Analysis shows positive sentiment with delivery concern",
      "tokens_used": 85,
      "cost": 0.0042
    },
    "step-2": {
      "status": "completed",
      "output": "Email sent successfully",
      "recipients": ["manager@company.com"]
    }
  },
  "logs": [
    {
      "timestamp": "2025-08-25T15:45:00Z",
      "level": "info",
      "message": "Workflow execution started"
    },
    {
      "timestamp": "2025-08-25T15:45:15Z",
      "level": "info",
      "message": "Step 'Generate Response' completed"
    }
  ]
}
```

#### `POST /api/executions/{execution_id}/cancel`

Cancel running execution.

## 📝 Template Management

### **Template Endpoints**

#### `GET /api/templates`

Retrieve available workflow templates.

**Query Parameters:**

- `category` (string): Filter by category
- `featured` (boolean): Show only featured templates

**Response:**

```json
{
  "templates": [
    {
      "id": "template-uuid",
      "name": "Customer Support Automation",
      "description": "Automated customer support ticket processing",
      "category": "customer_service",
      "featured": true,
      "steps": [
        {
          "type": "ai_prompt",
          "name": "Categorize Ticket",
          "config": {
            "prompt": "Categorize this support ticket: {{ticket_content}}",
            "model": "gpt-3.5-turbo"
          }
        }
      ],
      "preview_image": "/templates/customer-support.png",
      "usage_count": 1250,
      "rating": 4.8,
      "created_at": "2025-08-01T00:00:00Z"
    }
  ]
}
```

#### `POST /api/templates/{template_id}/instantiate`

Create workflow from template.

**Request Body:**

```json
{
  "name": "My Customer Support Workflow",
  "customizations": {
    "step-1": {
      "config": {
        "model": "gpt-4"
      }
    }
  }
}
```

## 🤖 AI Services Integration

### **RelayCore (AI Routing)**

#### `POST /api/ai/route`

Route AI request through intelligent routing system.

**Request Body:**

```json
{
  "prompt": "Analyze this customer feedback for sentiment",
  "context": "customer_service",
  "max_tokens": 200,
  "temperature": 0.7,
  "routing_preferences": {
    "cost_optimization": true,
    "quality_preference": "balanced",
    "budget_limit": 0.5
  }
}
```

**Response:**

```json
{
  "response": "The customer feedback shows positive sentiment overall...",
  "model_used": "gpt-3.5-turbo",
  "provider": "openai",
  "cost": 0.024,
  "tokens_used": 156,
  "routing_reason": "cost_optimized",
  "response_time": 850,
  "quality_score": 0.89
}
```

#### `GET /api/ai/models`

Get available AI models and pricing.

**Response:**

```json
{
  "models": [
    {
      "id": "gpt-4",
      "provider": "openai",
      "cost_per_token": 0.00003,
      "max_tokens": 8192,
      "capabilities": ["text", "reasoning", "code"],
      "quality_score": 0.95,
      "avg_response_time": 2500
    },
    {
      "id": "gpt-3.5-turbo",
      "provider": "openai",
      "cost_per_token": 0.000002,
      "max_tokens": 4096,
      "capabilities": ["text", "basic_reasoning"],
      "quality_score": 0.85,
      "avg_response_time": 800
    }
  ]
}
```

### **RelayCore AI Router (Model Management)**

#### `GET /api/models/available`

Get available AI models across all providers.

**Response:**
```json
{
  "models": [
    {
      "id": "gpt-4",
      "provider": "openai",
      "name": "GPT-4",
      "context_window": 8192,
      "cost_per_token": 0.00003,
      "status": "available"
    },
    {
      "id": "claude-3-sonnet",
      "provider": "anthropic",
      "name": "Claude 3 Sonnet",
      "context_window": 200000,
      "cost_per_token": 0.000015,
      "status": "available"
    }
  ]
}
```

#### `POST /api/models/route`

Route a request to the optimal AI model based on performance and cost.

**Request Body:**
```json
{
  "prompt": "Analyze this customer feedback...",
  "task_type": "analysis",
  "max_tokens": 1000,
  "priority": "cost", // "cost", "performance", "balanced"
  "providers": ["openai", "anthropic", "google"]
}
```

**Response:**
```json
{
  "model": "claude-3-sonnet",
  "provider": "anthropic",
  "estimated_cost": 0.0015,
  "estimated_tokens": 500,
  "confidence_score": 0.92
}
```

## 📊 Analytics & Monitoring

### **Analytics Endpoints**

#### `GET /api/analytics/dashboard`

Get dashboard analytics data.

**Response:**

```json
{
  "overview": {
    "total_workflows": 156,
    "active_executions": 12,
    "total_executions_today": 89,
    "success_rate": 97.8,
    "avg_execution_time": 45.6
  },
  "usage_stats": {
    "ai_requests_today": 234,
    "total_cost_today": 12.45,
    "tokens_consumed": 45678,
    "most_used_model": "gpt-3.5-turbo"
  },
  "performance_metrics": {
    "avg_response_time": 850,
    "error_rate": 0.02,
    "uptime": 99.9
  }
}
```

#### `GET /api/analytics/workflows/{workflow_id}/metrics`

Get detailed metrics for specific workflow.

#### `GET /api/analytics/costs`

Get cost breakdown and budget tracking.

**Response:**

```json
{
  "current_month": {
    "total_spent": 245.67,
    "budget_limit": 500.0,
    "budget_used_percentage": 49.13,
    "projected_monthly_cost": 492.34
  },
  "cost_breakdown": {
    "openai_gpt4": 156.23,
    "openai_gpt35": 45.67,
    "anthropic_claude": 34.89,
    "custom_models": 8.88
  },
  "daily_usage": [
    {
      "date": "2025-08-25",
      "cost": 12.45,
      "requests": 234
    }
  ]
}
```

## 🔔 Real-time Updates (WebSocket)

### **WebSocket Connection**

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:8080/ws/executions');

// Listen for execution updates
ws.onmessage = function(event) {
  const update = JSON.parse(event.data);
  console.log('Execution update:', update);
};

// Example update message
{
  "type": "execution_update",
  "execution_id": "execution-uuid",
  "status": "step_completed",
  "step_name": "Generate Response",
  "progress": {
    "completed_steps": 2,
    "total_steps": 3
  },
  "timestamp": "2025-08-25T15:46:30Z"
}
```

### **WebSocket Events**

- `execution_started`: Workflow execution began
- `step_completed`: Individual step finished
- `execution_completed`: Workflow finished successfully
- `execution_failed`: Workflow failed with error
- `execution_cancelled`: Workflow was cancelled

## 🚨 Error Handling

### **Standard Error Response**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid workflow configuration",
    "details": {
      "field": "steps[0].config.prompt",
      "issue": "Prompt cannot be empty"
    },
    "timestamp": "2025-08-25T15:30:00Z",
    "request_id": "req-uuid"
  }
}
```

### **Error Codes**

| Code               | Description                       | HTTP Status |
| ------------------ | --------------------------------- | ----------- |
| `UNAUTHORIZED`     | Invalid or missing authentication | 401         |
| `FORBIDDEN`        | Insufficient permissions          | 403         |
| `NOT_FOUND`        | Resource not found                | 404         |
| `VALIDATION_ERROR` | Request validation failed         | 422         |
| `RATE_LIMITED`     | Too many requests                 | 429         |
| `INTERNAL_ERROR`   | Server error                      | 500         |
| `AI_SERVICE_ERROR` | AI provider error                 | 502         |
| `WORKFLOW_ERROR`   | Workflow execution error          | 400         |

## 📋 Request/Response Examples

### **Complete Workflow Creation Example**

```bash
# Create a customer onboarding workflow
curl -X POST http://localhost:8080/api/workflows \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Onboarding Automation",
    "description": "Automated workflow for new customer onboarding",
    "category": "customer_service",
    "steps": [
      {
        "id": "welcome-email",
        "type": "email",
        "name": "Send Welcome Email",
        "config": {
          "template": "welcome-template",
          "to": "{{customer_email}}",
          "subject": "Welcome to Auterity!"
        },
        "position": {"x": 100, "y": 100}
      },
      {
        "id": "setup-account",
        "type": "api_call",
        "name": "Setup Customer Account",
        "config": {
          "url": "https://api.crm.com/customers",
          "method": "POST",
          "headers": {
            "Authorization": "Bearer crm-token"
          },
          "body": {
            "email": "{{customer_email}}",
            "name": "{{customer_name}}",
            "source": "auterity_onboarding"
          }
        },
        "position": {"x": 300, "y": 100},
        "dependencies": ["welcome-email"]
      },
      {
        "id": "ai-personalization",
        "type": "ai_prompt",
        "name": "Generate Personalized Content",
        "config": {
          "prompt": "Create personalized content for {{customer_name}} based on their industry: {{customer_industry}}",
          "model": "gpt-4",
          "max_tokens": 300
        },
        "position": {"x": 500, "y": 100},
        "dependencies": ["setup-account"]
      }
    ]
  }'
```

### **Execute Workflow Example**

```bash
# Execute the workflow with customer data
curl -X POST http://localhost:8080/api/workflows/workflow-uuid/execute \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "input_data": {
      "customer_email": "john.doe@example.com",
      "customer_name": "John Doe",
      "customer_industry": "Technology"
    },
    "priority": "high"
  }'
```

## 🔍 Testing & Development

### **Health Check Endpoints**

```bash
# System health
curl http://localhost:8080/api/health

# Detailed health with dependencies
curl http://localhost:8080/api/health/detailed

# Service readiness
curl http://localhost:8080/api/ready
```

### **Development Tools**

- **OpenAPI Documentation**: http://localhost:8080/docs
- **Interactive API Explorer**: http://localhost:8080/redoc
- **Postman Collection**: Available in `/docs/api/auterity-api.postman_collection.json`

## 📚 SDK & Client Libraries

### **Python SDK**

```python
from auterity_sdk import AuterityClient

# Initialize client
client = AuterityClient(
    base_url="http://localhost:8080",
    api_key="your-api-key"
)

# Create workflow
workflow = client.workflows.create({
    "name": "Test Workflow",
    "steps": [...]
})

# Execute workflow
execution = client.workflows.execute(
    workflow.id,
    input_data={"key": "value"}
)

# Monitor execution
status = client.executions.get_status(execution.id)
```

### **JavaScript SDK**

```javascript
import { AuteritySDK } from '@auterity/sdk';

const client = new AuteritySDK({
  baseUrl: 'http://localhost:8080',
  apiKey: 'your-api-key'
});

// Create and execute workflow
const workflow = await client.workflows.create({
  name: 'Test Workflow',
  steps: [...]
});

const execution = await client.workflows.execute(workflow.id, {
  inputData: { key: 'value' }
});

// Stream execution updates
const stream = client.executions.stream(execution.id);
stream.onUpdate((update) => {
  console.log('Execution progress:', update);
});
```

---

**Last Updated**: August 25, 2025
**API Version**: v1
**Documentation Version**: 1.0.0
