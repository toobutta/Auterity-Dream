# 🤖 AI Framework Mapping Guide for Auterity

## Overview

This guide provides comprehensive documentation on how AI SDK and other AI frameworks are mapped and configured in Auterity. It ensures proper integration between Vercel AI SDK, LangChain, and other AI frameworks for optimal performance and user experience.

## 📋 Framework Architecture

### Core Frameworks

1. **Vercel AI SDK** - Primary framework for unified AI operations
2. **LangChain** - Advanced workflow orchestration and agent management
3. **LiteLLM** - Multi-model routing and fallback management
4. **Backend AI Services** - Python-based AI processing (RelayCore, LangGraph)

### Integration Points

```typescript
// Frontend AI Integration
src/services/aiSDKService.ts          // Vercel AI SDK Service
src/services/unifiedAIService.ts       // Cross-app AI Integration
frontend/src/services/enhanced/enhancedAIService.ts

// LangChain Integration
apps/workflow-studio/src/services/langchain/LangChainService.ts
apps/workflow-studio/src/services/langchain/LangGraphService.ts

// Backend AI Integration
services/api/src/app/services/ai_service_relaycore.py
services/api/src/app/services/litellm_service.py
systems/langgraph/src/langgraph_service.py
```

## 🔧 Configuration Structure

### External Services Configuration

```yaml
# config/external-services.yml
ai_frameworks:
  ai_sdk:
    enabled: true
    providers:
      openai:
        enabled: true
        api_key: "${OPENAI_API_KEY}"
        models: ["gpt-4o", "gpt-4-turbo-preview"]
        capabilities: ["text", "chat", "function_calling"]
      anthropic:
        enabled: true
        api_key: "${ANTHROPIC_API_KEY}"
        models: ["claude-3-5-sonnet-20241022"]
        capabilities: ["text", "chat", "reasoning"]

  langchain:
    enabled: true
    providers:
      openai:
        enabled: true
        model: "gpt-4"
        temperature: 0.7
      anthropic:
        enabled: true
        model: "claude-3-sonnet-20240229"

  framework_mappings:
    ai_sdk_to_langchain:
      openai: "openai"
      anthropic: "anthropic"
      google: "google"
```

## 🔄 Framework Mappings

### AI SDK ↔ LangChain Provider Mapping

| AI SDK Provider | LangChain Provider | Status | Notes |
|-----------------|-------------------|--------|--------|
| `openai` | `openai` | ✅ Mapped | Full compatibility |
| `anthropic` | `anthropic` | ✅ Mapped | Full compatibility |
| `google` | `google` | ✅ Mapped | Full compatibility |
| `azure` | `azure` | 🔄 Partial | LangChain support limited |
| `cohere` | `cohere` | 🔄 Partial | LangChain support limited |
| `ollama` | `ollama` | ❌ Not Mapped | Local model routing |

### Capability Mapping

| Capability | AI SDK | LangChain | Backend AI |
|------------|--------|-----------|------------|
| Text Generation | ✅ | ✅ | ✅ |
| Chat/Conversation | ✅ | ✅ | ✅ |
| Function Calling | ✅ | ✅ | ✅ |
| Streaming | ✅ | ✅ | ✅ |
| Tool Integration | ✅ | ✅ | ✅ |
| Agent Orchestration | ❌ | ✅ | ✅ |
| Workflow Orchestration | ❌ | ✅ | ✅ |
| Cost Tracking | ✅ | ❌ | ✅ |
| Multi-Model Routing | ❌ | ❌ | ✅ |

## 🎯 Usage Guidelines

### When to Use Each Framework

#### Vercel AI SDK (Frontend)
```typescript
// Use for:
- Simple text generation and chat
- Real-time streaming responses
- Cost tracking and optimization
- Function calling with tools
- Frontend AI interactions

const aiService = new AISDKService();
const response = await aiService.generateTextResponse(prompt);
```

#### LangChain (Complex Workflows)
```typescript
// Use for:
- Complex multi-step workflows
- Agent-based orchestration
- Memory management
- Advanced prompt engineering
- Custom tool integration

const langChainService = new LangChainService();
const chain = await langChainService.createConversationChain(config);
```

#### Backend AI Services (Enterprise)
```typescript
// Use for:
- High-throughput processing
- Multi-model routing with fallbacks
- Enterprise integrations
- Advanced monitoring
- Custom model deployments

const relaycoreService = new EnhancedAIService();
const response = await relaycoreService.process_text(prompt);
```

## 🔍 Validation and Monitoring

### Framework Status Checking

```typescript
// Check framework status
const frameworkStatus = aiSDKService.getAIFrameworkStatus();

console.log('AI SDK Status:', frameworkStatus.aiSdk);
console.log('LangChain Status:', frameworkStatus.langChain);
console.log('Recommendations:', frameworkStatus.unified.recommendations);
```

### Conflict Detection

```typescript
// Check for configuration conflicts
const conflicts = aiSDKService.checkFrameworkConflicts();

if (conflicts.conflicts.length > 0) {
  console.error('Critical conflicts:', conflicts.conflicts);
}

if (conflicts.warnings.length > 0) {
  console.warn('Warnings:', conflicts.warnings);
}
```

### Provider Status

