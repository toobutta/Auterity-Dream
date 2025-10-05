# AI SDK Integration Guide

## Overview

This guide provides comprehensive instructions for using the AI SDK across both Auterity projects (auterity-workflow-studio and auterity-error-iq) to ensure consistent implementation and maximum functionality.

## Features

The AI SDK integration provides:

- **Multi-Provider Support**: OpenAI, Anthropic, Azure, Google, and Cohere
- **Structured Outputs**: Zod schema validation for consistent responses
- **Streaming Responses**: Real-time text generation
- **Cost Tracking**: Automatic cost monitoring and reporting
- **Tool Calling**: Integration with workflow operations

## Project Structure

### auterity-workflow-studio
- **Service**: `src/services/aiSDKService.ts`
- **Test**: `test-ai-sdk.js`
- **Environment**: `.env`

### auterity-error-iq
- **Service**: `src/services/aiSDKService.ts`
- **Frontend Service**: `frontend/src/services/aiSDKService.ts` (if needed)
- **Test**: `test-ai-sdk.js`
- **Environment**: `.env`
- **Frontend Environment**: `frontend/.env`

## Setup Instructions

### 1. Environment Variables

Add the following API keys to your `.env` files:

```bash
# OpenAI
OPENAI_API_KEY=your-openai-api-key-here

# Anthropic
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Azure OpenAI
AZURE_OPENAI_API_KEY=your-azure-openai-api-key-here
AZURE_OPENAI_ENDPOINT=your-azure-openai-endpoint-here

# Google Generative AI
GOOGLE_GENERATIVE_AI_API_KEY=your-google-generative-ai-api-key-here

# Cohere
COHERE_API_KEY=your-cohere-api-key-here
```

### 2. Dependencies

Ensure the following packages are installed:

```json
{
  "ai": "^5.0.28",
  "@ai-sdk/openai": "^2.0.23",
  "@ai-sdk/anthropic": "^2.0.9",
  "@ai-sdk/azure": "^2.0.23",
  "@ai-sdk/google": "^2.0.11",
  "@ai-sdk/cohere": "^2.0.7",
  "@ai-sdk/react": "^2.0.28",
  "zod": "^4.1.5"
}
```

### 3. TypeScript Configuration

For auterity-error-iq, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./src/types"]
  }
}
```

## Usage Examples

### Basic Text Generation

```typescript
import { aiSDKService } from './services/aiSDKService.js';

// Simple text response
const response = await aiSDKService.generateTextResponse(
  'Create a workflow for processing customer orders',
  { workflowId: 'order-processing-001' }
);
```

### Provider Switching

```typescript
// Switch to different AI providers
aiSDKService.setProvider('anthropic'); // Use Claude
aiSDKService.setProvider('openai');    // Use GPT
aiSDKService.setProvider('google');    // Use Gemini

// Get available providers
const providers = aiSDKService.getProviders();
```

### Structured Outputs

```typescript
// Generate workflow with structured output
const workflow = await aiSDKService.generateWorkflow(
  'Create a workflow for email marketing campaigns'
);

// Optimize existing workflow
const optimization = await aiSDKService.optimizeWorkflow({
  workflowId: 'campaign-workflow-001',
  nodes: [...],
  edges: [...]
});
```

### Streaming Responses

```typescript
// Stream real-time responses
for await (const chunk of aiSDKService.generateChatResponse(messages, context)) {
  console.log(chunk); // Process each chunk as it arrives
}
```

### Cost Tracking

```typescript
// Get cost summary
const costs = aiSDKService.getCostSummary();
console.log('Total cost:', costs.total);
console.log('By operation:', costs.byOperation);

// Reset tracking
aiSDKService.resetCostTracking();
```

## Testing

Run the integration tests:

```bash
# auterity-workflow-studio
node test-ai-sdk.js

# auterity-error-iq
node test-ai-sdk.js
```

## Best Practices

### 1. Error Handling

```typescript
try {
  const response = await aiSDKService.generateTextResponse(prompt);
  // Process response
} catch (error) {
  console.error('AI SDK Error:', error);
  // Fallback logic
}
```

### 2. Provider Selection

```typescript
// Choose provider based on use case
const provider = process.env.PREFERRED_AI_PROVIDER || 'openai';
aiSDKService.setProvider(provider);
```

### 3. Cost Monitoring

```typescript
// Log costs for monitoring
const costs = aiSDKService.getCostSummary();
if (costs.total > COST_THRESHOLD) {
  // Send alert or switch to cheaper provider
  aiSDKService.setProvider('anthropic'); // Generally cheaper
}
```

### 4. Context Management

```typescript
// Provide rich context for better responses
const context = {
  workflowId: 'wf-123',
  userRole: 'admin',
  currentStep: 'optimization',
  metadata: { priority: 'high' }
};

const response = await aiSDKService.generateTextResponse(prompt, context);
```

## Advanced Features

### Custom Schemas

```typescript
import { z } from 'zod';

const CustomSchema = z.object({
  title: z.string(),
  steps: z.array(z.string()),
  priority: z.enum(['low', 'medium', 'high'])
});

// Use in generateObject calls
```

### Tool Integration

```typescript
// Define custom tools
const customTools = {
  createWorkflow: 'Create a new workflow',
  updateWorkflow: 'Update existing workflow',
  deleteWorkflow: 'Delete workflow'
};
```

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Ensure all AI SDK packages are installed
   - Check TypeScript configuration

2. **API Key errors**
   - Verify environment variables are set
   - Check API key validity

3. **Provider switching issues**
   - Ensure provider is supported
   - Check provider-specific configuration

### Debug Mode

```typescript
// Enable detailed logging
process.env.DEBUG = 'ai-sdk:*';

// Check current configuration
console.log('Current provider:', aiSDKService.getProviders());
console.log('Cost summary:', aiSDKService.getCostSummary());
```

## Performance Optimization

### 1. Caching

```typescript
// Implement response caching for frequently used prompts
const cache = new Map();

async function getCachedResponse(prompt: string) {
  if (cache.has(prompt)) {
    return cache.get(prompt);
  }

  const response = await aiSDKService.generateTextResponse(prompt);
  cache.set(prompt, response);
  return response;
}
```

### 2. Batch Processing

```typescript
// Process multiple requests efficiently
const responses = await Promise.all(
  prompts.map(prompt => aiSDKService.generateTextResponse(prompt))
);
```

## Security Considerations

1. **API Key Management**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **Input Validation**
   - Validate all inputs before sending to AI
   - Sanitize user-provided content

3. **Rate Limiting**
   - Implement rate limiting to prevent abuse
   - Monitor API usage

## Contributing

When adding new AI features:

1. Update both projects consistently
2. Add comprehensive tests
3. Update this documentation
4. Follow the established patterns
5. Test across all supported providers

## Support

For issues or questions:
- Check the test files for examples
- Review the AI SDK documentation
- Consult the project maintainers
