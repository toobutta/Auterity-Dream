# Auterity Error IQ - Updated Project Structure

Generated: August 28, 2025
Branch: chore/centralize-agent-rules
Status: 🟢 Fully Synchronized with GitHub

## 📁 Project Tree Structure

```
auterity-error-iq/
├── 📋 Project Documentation
│   ├── .github/
│   │   ├── copilot-instructions.md          # 🎯 Centralized AI agent rules
│   │   ├── workflows/                       # CI/CD pipeline configurations
│   │   ├── ISSUE_TEMPLATE/                  # GitHub issue templates
│   │   └── PULL_REQUEST_TEMPLATE.md         # PR template
│   ├── README.md                            # 📖 Main project documentation
│   ├── GITHUB_SYNC_STATUS_REPORT.md         # 📊 Latest sync status
│   ├── LINTING_IMPLEMENTATION_COMPLETE.md   # ✅ Code quality report
│   └── [Various project docs]               # Additional documentation
│
├── 🚀 Backend Application (Python/FastAPI)
│   ├── backend/
│   │   ├── app/
│   │   │   ├── main.py                      # 🎯 FastAPI application entry
│   │   │   ├── database.py                  # 🗄️ Database configuration
│   │   │   ├── auth.py                      # 🔐 Authentication logic
│   │   │   │
│   │   │   ├── api/                         # 🌐 API endpoints
│   │   │   │   ├── auth.py                  # Authentication endpoints
│   │   │   │   ├── auterity_expansion.py    # Auterity AI platform APIs
│   │   │   │   ├── agent_registry.py        # Agent management
│   │   │   │   ├── workflows.py             # Workflow management
│   │   │   │   ├── templates.py             # Template management
│   │   │   │   ├── monitoring.py            # System monitoring
│   │   │   │   ├── health.py                # Health checks
│   │   │   │   └── endpoints/               # Specific feature endpoints
│   │   │   │       ├── saas.py              # SaaS management
│   │   │   │       └── templates.py         # Template endpoints
│   │   │   │
│   │   │   ├── models/                      # 🗃️ Database models
│   │   │   │   ├── user.py                  # User, Role, Permission models
│   │   │   │   ├── tenant.py                # Multi-tenant models
│   │   │   │   ├── workflow.py              # Workflow execution models
│   │   │   │   ├── template.py              # Template models
│   │   │   │   ├── agent.py                 # Agent models
│   │   │   │   └── auterity_expansion.py    # Auterity platform models
│   │   │   │
│   │   │   ├── schemas/                     # 📝 Pydantic schemas
│   │   │   │   ├── auth.py                  # Authentication schemas
│   │   │   │   ├── workflow.py              # Workflow schemas
│   │   │   │   ├── template.py              # Template schemas
│   │   │   │   ├── agent.py                 # Agent schemas
│   │   │   │   └── auterity_expansion.py    # Auterity schemas
│   │   │   │
│   │   │   ├── services/                    # 🔧 Business logic services
│   │   │   │   ├── README.md                # Service architecture guide
│   │   │   │   ├── ai_service.py            # AI orchestration
│   │   │   │   ├── workflow_engine.py       # Workflow execution
│   │   │   │   ├── template_service.py      # Template management
│   │   │   │   ├── autonomous_agent_service.py # Autonomous agents
│   │   │   │   ├── smart_triage_service.py  # Intelligent triage
│   │   │   │   ├── vector_service.py        # Vector operations
│   │   │   │   ├── notification_service.py  # Notifications
│   │   │   │   ├── audit_service.py         # Audit logging
│   │   │   │   ├── agents/                  # Agent-specific services
│   │   │   │   │   ├── orchestrator.py      # Agent orchestration
│   │   │   │   │   ├── rag_engine.py        # RAG implementation
│   │   │   │   │   └── compliance_layer.py  # Compliance management
│   │   │   │   └── step_executors/          # Workflow step executors
│   │   │   │       ├── ai_executor.py       # AI step execution
│   │   │   │       ├── process_executor.py  # Process execution
│   │   │   │       └── factory.py           # Executor factory
│   │   │   │
│   │   │   ├── middleware/                  # 🔗 Request/response middleware
│   │   │   │   ├── auth_middleware.py       # Authentication middleware
│   │   │   │   ├── tenant_middleware.py     # Multi-tenant isolation
│   │   │   │   ├── error_handler.py         # Error handling
│   │   │   │   ├── logging.py               # Request logging
│   │   │   │   └── prometheus.py            # Metrics collection
│   │   │   │
│   │   │   ├── core/                        # ⚡ Core utilities
│   │   │   │   ├── config.py                # Configuration management
│   │   │   │   ├── cache.py                 # Caching layer
│   │   │   │   └── rate_limiter.py          # Rate limiting
│   │   │   │
│   │   │   └── utils/                       # 🛠️ Utility functions
│   │   │       ├── error_aggregator.py      # Error aggregation
│   │   │       └── retry_utils.py           # Retry logic
│   │   │
│   │   ├── tests/                           # 🧪 Test suite
│   │   │   ├── conftest.py                  # Test configuration
│   │   │   ├── test_auth.py                 # Authentication tests
│   │   │   ├── test_workflows.py            # Workflow tests
│   │   │   ├── integration/                 # Integration tests
│   │   │   │   ├── test_e2e_workflows.py    # End-to-end tests
│   │   │   │   └── test_performance_load.py # Performance tests
│   │   │   └── services/                    # Service tests
│   │   │       └── test_workflow_execution_engine.py
│   │   │
│   │   ├── alembic/                         # 🗄️ Database migrations
│   │   │   ├── env.py                       # Migration environment
│   │   │   └── versions/                    # Migration files
│   │   │       ├── 0001_initial_schema.py   # Initial database schema
│   │   │       ├── 002_extend_tenant_user_tables.py
│   │   │       └── 003_auterity_expansion_core.py
│   │   │
│   │   ├── requirements.txt                 # 📦 Python dependencies
│   │   ├── pyproject.toml                   # 🔧 Python project config
│   │   ├── .flake8                          # 📋 Linting configuration
│   │   └── Dockerfile                       # 🐳 Container configuration
│
├── 🎨 Frontend Application (React/TypeScript)
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/                  # 🧩 React components
│   │   │   │   ├── auth/                    # Authentication components
│   │   │   │   ├── workflow/                # Workflow management
│   │   │   │   ├── templates/               # Template components
│   │   │   │   ├── agents/                  # Agent management
│   │   │   │   └── common/                  # Shared components
│   │   │   ├── pages/                       # 📄 Page components
│   │   │   ├── hooks/                       # ⚛️ Custom React hooks
│   │   │   ├── services/                    # 🌐 API service layer
│   │   │   ├── store/                       # 🗃️ State management
│   │   │   ├── types/                       # 📝 TypeScript types
│   │   │   └── utils/                       # 🛠️ Utility functions
│   │   ├── public/                          # 🌐 Static assets
│   │   ├── package.json                     # 📦 Node.js dependencies
│   │   ├── vite.config.ts                   # ⚡ Vite configuration
│   │   ├── tsconfig.json                    # 📝 TypeScript config
│   │   └── eslint.config.js                 # 📋 ESLint configuration
│
├── 📊 Infrastructure & DevOps
│   ├── docker-compose.yml                  # 🐳 Local development setup
│   ├── docker-compose.unified.yml          # 🐳 Unified services
│   ├── kong/                               # 🌐 API Gateway configuration
│   ├── nginx/                              # 🌐 Web server configuration
│   ├── monitoring/                         # 📊 Monitoring setup
│   ├── vault/                              # 🔐 Secrets management
│   └── mlflow/                             # 🤖 ML model tracking
│
├── 🤖 AI & Agent Systems
│   ├── systems/
│   │   └── relaycore/                       # 🔗 Core relay system
│   ├── .kiro/                              # 🤖 AI agent configurations
│   │   ├── agents/                          # Agent specializations
│   │   ├── hooks/                           # Development hooks
│   │   ├── specs/                           # Project specifications
│   │   └── settings/                        # Configuration files
│   └── shared/                             # 📚 Shared libraries
│
├── 🔧 Development Tools & Scripts
│   ├── scripts/                            # 🛠️ Automation scripts
│   │   ├── final_linting_cleanup.py        # ✅ Comprehensive linting fixes
│   │   ├── fix_imports.py                  # 📦 Import resolution
│   │   ├── fix_all_linting.py              # 🔧 General linting fixes
│   │   └── verify_service_architecture.py  # 🏗️ Architecture validation
│   ├── .pre-commit-config.yaml             # 🔗 Pre-commit hooks
│   ├── .githooks/                          # 🔗 Git hooks
│   │   ├── commit-msg                       # Commit message validation
│   │   └── pre-commit                       # Pre-commit validation
│   └── .dev-templates/                     # 📋 Development templates
│
├── 🗂️ Configuration & Environment
│   ├── .env.example                        # 🔧 Environment template
│   ├── .env.production                     # 🚀 Production environment
│   ├── .gitignore                          # 📝 Git ignore rules
│   ├── package.json                        # 📦 Root workspace config
│   ├── codecov.yml                         # 📊 Code coverage config
│   └── .secrets.baseline                   # 🔐 Security baseline
│
└── 📚 Documentation & Archives
    ├── docs/                               # 📖 Project documentation
    ├── archived-agent-docs/                # 📁 Archived agent files
    ├── config/                             # ⚙️ System configurations
    └── [Various .md files]                 # 📄 Project documentation
```

