# Chrome DevTools Integration Guide

## Overview

This document provides comprehensive guidance for using Chrome DevTools integration in the Auterity Workflow Studio and Error-IQ projects. The integration provides powerful debugging, performance monitoring, and optimization tools.

## 🚀 Quick Start

### Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server with DevTools**
   ```bash
   npm run dev:devtools
   ```

3. **Open Chrome DevTools**
   - Press `F12` or `Ctrl+Shift+I`
   - Navigate to Console tab to see DevTools logs

### Global DevTools API

When DevTools are enabled, a global `devtools` object is available:

```javascript
// Enable performance monitoring
window.devtools.enablePerformanceMonitoring();

// Run accessibility audit
window.devtools.runAccessibilityAudit();

// Get current metrics
const metrics = window.devtools.getMetrics();

// Export comprehensive report
const report = window.devtools.exportReport();
```

## 📊 Performance Monitoring

### Web Vitals Tracking

The integration automatically tracks Core Web Vitals:

- **LCP (Largest Contentful Paint)**: Measures loading performance
- **FID (First Input Delay)**: Measures interactivity
- **CLS (Cumulative Layout Shift)**: Measures visual stability
- **FCP (First Contentful Paint)**: Measures initial render
- **TTFB (Time to First Byte)**: Measures server response time

### Performance Thresholds

```javascript
// Default thresholds (configurable)
const thresholds = {
  lcp: 2500,    // 2.5 seconds
  fid: 100,     // 100 milliseconds
  cls: 0.1,     // 0.1 score
  fcp: 1800,    // 1.8 seconds
  ttfb: 600,    // 600 milliseconds
};
```

### Memory Profiling

- **Heap Usage Monitoring**: Real-time memory consumption tracking
- **Leak Detection**: Automatic detection of memory leaks
- **Garbage Collection**: Manual GC triggering for testing
- **Snapshot Creation**: Heap snapshots for detailed analysis

```javascript
// Manual garbage collection
window.devtools.forceGarbageCollection();

// Create heap snapshot
window.devtools.createHeapSnapshot();
```

## 🌐 Network Analysis

### Request Monitoring

- **API Call Tracking**: All fetch/XHR requests are logged
- **WebSocket Monitoring**: Real-time connection tracking
- **Performance Metrics**: Response times, status codes, data transfer
- **Error Detection**: Failed requests and network issues

### Network Metrics

```javascript
const networkMetrics = {
  totalRequests: 150,
  failedRequests: 3,
  averageResponseTime: 245, // ms
  totalDataTransferred: 2048576, // bytes
  activeConnections: 2
};
```

## 📝 Console Enhancement

### Structured Logging

- **Performance Context**: Automatic performance metrics in logs
- **Correlation IDs**: Request tracing across components
- **Error Enhancement**: Stack traces and context information
- **Grouping**: Organized log output with collapsible groups

### Console Commands

```javascript
// Performance marks
console.mark('operation-start');
console.mark('operation-end');
console.measure('operation-duration', 'operation-start', 'operation-end');

// Enhanced logging
console.log('[Component] State updated', { userId, timestamp, data });
```

## ♿ Accessibility Auditing

### WCAG Compliance

- **Automated Testing**: axe-core integration for WCAG 2.1 AA compliance
- **Real-time Auditing**: Continuous accessibility monitoring
- **Violation Reporting**: Detailed issue descriptions and fixes
- **Impact Assessment**: Critical, serious, moderate, and minor issues

### Accessibility API

```javascript
// Run full accessibility audit
const report = await window.devtools.runAccessibilityAudit();

// Check specific element
const elementReport = await window.devtools.checkElement('#my-component');

// Get recommendations
const recommendations = window.devtools.generateRecommendations();
```

## 🔒 Security Scanning

### Security Headers

- **CSP Validation**: Content Security Policy checking
- **X-Frame-Options**: Clickjacking protection verification
- **HTTPS Enforcement**: Mixed content detection
- **Security Headers**: Comprehensive header analysis

### Vulnerability Detection

```javascript
// Run security scan
const securityReport = await window.devtools.runSecurityScan();

// Get issues by severity
const criticalIssues = window.devtools.getIssuesBySeverity('critical');
const highIssues = window.devtools.getIssuesBySeverity('high');
```

## 🛠️ Development Workflow

### Debugging Workflow

1. **Start Development Server**
   ```bash
   npm run dev:devtools
   ```

2. **Open DevTools Console**
   - View structured logs with performance context
   - Monitor Web Vitals in real-time
   - Track network requests

3. **Performance Analysis**
   ```bash
   # Run performance audit
   npm run audit:performance

   # Analyze bundle
   npm run build:analyze
   ```

4. **Accessibility Testing**
   ```bash
   # Run accessibility tests
   npm run test:accessibility

   # Audit current page
   npm run audit:accessibility
   ```

5. **Security Scanning**
   ```bash
   # Run security audit
   npm run audit:security
   ```

### Breakpoint Debugging

1. **Sources Tab**: Set breakpoints in TypeScript files
2. **Conditional Breakpoints**: Add conditions for complex logic
3. **Performance Breakpoints**: Break on long tasks or forced reflows
4. **XHR/Fetch Breakpoints**: Break on specific network requests

