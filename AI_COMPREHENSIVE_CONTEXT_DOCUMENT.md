# AUTERITY UNIFIED AI PLATFORM - COMPREHENSIVE AI CONTEXT DOCUMENT

## 🎯 EXECUTIVE SUMMARY FOR AI CODING TOOLS

**PLATFORM NAME**: Auterity Unified AI Platform
**REPOSITORY**: auterity-error-iq
**ARCHITECTURE**: Three-System Integration (AutoMatrix + RelayCore + NeuroWeaver)
**STATUS**: Production Ready (90% Complete)
**PURPOSE**: Enterprise workflow automation with intelligent AI routing and model specialization
**VERSION**: 1.0.0
**LAST UPDATED**: August 25, 2025

**CRITICAL FOR AI TOOLS**: This is a complex multi-system platform with 26 integrated services. Understanding the three-system architecture is essential for making appropriate code changes.

## 🏗️ THREE-SYSTEM ARCHITECTURE OVERVIEW

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

Kong API Gateway → Nginx Load Balancer → 26 Integrated Services
```

### **SYSTEM ROLES**

1. **AutoMatrix** (Port 8000): Core workflow automation engine with visual builder
2. **RelayCore** (Port 3001): Intelligent AI request routing with cost optimization
3. **NeuroWeaver** (Port 3002): Specialized AI model training and deployment

## 💻 TECHNOLOGY STACK MATRIX

| Component          | AutoMatrix            | RelayCore               | NeuroWeaver           | Shared Infrastructure |
| ------------------ | --------------------- | ----------------------- | --------------------- | --------------------- |
| **Backend**        | Python 3.11 + FastAPI | Node.js 18 + TypeScript | Python 3.11 + FastAPI | PostgreSQL + Redis    |
| **Frontend**       | React 18 + TypeScript | N/A (API only)          | React 18 + TypeScript | Kong + Nginx          |
| **Database**       | Shared PostgreSQL     | Redis + PostgreSQL      | Shared PostgreSQL     | Kafka + RabbitMQ      |
| **AI Integration** | OpenAI API            | Multi-provider routing  | Custom model training | Vector databases      |
| **Testing**        | Vitest + Playwright   | Jest + Supertest        | Pytest + Vitest       | Integration tests     |
| **Build Tools**    | Vite + ESLint         | TypeScript + ESLint     | Vite + Black          | Docker Compose        |

## 📁 CRITICAL DIRECTORY STRUCTURE

```
auterity-error-iq/
├── 🎯 CORE SYSTEMS (Primary development areas)
│   ├── backend/                    # AutoMatrix Core Engine
│   │   ├── app/
│   │   │   ├── api/               # 16 REST API modules
│   │   │   ├── models/            # 6 SQLAlchemy models
│   │   │   ├── services/          # 8 business logic services
│   │   │   ├── executors/         # Workflow execution engine
│   │   │   └── middleware/        # Security & monitoring
│   │   ├── tests/                 # Backend test suite
│   │   ├── requirements*.txt      # Python dependencies
│   │   └── alembic/               # Database migrations
│   ├── frontend/                   # AutoMatrix React Frontend
│   │   ├── src/
│   │   │   ├── components/        # UI components (100+ files)
│   │   │   ├── pages/             # Application pages
│   │   │   ├── hooks/             # Custom React hooks
│   │   │   ├── contexts/          # State management
│   │   │   ├── api/               # API integration layer
│   │   │   └── types/             # TypeScript definitions
│   │   ├── package.json           # Node.js dependencies
│   │   └── vite.config.ts         # Build configuration
│   └── systems/
│       ├── relaycore/             # AI Routing System
│       │   ├── src/
│       │   │   ├── routes/        # API endpoints
│       │   │   ├── services/      # Cost optimization, routing
│       │   │   └── middleware/    # Request processing
│       │   └── package.json       # Node.js dependencies
│       └── neuroweaver/           # Model Management
│           ├── backend/           # Python FastAPI backend
│           ├── frontend/          # React frontend
│           └── README.md          # Documentation
├── 🔧 SHARED INFRASTRUCTURE
│   ├── shared/                    # Shared libraries & components
│   │   ├── types/                 # Cross-system TypeScript types
│   │   ├── utils/                 # Common utilities
│   │   └── components/            # Shared React components
│   ├── infrastructure/            # Terraform IaC
│   ├── monitoring/                # Prometheus, Grafana configuration
│   └── scripts/                   # Automation scripts
├── 📚 DOCUMENTATION
│   ├── docs/                      # Comprehensive documentation
│   │   ├── API_DOCUMENTATION_COMPREHENSIVE.md
│   │   ├── DEPLOYMENT_GUIDE_COMPREHENSIVE.md
│   │   ├── DEVELOPMENT_GUIDE_COMPREHENSIVE.md
│   │   └── TECHNICAL_SPECIFICATIONS.md
│   └── README.md                  # Project overview
└── 🚀 DEPLOYMENT
    ├── docker-compose.unified.yml  # 26 service deployment
    ├── docker-compose.production.yml
    └── kong/                      # API Gateway configuration
