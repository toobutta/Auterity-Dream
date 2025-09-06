# HumanLayer + MLflow Integration Guide

## Overview

This guide provides comprehensive instructions for leveraging HumanLayer and MLflow within the Auterity Unified AI Platform. The integration enables human-in-the-loop machine learning workflows, combining automated AI processes with human oversight and decision-making.

## Architecture

### Core Components

1. **HumanLayer Service** (`src/services/humanLayerService.ts`)
   - Handles human approval workflows
   - Manages critical decision points
   - Provides security and compliance controls

2. **Enhanced MLflow Service** (`src/services/enhancedMLflowService.ts`)
   - Manages ML experiments and runs
   - Tracks model versions and deployments
   - Provides experiment analytics

3. **HumanLayer-MLflow Integration** (`src/services/humanlayerMLflowIntegration.ts`)
   - Orchestrates human-AI workflows
   - Manages ML pipelines with human oversight
   - Handles model deployment approvals

4. **Unified Dashboard** (`frontend/src/components/humanlayer-mlflow/HumanLayerMLflowDashboard.tsx`)
   - Provides comprehensive monitoring interface
   - Shows workflow progress and approvals
   - Displays ML experiment results

## Quick Start

### 1. Installation and Setup

```bash
# Install HumanLayer
pip install humanlayer

# Install MLflow
pip install mlflow

# Update Docker Compose
docker-compose -f infrastructure/docker/docker-compose.unified.yml up -d mlflow humanlayer
```

### 2. Configuration

Add to your environment variables:

```bash
# HumanLayer Configuration
HUMAN_LAYER_BASE_URL=http://humanlayer:8000
HUMAN_LAYER_API_KEY=your_api_key_here

# MLflow Configuration
MLFLOW_BASE_URL=http://mlflow:5000
MLFLOW_TRACKING_URI=http://mlflow:5000
```

### 3. Basic Usage

```typescript
import { humanLayerService } from './src/services/humanLayerService';
import { enhancedMLflowService } from './src/services/enhancedMLflowService';
import { humanLayerMLflowIntegration } from './src/services/humanlayerMLflowIntegration';

// Request human approval for critical operations
const approvalRequest = {
  id: 'approval_123',
  type: 'code_execution',
  title: 'Database Schema Change',
  description: 'Please review the database migration script',
  context: { script: 'ALTER TABLE users ADD COLUMN email_verified BOOLEAN;' },
  options: [
    { label: 'Execute', value: 'execute' },
    { label: 'Reject', value: 'reject', recommended: true }
  ],
  urgency: 'critical',
  timeout: 600
};

const approval = await humanLayerService.requestApproval(approvalRequest);

// Log ML experiment
await enhancedMLflowService.logToRun(runId, {
  accuracy: 0.95,
  loss: 0.05
}, {
  model: 'xgboost',
  dataset: 'customer_data'
});
```

## HumanLayer Integration

### Approval Types

The HumanLayer service supports several types of human approvals:

#### 1. Code Execution Approval

```typescript
const approval = await humanLayerService.requestCodeExecutionApproval(
  codeSnippet,
  'production',
  userId
);
```

#### 2. Content Publishing Approval

```typescript
const approval = await humanLayerService.requestContentApproval(
  content,
  'social_media',
  userId
);
```

#### 3. Workflow Decision Approval

```typescript
const approval = await humanLayerService.requestWorkflowApproval(
  workflowId,
  'Deploy model to production?',
  { modelMetrics, riskAssessment }
);
```

#### 4. Custom Approvals

```typescript
const approval = await humanLayerService.requestApproval({
  id: 'custom_123',
  type: 'ai_decision',
  title: 'Custom Approval',
  description: 'Please review this decision',
  context: { customData },
  options: [
    { label: 'Approve', value: 'approve' },
    { label: 'Deny', value: 'deny' }
  ],
  urgency: 'medium',
  timeout: 1800
});
```

