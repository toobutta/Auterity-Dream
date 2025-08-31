# Auterity Error-IQ Frontend

A modern React application for error intelligence and quality management, built with TypeScript, Tailwind CSS, and Vite.

## 🚀 Features

- **Modern React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive, utility-first styling
- **Vite** for fast development and optimized builds
- **Comprehensive API client** with error handling and authentication
- **Reusable UI components** with consistent design patterns
- **Error boundary** for graceful error handling
- **Custom hooks** for API calls and state management
- **Development environment** with Docker and dev containers

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── templates/       # Page templates (Dashboard, Form, List)
│   │   └── ErrorBoundary.tsx # Error boundary component
│   ├── hooks/               # Custom React hooks
│   │   └── useApi.ts        # API hooks (useApi, useAuth, useFileUpload)
│   ├── lib/                 # Core libraries
│   │   └── api-client.ts    # Standardized API client
│   ├── config/              # Configuration files
│   │   └── constants.ts     # App constants and configuration
│   ├── utils/               # Utility functions
│   │   └── common.ts        # Common helper functions
│   └── types/               # TypeScript type definitions
├── .devcontainer/           # Development container configuration
├── .env.example            # Environment variables template
└── package.json            # Dependencies and scripts
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (for dev containers)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd auterity-error-iq/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

### Development with Dev Containers

For a consistent development environment:

1. **Open in VS Code**
2. **Install Dev Containers extension**
3. **Reopen in container** (Command Palette: "Dev Containers: Reopen in Container")

## 📚 Core Components

### API Client (`src/lib/api-client.ts`)

Standardized HTTP client with:

- Automatic error handling
- Authentication support
- Request/response interceptors
- TypeScript support
- Timeout configuration

```typescript
import { apiClient } from '../lib/api-client';

// GET request
const response = await apiClient.get('/users');

// POST request
const newUser = await apiClient.post('/users', {
  body: { name: 'John Doe', email: 'john@example.com' }
});
```

### Custom Hooks (`src/hooks/useApi.ts`)

React hooks for API interactions:

- `useApi` - Generic API hook with loading states
- `useAuth` - Authentication management
- `useFileUpload` - File upload handling

```typescript
import { useApi } from '../hooks/useApi';

function UserList() {
  const { data, loading, error, execute } = useApi('/users');

  useEffect(() => {
    execute();
  }, [execute]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

### Page Templates (`src/components/templates/`)

Reusable page layouts:

- `PageTemplate` - Basic page structure
- `DashboardTemplate` - Dashboard with stats cards
- `FormTemplate` - Form layout with validation
- `ListTemplate` - List/table layout

```typescript
import { DashboardTemplate } from '../components/templates/PageTemplates';

function Dashboard() {
  return (
    <DashboardTemplate
      title="Error Dashboard"
      stats={[
        { label: 'Total Errors', value: '1,234' },
        { label: 'Resolved', value: '987' },
        { label: 'Pending', value: '247' }
      ]}
    >
      {/* Dashboard content */}
    </DashboardTemplate>
  );
}
```

### Error Boundary (`src/components/ErrorBoundary.tsx`)

Comprehensive error handling:

- Catches React errors
- User-friendly error display
- Development error details
- Retry functionality
- Error reporting integration

```typescript
import { ErrorBoundary } from '../components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourAppComponents />
    </ErrorBoundary>
  );
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API base URL | `/api` |
| `VITE_API_TIMEOUT` | Request timeout (ms) | `30000` |
| `VITE_APP_NAME` | Application name | `Auterity Error-IQ` |
| `VITE_ENABLE_DEBUG_MODE` | Enable debug features | `true` |

### Constants (`src/config/constants.ts`)

Centralized configuration for:

- API endpoints
- HTTP status codes
- UI constants
- Validation rules
- File upload limits

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔒 Security

- **Authentication**: JWT-based auth with refresh tokens
- **API Security**: Request/response sanitization
- **Error Handling**: Secure error messages (no sensitive data leakage)
- **Input Validation**: Client and server-side validation
- **HTTPS**: Enforced in production

## 📈 Performance

- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Components and routes loaded on demand
- **Image Optimization**: Automatic image optimization and WebP support
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching**: Aggressive caching strategies for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure linting passes
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Contact the development team

---

Built with ❤️ using React, TypeScript, and modern web technologies.
