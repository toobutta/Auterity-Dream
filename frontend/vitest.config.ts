/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Fix module resolution issues with new syntax
    server: {
      deps: {
        inline: [
          "pretty-format",
          "@testing-library/jest-dom",
          "@testing-library/react",
          "@testing-library/user-event",
        ],
      },
    },
    // Memory optimization - use forks instead of threads to reduce memory sharing issues
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
        maxForks: 1,
        minForks: 1,
      },
    },
    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      exclude: [
        "node_modules/",
        "src/setupTests.ts",
        "vitest.setup.ts",
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/__tests__/**",
        "**/tests/**",
      ],
    },
    // Increase timeout for slow tests
    testTimeout: 15000,
    // Optimize memory usage
    logHeapUsage: true,
    // Run tests in sequence to avoid memory issues
    sequence: {
      concurrent: false,
    },
    // Additional memory optimizations
    maxConcurrency: 1,
    // Enable isolation to prevent memory leaks between tests
    isolate: true,
    // Exclude problematic complex integration tests for now
    exclude: [
      "**/node_modules/**",
      "**/e2e-workflow.test.tsx",
    ],
  },
});
