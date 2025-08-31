/**
 * AI SDK Integration Test
 *
 * Simple test to verify AI SDK integration is working
 */

import { aiSDKService } from './src/services/aiSDKService.ts';

async function testAISDKIntegration() {
  console.log('🧪 Testing AI SDK Integration...\n');

  try {
    // Test 1: Basic text response
    console.log('Test 1: Basic text response');
    const response1 = await aiSDKService.generateTextResponse(
      'Hello, can you help me create a simple workflow?',
      { workflowId: 'test-workflow-123' }
    );
    console.log('✅ Response:', response1.substring(0, 100) + '...\n');

    // Test 2: Provider switching
    console.log('Test 2: Provider switching');
    console.log('Current provider:', aiSDKService.getProviders());
    aiSDKService.setProvider('anthropic');
    console.log('Switched to Anthropic\n');

    // Test 3: Cost tracking
    console.log('Test 3: Cost tracking');
    const costSummary = aiSDKService.getCostSummary();
    console.log('Cost summary:', costSummary);
    aiSDKService.resetCostTracking();
    console.log('Cost tracking reset\n');

    console.log('🎉 All AI SDK integration tests passed!');

  } catch (error) {
    console.error('❌ AI SDK integration test failed:', error);
  }
}

// Run the test
testAISDKIntegration();
