# Performance Monitoring & CI Integration

## Web Vitals Monitoring Setup

### 1. Add to package.json

```json
{
  "devDependencies": {
    "@lighthouse-ci/cli": "^0.12.1",
    "web-vitals": "^3.5.0",
    "@axe-core/playwright": "^4.8.2"
  },
  "scripts": {
    "test:performance": "playwright test performance.spec.ts",
    "test:a11y": "playwright test accessibility.spec.ts",
    "lighthouse:ci": "lhci autorun",
    "vitals:measure": "node scripts/measure-web-vitals.js"
  }
}
```

### 2. Lighthouse CI Configuration (.lighthouserc.js)

```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000/dashboard",
        "http://localhost:3000/issues",
        "http://localhost:3000/issues/test-issue-123",
      ],
      startServerCommand: "npm run preview",
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "first-contentful-paint": ["error", { maxNumericValue: 1500 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        interactive: ["error", { maxNumericValue: 3000 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
```

### 3. GitHub Actions Workflow (.github/workflows/ui-quality.yml)

```yaml
name: UI Quality & Performance

on:
  pull_request:
    paths:
      - "frontend/**"
  push:
    branches: [main]

jobs:
  ui-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Build application
        run: |
          cd frontend
          npm run build

      - name: Install Playwright
        run: |
          cd tests/e2e
          npm ci
          npx playwright install --with-deps

      - name: Start preview server
        run: |
          cd frontend
          npm run preview &
          sleep 10 # Wait for server to start

      - name: Run Lighthouse CI
        run: |
          cd frontend
          npx @lhci/cli@0.12.x autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: Run E2E tests
        run: |
          cd tests/e2e
          npx playwright test error-iq-critical-paths.spec.ts

      - name: Run accessibility tests
        run: |
          cd tests/e2e
          npx playwright test accessibility.spec.ts

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: |
            tests/e2e/test-results/
            tests/e2e/playwright-report/
          retention-days: 7

  bundle-analysis:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Build and analyze bundle
        run: |
          cd frontend
          npm run build:analyze

      - name: Check bundle size
        run: |
          cd frontend
          node scripts/check-bundle-size.js

      - name: Comment bundle analysis
        uses: actions/github-script@v7
        if: github.event_name == 'pull_request'
        with:
          script: |
            const fs = require('fs');
            const bundleReport = fs.readFileSync('frontend/bundle-report.md', 'utf8');

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: bundleReport
            });
```

### 4. Bundle Size Monitoring Script (scripts/check-bundle-size.js)

```javascript
const fs = require("fs");
const path = require("path");

const BUNDLE_SIZE_LIMITS = {
  main: 500 * 1024, // 500KB
  vendor: 300 * 1024, // 300KB
  total: 800 * 1024, // 800KB
};

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(2) + " KB";
}

function checkBundleSize() {
  const distPath = path.join(__dirname, "../dist/assets");
  const files = fs.readdirSync(distPath);

  const bundles = {
    main: 0,
    vendor: 0,
    total: 0,
  };

  files.forEach((file) => {
    if (file.endsWith(".js")) {
      const size = getFileSize(path.join(distPath, file));
      bundles.total += size;

      if (file.includes("vendor") || file.includes("node_modules")) {
        bundles.vendor += size;
      } else {
        bundles.main += size;
      }
    }
  });

  console.log("\n📦 Bundle Size Analysis:");
  console.log("========================");

  let hasViolation = false;

  Object.entries(bundles).forEach(([bundle, size]) => {
    const limit = BUNDLE_SIZE_LIMITS[bundle];
    const percentage = ((size / limit) * 100).toFixed(1);
    const status = size > limit ? "❌ EXCEEDED" : "✅ OK";

    if (size > limit) {
      hasViolation = true;
    }

    console.log(
      `${bundle.padEnd(8)} ${formatBytes(size).padEnd(10)} / ${formatBytes(limit).padEnd(10)} (${percentage}%) ${status}`,
    );
  });

  if (hasViolation) {
    console.error("\n❌ Bundle size limits exceeded!");
    process.exit(1);
  } else {
    console.log("\n✅ All bundle sizes within limits");
  }

  // Generate report for PR comments
  const report = `
## 📦 Bundle Size Report

| Bundle | Size | Limit | Usage | Status |
|--------|------|-------|-------|--------|
${Object.entries(bundles)
  .map(([bundle, size]) => {
    const limit = BUNDLE_SIZE_LIMITS[bundle];
    const percentage = ((size / limit) * 100).toFixed(1);
    const status = size > limit ? "❌ Exceeded" : "✅ OK";
    return `| ${bundle} | ${formatBytes(size)} | ${formatBytes(limit)} | ${percentage}% | ${status} |`;
  })
  .join("\n")}