### Memory Debugging

1. **Memory Tab**: Take heap snapshots
2. **Allocation Timeline**: Track object allocation over time
3. **Leak Detection**: Use the DevTools leak detection tools
4. **Forced GC**: Test memory cleanup

## 📈 Metrics and Reporting

### Real-time Metrics

```javascript
const metrics = window.devtools.getMetrics();

// Performance metrics
console.log('Web Vitals:', metrics.webVitals);
console.log('Memory Usage:', metrics.performance.memoryUsage);
console.log('Network Requests:', metrics.performance.networkRequests);

// Quality metrics
console.log('Accessibility Score:', metrics.accessibility.score);
console.log('Security Score:', metrics.security.score);
```

### Export Reports

```javascript
// Export comprehensive report
const report = window.devtools.exportReport();
console.log(report);

// Individual component reports
const perfReport = window.devtools.getPerformanceReport();
const accessibilityReport = window.devtools.getAccessibilityReport();
const securityReport = window.devtools.getSecurityReport();
```

## 🔧 Configuration

### Environment Configuration

```javascript
// Development
DEVTOOLS_ENABLED=true
NODE_ENV=development

// Production (disabled by default)
DEVTOOLS_ENABLED=false
NODE_ENV=production
```

### Custom Configuration

```typescript
import { devToolsConfig } from './utils/devtools-config';

// Modify configuration
devToolsConfig.performance.webVitals.thresholds.lcp = 3000;
devToolsConfig.accessibility.auditInterval = 600000; // 10 minutes
```

## 🚨 Alerts and Notifications

### Performance Alerts

- **Threshold Violations**: Automatic alerts when metrics exceed thresholds
- **Memory Leaks**: Detection and notification of memory leaks
- **Network Issues**: Failed requests and slow responses

### Console Alerts

```javascript
// Performance threshold exceeded
[DevTools] LCP threshold exceeded: 2800ms (threshold: 2500ms)

// Memory leak detected
[DevTools] Potential memory leak detected. Growth rate: 15.2%

// Accessibility violation
[DevTools] Critical accessibility violation: Missing alt text on image
```

## 📚 Best Practices

### Performance Optimization

1. **Monitor Web Vitals**: Keep LCP < 2.5s, FID < 100ms, CLS < 0.1
2. **Memory Management**: Avoid memory leaks in long-running applications
3. **Network Efficiency**: Minimize unnecessary requests and optimize assets
4. **Bundle Analysis**: Regularly check bundle size and optimize imports

### Accessibility Compliance

1. **Regular Audits**: Run accessibility audits during development
2. **WCAG Guidelines**: Follow WCAG 2.1 AA standards
3. **Automated Testing**: Include accessibility tests in CI/CD
4. **User Testing**: Conduct user testing with assistive technologies

### Security Best Practices

1. **Security Headers**: Implement all recommended security headers
2. **HTTPS Only**: Use HTTPS for all resources
3. **CSP Implementation**: Deploy Content Security Policy
4. **Regular Scanning**: Continuous security monitoring

## 🔍 Troubleshooting

### Common Issues

1. **DevTools Not Loading**
   - Check environment variables
   - Verify dependencies are installed
   - Check console for initialization errors

2. **Performance Metrics Not Showing**
   - Ensure Web Vitals library is loaded
   - Check network connectivity
   - Verify Performance API support

3. **Accessibility Audit Failing**
   - Ensure axe-core is loaded
   - Check for CORS issues
   - Verify DOM is fully loaded

### Debug Commands

```javascript
// Check DevTools status
console.log('DevTools initialized:', !!window.devtools);

// Force re-initialization
window.devtools.destroy();
window.devtools.init();

// Clear all logs
window.devtools.clearLogs();
```

## 📋 API Reference

### ChromeDevToolsBridge

```typescript
class ChromeDevToolsBridge {
  constructor(config?: Partial<DevToolsConfig>);
  init(): Promise<void>;
  destroy(): void;
  getMetrics(): DevToolsMetrics;
  exportReport(): string;
}
```

### Global API Methods

```typescript
interface DevToolsGlobalAPI {
  enablePerformanceMonitoring(): void;
  disablePerformanceMonitoring(): void;
  runAccessibilityAudit(): Promise<AccessibilityReport>;
  runSecurityScan(): Promise<SecurityReport>;
  getMetrics(): DevToolsMetrics;
  exportReport(): string;
  clearLogs(): void;
  forceGarbageCollection(): void;
  createHeapSnapshot(): void;
}
```

## 🎯 Success Metrics

### Performance Targets
- **Lighthouse Score**: > 90
- **Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle Size**: < 800KB total, < 200KB initial load
- **Memory Usage**: < 100MB heap size

### Quality Targets
- **Accessibility**: 100% WCAG 2.1 AA compliance
- **Security**: A+ security rating
- **Performance**: 95%+ performance score
- **Code Quality**: 25% improvement in quality scores

This comprehensive integration ensures optimal performance, accessibility, and security while maintaining excellent developer experience across the Auterity platform.