### Approval Monitoring

```typescript
// Get approval status
const status = await humanLayerService.getApprovalStatus(requestId);

// Cancel pending approval
await humanLayerService.cancelApproval(requestId);

// Get service metrics
const metrics = humanLayerService.getMetrics();
```

## MLflow Integration

### Experiment Management

```typescript
// Create experiment
const experiment = await enhancedMLflowService.createExperiment(
  'customer_churn_prediction',
  'Predicting customer churn using ML models',
  { team: 'data_science', priority: 'high' }
);

// Get all experiments
const experiments = await enhancedMLflowService.getExperiments();

// Get runs for experiment
const runs = await enhancedMLflowService.getExperimentRuns(experimentId);
```

### Model Versioning

```typescript
// Create model version
const version = await enhancedMLflowService.createModelVersion(
  'churn_predictor',
  'runs:/run_id/model',
  runId
);

// Transition model stage
await enhancedMLflowService.transitionModelVersion(
  'churn_predictor',
  '1',
  'Production'
);

// Compare model versions
const comparison = await enhancedMLflowService.compareModelVersions(
  'churn_predictor',
  '1',
  '2'
);
```

### Workflow Logging

```typescript
// Log workflow execution
await enhancedMLflowService.logWorkflowExecution(
  workflowId,
  executionTime,
  nodeCount,
  success,
  { workflowName, stage: 'training' }
);
```

## Human-AI Workflow Integration

### Creating ML Workflows

```typescript
const workflow = await humanLayerMLflowIntegration.createMLWorkflow(
  'Customer Churn Prediction Pipeline',
  'End-to-end ML pipeline with human oversight',
  {
    experimentName: 'churn_prediction_v2',
    modelName: 'churn_predictor',
    stages: [
      {
        name: 'Data Preparation',
        type: 'data_prep',
        config: { dataset: 'customer_data.csv' },
        approvalRequired: false
      },
      {
        name: 'Model Training',
        type: 'training',
        config: {
          algorithm: 'xgboost',
          parameters: { max_depth: 6, learning_rate: 0.1 }
        },
        approvalRequired: false
      },
      {
        name: 'Model Validation',
        type: 'validation',
        config: {
          validationThresholds: { accuracy: 0.85, precision: 0.80 },
          testDataset: 'validation_data.csv'
        },
        approvalRequired: true
      },
      {
        name: 'Production Deployment',
        type: 'deployment',
        config: { environment: 'production' },
        approvalRequired: true
      },
      {
        name: 'Performance Monitoring',
        type: 'monitoring',
        config: { metrics: ['accuracy', 'latency'] },
        approvalRequired: false
      }
    ]
  }
);
```

### Executing Workflows

```typescript
// Execute workflow
await humanLayerMLflowIntegration.executeWorkflow(workflowId);

// Get workflow status
const workflow = humanLayerMLflowIntegration.getWorkflow(workflowId);

// Get all workflows
const workflows = humanLayerMLflowIntegration.getWorkflows();

// Get integration metrics
const metrics = humanLayerMLflowIntegration.getMetrics();
```

## Dashboard Integration

### Using the Unified Dashboard

```tsx
import { HumanLayerMLflowDashboard } from './components/humanlayer-mlflow/HumanLayerMLflowDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HumanLayerMLflowDashboard
        className="max-w-7xl mx-auto py-6 px-4"
        refreshInterval={30000}
      />
    </div>
  );
}
```

### Dashboard Features

- **Overview Tab**: Key metrics and recent activity
- **Human Approvals Tab**: Manage pending approvals
- **ML Experiments Tab**: View experiments and runs
- **Analytics Tab**: Performance metrics and trends

## Advanced Configuration

### Custom Approval Workflows