```typescript
// Get unified provider status
const providerStatus = aiSDKService.getUnifiedProviderStatus();

Object.entries(providerStatus).forEach(([provider, status]) => {
  console.log(`${provider}:`, {
    aiSdk: status.aiSdk,
    langChain: status.langChain,
    conflicts: status.conflicts
  });
});
```

## 🛠️ Configuration Validation

### Automated Validation Tool

```bash
# Validate AI framework mappings
node tools/local/validate-ai-frameworks.js
```

### Manual Validation Checklist

- [ ] AI SDK providers properly configured
- [ ] LangChain providers mapped correctly
- [ ] API keys present for enabled providers
- [ ] Framework mappings are bidirectional
- [ ] No duplicate provider configurations
- [ ] Cost tracking enabled where needed
- [ ] Health checks configured
- [ ] Fallback providers specified

## 🚨 Common Issues and Solutions

### Issue 1: Missing API Keys
```typescript
// Problem: Provider enabled but API key missing
const status = aiSDKService.getUnifiedProviderStatus();
const missingKeys = Object.entries(status)
  .filter(([_, s]) => s.conflicts.includes('Missing API key'));

// Solution: Add environment variables or disable provider
```

### Issue 2: Framework Conflicts
```typescript
// Problem: Same provider configured in multiple frameworks
const conflicts = aiSDKService.checkFrameworkConflicts();

// Solution: Choose primary framework or deduplicate configuration
```

### Issue 3: Mapping Inconsistencies
```typescript
// Problem: AI SDK ↔ LangChain mappings don't match
const mappings = aiSDKService.frameworkMappings;

// Solution: Ensure bidirectional consistency in mappings
```

## 📊 Performance Optimization

### Cost Optimization
```typescript
// Enable cost tracking
const costSummary = aiSDKService.getCostSummary();
console.log('Total costs:', costSummary.total);
console.log('Savings from Ollama:', costSummary.savings.ollama);
```

### Provider Selection
```typescript
// Automatic provider selection based on task
const optimalProvider = await aiSDKService.selectOptimalProvider(task);
const response = await aiSDKService.processWithProvider(optimalProvider, task);
```

### Caching Strategy
```typescript
// Enable intelligent caching
const cachedResponse = await aiSDKService.getCachedResponse(request);
if (!cachedResponse) {
  const freshResponse = await aiSDKService.processRequest(request);
  await aiSDKService.cacheResponse(request, freshResponse);
}
```

## 🔐 Security Considerations

### API Key Management
- Store API keys in environment variables
- Use different keys for different environments
- Rotate keys regularly
- Monitor key usage

### Provider Security
- Enable provider health checks
- Implement rate limiting
- Use secure connections (HTTPS)
- Monitor for API key leaks

### Data Protection
- Encrypt sensitive data in transit
- Implement proper access controls
- Use secure token storage
- Regular security audits

## 📈 Monitoring and Analytics

### Framework Metrics
```typescript
// Get comprehensive framework metrics
const metrics = aiSDKService.getFrameworkMetrics();

console.log('Active providers:', metrics.activeProviders);
console.log('Total requests:', metrics.totalRequests);
console.log('Error rate:', metrics.errorRate);
console.log('Average latency:', metrics.averageLatency);
```

### Performance Tracking
```typescript
// Track performance across frameworks
const performance = {
  aiSdk: aiSDKService.getPerformanceMetrics(),
  langChain: langChainService.getPerformanceMetrics(),
  backend: backendAIService.getPerformanceMetrics()
};
```

## 🎯 Best Practices

### 1. Provider Selection Strategy
- Use AI SDK for simple, cost-sensitive tasks
- Use LangChain for complex, agent-based workflows
- Use Backend AI for high-throughput, enterprise scenarios

### 2. Configuration Management
- Keep configurations in external files
- Use environment variables for secrets
- Validate configurations on startup
- Monitor configuration drift

### 3. Error Handling
- Implement proper fallback mechanisms
- Use circuit breakers for unreliable providers
- Log errors with sufficient context
- Provide meaningful error messages

### 4. Cost Management
- Track costs across all providers
- Set budget limits and alerts
- Optimize model selection
- Use caching to reduce API calls

## 🚀 Future Enhancements

### Planned Improvements
- [ ] Unified provider management dashboard
- [ ] Automatic provider failover
- [ ] Advanced cost optimization algorithms
- [ ] Enhanced security features
- [ ] Real-time performance monitoring
- [ ] Multi-region provider support

### Framework Extensions
- [ ] Support for additional AI providers
- [ ] Custom model deployment integration
- [ ] Advanced caching strategies
- [ ] Predictive provider selection
- [ ] Automated configuration optimization

## 📞 Support and Troubleshooting

### Getting Help
1. Check framework status: `aiSDKService.getAIFrameworkStatus()`
2. Validate configurations: `node tools/local/validate-ai-frameworks.js`
3. Review logs for errors
4. Check provider documentation

### Common Support Issues
- Provider API key problems
- Configuration conflicts
- Performance issues
- Cost overruns

### Escalation Path
1. Check this guide
2. Review error logs
3. Contact AI team
4. Open support ticket

---

**Document Version**: 1.0
**Last Updated**: January 2025
**Review Cycle**: Monthly
**Responsible Team**: AI Engineering