```

## 🔧 DEVELOPMENT ENVIRONMENT COMMANDS

```bash
# CRITICAL: Setup commands (run in this order)
npm install                        # Install root dependencies
cd frontend && npm install         # Frontend dependencies
cd ../backend && pip install -r requirements-dev.txt  # Backend deps

# Development workflow
npm run dev                        # Start all 26 services with hot reload
npm run dev:logs                   # View service logs
npm run health-check               # Verify all services running

# Code quality (ALWAYS run before committing)
npm run lint                       # ESLint + Flake8 for all projects
npm run type-check                 # TypeScript checking
npm run test                       # Run all test suites
npm run quality-gate               # Full CI pipeline check

# Build & deployment
npm run build                      # Production build
npm run prod                       # Production deployment
```

## 🚨 CURRENT CRITICAL ISSUES (PRIORITY ORDER)

### **🔴 HIGHEST PRIORITY: TypeScript Compliance Crisis**

- **Location**: `frontend/src/components/__tests__/`
- **Issue**: 108 TypeScript linting errors blocking development
- **Critical Files**:
  - `WorkflowErrorDisplay.test.tsx`
  - `WorkflowExecutionInterface.test.tsx`
  - `TemplatePreviewModal.test.tsx` (current file in editor)
- **Impact**: Preventing clean builds and development workflow
- **Required Action**: Fix type definitions, import statements, test structure

### **🔴 CRITICAL: Test Infrastructure Failure**

- **Location**: `frontend/` vitest configuration
- **Issue**: 22 unhandled module resolution errors
- **Root Cause**: `Cannot find module 'pretty-format/build/index.js'`
- **Impact**: Zero tests can execute - complete test infrastructure failure
- **Required Action**: Dependency resolution and vitest configuration repair

### **🟡 HIGH PRIORITY: RelayCore Admin Interface**

- **Location**: `systems/relaycore/frontend/` (needs creation)
- **Issue**: Missing admin interface for AI routing management
- **Required**: Cost analytics dashboard, steering rules UI, budget management
- **Dependencies**: Shared foundation components completed

## 📊 PROJECT STATUS MATRIX

| System             | Backend Status    | Frontend Status      | Tests Status             | Documentation |
| ------------------ | ----------------- | -------------------- | ------------------------ | ------------- |
| **AutoMatrix**     | ✅ Complete (95%) | 🔴 TypeScript errors | 🔴 Infrastructure broken | ✅ Complete   |
| **RelayCore**      | ✅ Complete (90%) | 🟡 Needs admin UI    | ✅ Working               | ✅ Complete   |
| **NeuroWeaver**    | ✅ Complete (85%) | ✅ Complete          | ✅ Working               | ✅ Complete   |
| **Shared**         | ✅ Complete       | ✅ Complete          | 🔴 Broken                | ✅ Complete   |
| **Infrastructure** | ✅ Complete       | N/A                  | ✅ Working               | ✅ Complete   |

## 🔑 KEY TECHNICAL DETAILS FOR AI TOOLS

### **Authentication System**

- **Type**: JWT Bearer tokens with refresh mechanism
- **Location**: `backend/app/auth.py`, `frontend/src/contexts/AuthContext.tsx`
- **Integration**: Shared across all three systems via unified auth service
- **Security**: OAuth2, SAML, multi-factor authentication supported

### **Database Schema**

```sql
-- Core tables (AutoMatrix)
users (id, email, password_hash, role, created_at)
workflows (id, name, definition, user_id, status, created_at)
templates (id, name, config, category, featured, created_at)
executions (id, workflow_id, status, results, logs, created_at)

-- RelayCore tables
ai_requests (id, prompt, model_used, cost, latency, user_id)
routing_rules (id, condition, target_model, priority, enabled)
budgets (id, user_id, limit_amount, spent_amount, period)