```typescript
// Create custom approval workflow
const customApproval = {
  id: 'compliance_check',
  type: 'ai_decision',
  title: 'Regulatory Compliance Check',
  description: 'AI model requires compliance review before deployment',
  context: {
    modelType: 'financial_prediction',
    regulations: ['GDPR', 'SOX'],
    riskLevel: 'high'
  },
  options: [
    { label: 'Compliant - Proceed', value: 'compliant' },
    { label: 'Requires Changes', value: 'changes' },
    { label: 'Reject Deployment', value: 'reject' }
  ],
  urgency: 'critical',
  timeout: 3600,
  metadata: {
    department: 'compliance',
    reviewer: 'chief_risk_officer'
  }
};
```

### MLflow Model Registry Integration

```typescript
// Advanced model management
const modelRegistry = {
  registerModel: async (name, description) => {
    return await enhancedMLflowService.createModelVersion(name, description);
  },

  promoteToStaging: async (name, version) => {
    return await enhancedMLflowService.transitionModelVersion(
      name,
      version,
      'Staging'
    );
  },

  promoteToProduction: async (name, version, approvalRequired = true) => {
    if (approvalRequired) {
      // Request human approval before promotion
      await humanLayerService.requestWorkflowApproval(
        `model_promotion_${name}_${version}`,
        `Promote ${name} v${version} to production`,
        { modelName: name, version, environment: 'production' }
      );
    }

    return await enhancedMLflowService.transitionModelVersion(
      name,
      version,
      'Production'
    );
  }
};
```

## Security and Compliance

### Approval Auditing

```typescript
// Get approval audit trail
const auditTrail = await humanLayerService.getApprovalAuditTrail(
  requestId,
  { includeComments: true, includeMetadata: true }
);

// Security analysis for code approvals
const securityAnalysis = await humanLayerService.analyzeCodeSecurity(code);

// Content compliance checking
const complianceCheck = await humanLayerService.checkContentCompliance(
  content,
  ['hate_speech', 'confidential_data']
);
```

### Access Control

```typescript
// Role-based approval routing
const approvalRouting = {
  code_execution: ['senior_developer', 'security_team'],
  content_publishing: ['content_team', 'legal'],
  model_deployment: ['ml_engineer', 'product_manager', 'compliance_officer']
};

// Approval escalation
const escalationRules = {
  timeout: 'escalate_to_manager',
  rejection: 'notify_stakeholders',
  high_risk: 'require_c_level_approval'
};
```

## Monitoring and Analytics

### Performance Metrics

```typescript
// Get comprehensive metrics
const humanLayerMetrics = humanLayerService.getMetrics();
const mlflowMetrics = await enhancedMLflowService.getMetrics();
const workflowMetrics = humanLayerMLflowIntegration.getMetrics();

// Combined analytics
const analytics = {
  approvalEfficiency: {
    averageResponseTime: humanLayerMetrics.averageResponseTime,
    approvalRate: humanLayerMetrics.approvalRate,
    timeoutRate: humanLayerMetrics.timeoutRate
  },
  mlPerformance: {
    totalExperiments: mlflowMetrics.totalExperiments,
    activeRuns: mlflowMetrics.activeRuns,
    productionModels: mlflowMetrics.productionModels
  },
  workflowEfficiency: {
    humanInterventionRate: workflowMetrics.humanInterventionRate,
    modelDeploymentRate: workflowMetrics.modelDeploymentRate,
    averageCompletionTime: workflowMetrics.averageCompletionTime
  }
};
```

### Alert Configuration

```typescript
// Configure alerts
const alertConfig = {
  approvalTimeouts: {
    threshold: 300, // 5 minutes
    notificationChannels: ['email', 'slack'],
    escalationPolicy: 'manager_escalation'
  },
  mlExperimentFailures: {
    threshold: 3, // consecutive failures
    notificationChannels: ['email', 'pagerduty'],
    autoRetry: true
  },
  deploymentApprovals: {
    pendingThreshold: 10, // pending approvals
    notificationChannels: ['slack', 'dashboard'],
    priorityEscalation: true
  }
};
```

