# WorkflowAnalyticsDashboard Component

A dashboard component with the following features:
- websocket
- loading

## Usage

```tsx
import { WorkflowAnalyticsDashboard } from './components/WorkflowAnalyticsDashboard';

function App() {
  return (
    <WorkflowAnalyticsDashboard
      className="my-custom-class"
      
    />
  );
}
```

## Props


- `className`: Additional CSS classes

## Features

- **websocket**: Real-time communication via WebSocket
- **loading**: Loading states and async operations

## Testing

Run tests with:
```bash
npm test -- WorkflowAnalyticsDashboard.test.tsx
```

## Stories

View component stories in Storybook:
```bash
npm run storybook
```