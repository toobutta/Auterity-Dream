import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize Chrome DevTools integration
import { initChromeDevTools } from "./utils/chrome-devtools-bridge";

// Initialize DevTools in development mode
if (import.meta.env.DEV) {
  const devTools = initChromeDevTools({
    enablePerformanceMonitoring: true,
    enableNetworkAnalysis: true,
    enableMemoryProfiling: true,
    enableConsoleEnhancement: true,
    enableAccessibilityAuditing: true,
    enableSecurityScanning: true, // Now enabled
    environment: 'development',
  });

  devTools.init().then(() => {
    console.log('[DevTools] Chrome DevTools integration initialized');
  }).catch((error: unknown) => {
    console.error('[DevTools] Failed to initialize:', error);
  });
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error("Root element not found");
}