## Troubleshooting

### Common Issues

#### HumanLayer Connection Issues

```typescript
// Check service health
try {
  const health = await humanLayerService.checkHealth();
  console.log('HumanLayer status:', health);
} catch (error) {
  console.error('HumanLayer connection failed:', error);
  // Fallback to alternative approval mechanism
}
```

#### MLflow Tracking Issues

```typescript
// Verify MLflow connection
try {
  await enhancedMLflowService.testConnection();
  console.log('MLflow connection successful');
} catch (error) {
  console.error('MLflow connection failed:', error);
  // Switch to local logging
}
```

#### Workflow Execution Failures

```typescript
// Handle workflow failures gracefully
const workflow = humanLayerMLflowIntegration.getWorkflow(workflowId);
if (workflow.status === 'failed') {
  // Analyze failure
  const failureAnalysis = await analyzeWorkflowFailure(workflow);

  // Request human intervention if needed
  if (failureAnalysis.requiresHumanIntervention) {
    await humanLayerService.requestWorkflowApproval(
      workflowId,
      'Workflow failed - human intervention required',
      failureAnalysis
    );
  }
}
```

## Best Practices

### 1. Approval Design

- Keep approval requests focused and actionable
- Provide clear context and options
- Set appropriate timeouts based on urgency
- Use escalation policies for critical approvals

### 2. ML Experiment Tracking

- Log all relevant parameters and metrics
- Use consistent naming conventions
- Tag experiments with metadata
- Implement proper model versioning

### 3. Workflow Orchestration

- Design workflows with clear stages
- Implement proper error handling
- Use human oversight for critical decisions
- Monitor performance and optimize

### 4. Security Considerations

- Validate all inputs and contexts
- Implement proper access controls
- Audit all approval decisions
- Use encryption for sensitive data

## API Reference

### HumanLayer Service

```typescript
interface HumanLayerService {
  requestApproval(request: HumanApprovalRequest): Promise<HumanApprovalResponse>;
  getApprovalStatus(requestId: string): Promise<ApprovalStatus>;
  cancelApproval(requestId: string): Promise<boolean>;
  getMetrics(): HumanLayerMetrics;
  analyzeCodeSecurity(code: string): SecurityAnalysis;
  checkContentCompliance(content: string, policies: string[]): ComplianceResult;
}
```

### Enhanced MLflow Service

```typescript
interface EnhancedMLflowService {
  getExperiments(): Promise<Experiment[]>;
  createExperiment(name: string, description?: string): Promise<Experiment>;
  getExperimentRuns(experimentId: string): Promise<Run[]>;
  logToRun(runId: string, metrics: Record<string, number>, parameters: Record<string, string>): Promise<void>;
  createModelVersion(name: string, source: string, runId: string): Promise<ModelVersion>;
  transitionModelVersion(name: string, version: string, stage: Stage): Promise<ModelVersion>;
  getMetrics(): Promise<MLflowMetrics>;
}
```

### HumanLayer-MLflow Integration

```typescript
interface HumanLayerMLflowIntegration {
  createMLWorkflow(name: string, description: string, config: WorkflowConfig): Promise<MLWorkflow>;
  executeWorkflow(workflowId: string): Promise<void>;
  getWorkflow(workflowId: string): MLWorkflow | undefined;
  getWorkflows(): MLWorkflow[];
  getMetrics(): HumanAIWorkflowMetrics;
}
```

## Conclusion

The HumanLayer + MLflow integration provides a powerful framework for human-in-the-loop machine learning workflows. By combining automated AI processes with human oversight, you can ensure:

- **Quality Control**: Human review of critical decisions
- **Compliance**: Regulatory and security approvals
- **Transparency**: Full audit trail of decisions and actions
- **Reliability**: Human intervention for edge cases and failures
- **Performance**: Optimized ML workflows with human feedback

This integration enables responsible AI deployment while maintaining the benefits of automation and scale.