-- NeuroWeaver tables
models (id, name, type, performance_metrics, deployed_at)
training_jobs (id, model_id, status, progress, config, created_at)
```

### **API Endpoints Structure**

```
AutoMatrix (Port 8000):
├── /api/auth/* - Authentication endpoints
├── /api/workflows/* - Workflow CRUD operations
├── /api/templates/* - Template management
├── /api/executions/* - Workflow execution control
└── /api/analytics/* - Performance metrics

RelayCore (Port 3001):
├── /api/ai/route - Intelligent AI request routing
├── /api/models/* - Available AI models
├── /api/budgets/* - Cost management
└── /api/metrics/* - Usage analytics

NeuroWeaver (Port 3002):
├── /api/models/* - Custom model management
├── /api/training/* - Model training pipeline
└── /api/inference/* - Model inference endpoints
```

### **Frontend Component Architecture**

```
frontend/src/components/
├── auth/ - Authentication components
├── workflow/ - Workflow builder & management
│   ├── WorkflowBuilder.tsx - Main visual builder
│   ├── WorkflowExecution.tsx - Execution interface
│   └── __tests__/ - Component tests (BROKEN)
├── templates/ - Template library & preview
├── common/ - Shared UI components
└── ai/ - AI service integration components
```

## 🛠️ COMMON DEVELOPMENT PATTERNS

### **React Component Pattern**

```typescript
// Standard component structure
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface ComponentProps {
  id: string;
  onAction?: (data: any) => void;
}

export const Component: React.FC<ComponentProps> = ({ id, onAction }) => {
  const { user } = useAuth();
  const { handleError } = useErrorHandler();

  // Component logic

  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  );
};
```

### **FastAPI Endpoint Pattern**

```python
# Standard API endpoint structure
from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User
from app.services.auth import get_current_user
from app.schemas.workflow import WorkflowCreate, WorkflowResponse

router = APIRouter(prefix="/api/workflows", tags=["workflows"])

@router.post("/", response_model=WorkflowResponse)
async def create_workflow(
    workflow_data: WorkflowCreate,
    current_user: User = Depends(get_current_user)
):
    try:
        # Business logic
        return workflow_service.create(workflow_data, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

## 🔍 DEBUGGING & TROUBLESHOOTING GUIDE

### **Common Issues & Solutions**

1. **TypeScript Errors**

   ```bash
   # Check for missing types
   npm run type-check
   # Fix import paths
   # Add proper type definitions
   ```

2. **Test Failures**

   ```bash
   # Clear test cache
   npm run test -- --clearCache
   # Reinstall dependencies
   rm -rf node_modules && npm install
   ```

3. **Service Connection Issues**

   ```bash
   # Check service health
   curl http://localhost:8080/api/health
   # Restart services
   docker-compose restart backend
   ```

4. **Database Issues**
   ```bash
   # Reset database
   docker-compose exec postgres psql -U postgres -c "DROP DATABASE auterity; CREATE DATABASE auterity;"
   cd backend && alembic upgrade head
   ```

## 📋 INTEGRATION POINTS BETWEEN SYSTEMS

### **AutoMatrix ↔ RelayCore**

- **Purpose**: AI request routing for workflow steps
- **Integration**: HTTP API calls via `services/relaycore_client.py`
- **Data Flow**: Workflow step → RelayCore routing → AI provider response

### **AutoMatrix ↔ NeuroWeaver**

- **Purpose**: Custom model deployment and inference
- **Integration**: HTTP API calls via `services/neuroweaver_client.py`
- **Data Flow**: Training request → Model registry → Deployment

### **RelayCore ↔ NeuroWeaver**

- **Purpose**: Custom model registration in routing system
- **Integration**: Webhook notifications and API polling
- **Data Flow**: Model deployment → Automatic routing registration

## 🚀 DEPLOYMENT ARCHITECTURE

```
Production Environment (26 Services):
┌─────────────────────────────────────────────────────────────────┐
│                     Kong API Gateway                           │
│                 Authentication & Rate Limiting                 │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼─────────────────────────┐
│              Nginx Load Balancer               │
│                 SSL Termination                │
└─────────────────────┬─────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼──────┐ ┌────▼─────┐ ┌────▼──────────┐
│ AutoMatrix   │ │RelayCore │ │ NeuroWeaver   │
│ Cluster      │ │ Service  │ │ Cluster       │
│ (3 replicas) │ │(2 replica)│ │ (2 replicas)  │
└──────────────┘ └──────────┘ └───────────────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
┌─────────────────────▼─────────────────────────┐
│              Data & Infrastructure            │
│ PostgreSQL • Redis • Kafka • Monitoring      │
└───────────────────────────────────────────────┘
```

## 📚 ESSENTIAL DOCUMENTATION REFERENCES

- **[API Documentation](docs/API_DOCUMENTATION_COMPREHENSIVE.md)** - Complete API reference
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE_COMPREHENSIVE.md)** - Production deployment
- **[Development Guide](docs/DEVELOPMENT_GUIDE_COMPREHENSIVE.md)** - Development workflow
- **[Technical Specifications](docs/TECHNICAL_SPECIFICATIONS.md)** - System architecture
- **[Current Status](CURRENT_PROJECT_STATUS.md)** - Real-time progress tracking

## ⚠️ CRITICAL WARNINGS FOR AI TOOLS

1. **NEVER modify database schema without Alembic migrations**
2. **ALWAYS run quality-gate before committing code**
3. **DO NOT break the three-system integration points**
4. **ALWAYS test across all affected systems**
5. **MAINTAIN TypeScript strict mode compliance**
6. **PRESERVE existing API contracts between systems**
7. **ENSURE authentication works across all three systems**

## 🎯 IMMEDIATE ACTION PRIORITIES

1. **Fix TypeScript errors in test files** (Blocking development)
2. **Resolve vitest module resolution** (Blocking testing)
3. **Complete RelayCore admin interface** (Missing functionality)
4. **Enhance error handling across systems** (Quality improvement)
5. **Optimize performance for large workflows** (Scalability)

---

**🤖 FOR AI CODING TOOLS**: This platform requires understanding of the three-system architecture. When making changes, consider cross-system impacts and maintain integration points. Focus on TypeScript compliance and test infrastructure repair as immediate priorities.

**Last Updated**: August 25, 2025
**Context Version**: 1.0.0
**Maintained By**: Auterity Development Team
