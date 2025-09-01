/**
 * Chrome DevTools Integration Test
 * Simple test to verify the integration works correctly
 */

import { initChromeDevTools } from './utils/chrome-devtools-bridge';

// Mock browser environment for testing
const mockWindow = {
  location: { href: 'http://localhost:3000', protocol: 'http:' },
  performance: {
    mark: () => {},
    measure: () => {},
    getEntriesByType: () => [],
    now: () => Date.now(),
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  devtools: undefined as any,
} as Window & { devtools?: any };

const mockDocument = {
  readyState: 'complete',
  addEventListener: () => {},
  createElement: () => ({}),
  head: { appendChild: () => {} },
} as Document;

const mockNavigator = {
  userAgent: 'Test Browser',
} as Navigator;

global.window = mockWindow;
global.document = mockDocument;
global.navigator = mockNavigator;

// Test the integration
async function testChromeDevToolsIntegration() {
  console.log('🧪 Testing Chrome DevTools Integration...');

  try {
    // Initialize DevTools
    const devTools = initChromeDevTools({
      enablePerformanceMonitoring: true,
      enableNetworkAnalysis: true,
      enableMemoryProfiling: true,
      enableConsoleEnhancement: true,
      enableAccessibilityAuditing: true,
      enableSecurityScanning: true,
      environment: 'development',
    });

    // Initialize the bridge
    await devTools.init();
    console.log('✅ DevTools bridge initialized successfully');

    // Test getting metrics
    const metrics = devTools.getMetrics();
    console.log('📊 Metrics retrieved:', metrics);

    // Test global API
    if ((global as any).window?.devtools) {
      console.log('🌐 Global API available at window.devtools');

      // Test some API methods
      const config = (global as any).window.devtools.getConfig();
      console.log('⚙️ Configuration:', config);

      console.log('✅ All tests passed!');
    } else {
      console.error('❌ Global API not available');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testChromeDevToolsIntegration();