## 🎯 Key Architecture Highlights

### 🔧 **Code Quality & Maintenance**
- **Linting Status:** ✅ 86% improvement (178 → 25 errors)
- **Pre-commit Hooks:** ✅ Active with conventional commit validation
- **Automated Fixes:** Comprehensive scripts for ongoing maintenance
- **Black Formatting:** Consistent 88-character line length

### 🏗️ **Backend Architecture**
- **Framework:** FastAPI with async support
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Multi-tenancy:** Tenant isolation middleware
- **API Design:** RESTful with OpenAPI documentation
- **Services Layer:** Business logic separation
- **Testing:** Comprehensive unit and integration tests

### 🎨 **Frontend Architecture** 
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite for fast development
- **State Management:** Modern React patterns
- **Component Library:** Modular, reusable components
- **Testing:** Vitest testing framework

### 🚀 **Infrastructure**
- **Containerization:** Docker with multi-stage builds
- **API Gateway:** Kong for request routing
- **Monitoring:** Prometheus, Grafana, OpenTelemetry
- **Secrets Management:** HashiCorp Vault integration
- **ML Operations:** MLflow for model tracking

### 🤖 **AI Integration**
- **Agent Framework:** Autonomous agent orchestration
- **Vector Operations:** Pinecone/Qdrant integration
- **LLM Integration:** LiteLLM for multi-provider support
- **Workflow Engine:** Complex workflow execution
- **Smart Triage:** Intelligent issue categorization

---

**Last Updated:** August 28, 2025  
**GitHub Status:** 🟢 Fully Synchronized  
**Branch:** `chore/centralize-agent-rules`  
**Commit:** `5d6c3e5`