${hasViolation ? "⚠️ **Bundle size limits exceeded!** Consider code splitting or removing unused dependencies." : "✅ All bundles within size limits."}
  `;

  fs.writeFileSync("bundle-report.md", report);
}

checkBundleSize();
```

### 5. Web Vitals Measurement Script (scripts/measure-web-vitals.js)

```javascript
const { chromium } = require("playwright");

async function measureWebVitals() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Add Web Vitals library
  await page.addScriptTag({
    url: "https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js",
  });

  const vitals = {};

  // Listen for Web Vitals metrics
  await page.evaluateOnNewDocument(() => {
    window.vitalsData = {};

    webVitals.onCLS((metric) => {
      window.vitalsData.cls = metric.value;
    });

    webVitals.onFID((metric) => {
      window.vitalsData.fid = metric.value;
    });

    webVitals.onLCP((metric) => {
      window.vitalsData.lcp = metric.value;
    });

    webVitals.onFCP((metric) => {
      window.vitalsData.fcp = metric.value;
    });

    webVitals.onTTFB((metric) => {
      window.vitalsData.ttfb = metric.value;
    });
  });

  // Test key pages
  const pages = [
    { name: "Dashboard", url: "http://localhost:3000/dashboard" },
    { name: "Issue List", url: "http://localhost:3000/issues" },
    {
      name: "Issue Detail",
      url: "http://localhost:3000/issues/test-issue-123",
    },
  ];

  const results = [];

  for (const testPage of pages) {
    console.log(`Measuring ${testPage.name}...`);

    await page.goto(testPage.url, { waitUntil: "networkidle" });

    // Wait for metrics to be collected
    await page.waitForTimeout(3000);

    const pageVitals = await page.evaluate(() => window.vitalsData);

    results.push({
      page: testPage.name,
      url: testPage.url,
      ...pageVitals,
    });
  }

  await browser.close();

  // Output results
  console.log("\n🚀 Web Vitals Results:");
  console.log("======================");

  results.forEach((result) => {
    console.log(`\n📄 ${result.page}:`);
    console.log(
      `   LCP: ${result.lcp?.toFixed(0) || "N/A"}ms (target: <2500ms)`,
    );
    console.log(
      `   FID: ${result.fid?.toFixed(0) || "N/A"}ms (target: <100ms)`,
    );
    console.log(`   CLS: ${result.cls?.toFixed(3) || "N/A"} (target: <0.1)`);
    console.log(
      `   FCP: ${result.fcp?.toFixed(0) || "N/A"}ms (target: <1800ms)`,
    );
    console.log(
      `   TTFB: ${result.ttfb?.toFixed(0) || "N/A"}ms (target: <600ms)`,
    );
  });

  // Check if any metrics exceed thresholds
  const thresholds = {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    fcp: 1800,
    ttfb: 600,
  };

  let hasViolation = false;

  results.forEach((result) => {
    Object.entries(thresholds).forEach(([metric, threshold]) => {
      if (result[metric] && result[metric] > threshold) {
        console.error(
          `❌ ${result.page}: ${metric.toUpperCase()} (${result[metric]}) exceeds threshold (${threshold})`,
        );
        hasViolation = true;
      }
    });
  });

  if (hasViolation) {
    process.exit(1);
  } else {
    console.log("\n✅ All Web Vitals within acceptable ranges");
  }
}

measureWebVitals().catch(console.error);
```

### 6. Accessibility Test (tests/e2e/src/accessibility.spec.ts)

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Compliance", () => {
  test("Dashboard should be accessible", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForSelector('[data-testid="kpi-header"]');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Issue list should be accessible", async ({ page }) => {
    await page.goto("/issues");
    await page.waitForSelector('[data-testid="issue-list"]');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Issue detail should be accessible", async ({ page }) => {
    await page.goto("/issues/test-issue-123");
    await page.waitForSelector('[data-testid="issue-detail"]');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

## Usage Instructions

### 1. Local Development

```bash
# Run performance tests
npm run test:performance

# Measure Web Vitals
npm run vitals:measure

# Run accessibility tests
npm run test:a11y

# Generate Lighthouse report
npm run lighthouse:ci
```

### 2. CI Integration

- Performance tests run on every PR
- Bundle size checked and reported
- Web Vitals monitored with thresholds
- Accessibility violations block deployment

### 3. Monitoring Thresholds

- **LCP**: < 2.5s (Good)
- **FID**: < 100ms (Good)
- **CLS**: < 0.1 (Good)
- **Bundle Size**: < 800KB total
- **Accessibility**: Zero violations

This setup ensures continuous monitoring of UI quality and performance, with automated gates to prevent regressions.
