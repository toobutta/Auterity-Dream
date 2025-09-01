# Contributing to Auterity Unified AI Platform

## Welcome! 🎉

Thank you for your interest in contributing to the Auterity Unified AI Platform. This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- Be respectful and inclusive
- Focus on constructive feedback
- Accept responsibility and apologize for mistakes
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher
- Python 3.12 or higher (for backend development)
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/auterity-error-iq.git
   cd auterity-error-iq
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   cd apps/workflow-studio && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

## Development Workflow

### 1. Choose an Issue
- Check [GitHub Issues](https://github.com/toobutta/auterity-error-iq/issues) for open tasks
- Comment on the issue to indicate you're working on it
- Wait for maintainer assignment

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 3. Make Changes
- Follow the coding standards below
- Write tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```
Then create a pull request on GitHub.

## Coding Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Strict type checking enabled
- ESLint configuration must pass
- Prettier formatting required
- Maximum line length: 100 characters

### Python (Backend)
- Black code formatting
- isort import sorting
- Type hints required
- Docstrings for all functions

### File Naming
- Use kebab-case for files: `user-profile.tsx`
- Use PascalCase for components: `UserProfile.tsx`
- Use camelCase for utilities: `formatDate.ts`

### Commit Messages
Follow conventional commits:
```
feat: add new feature
fix: resolve bug in user authentication
docs: update API documentation
style: format code with prettier
refactor: restructure user service
test: add unit tests for login component
chore: update dependencies
```

## Testing Guidelines

### Test Coverage
- Minimum 80% code coverage required
- All new features must include tests
- Integration tests for API endpoints
- E2E tests for critical user flows

### Running Tests
```bash
# Frontend unit tests
cd frontend && npm run test:coverage

# Backend tests
cd backend && python -m pytest --cov=. --cov-report=html

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Test Structure
```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
      Button.stories.tsx
  services/
    apiService.ts
    apiService.test.ts
```

## Pull Request Process

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] No console.log or debug statements
- [ ] Security considerations addressed
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] Commit messages follow guidelines

### PR Template
Use the provided PR template with:
- Clear description of changes
- Type of change (bug fix, feature, etc.)
- Testing completed
- Breaking changes noted
- Screenshots for UI changes

### Review Process
1. Automated checks must pass
2. At least one maintainer review required
3. Address review feedback
4. Squash commits before merge
5. Delete feature branch after merge

## Reporting Issues

### Bug Reports
- Use the bug report template
- Include steps to reproduce
- Provide environment details
- Attach screenshots/logs

### Feature Requests
- Use the feature request template
- Describe the problem you're solving
- Explain your proposed solution
- Consider alternative approaches

### Security Issues
- **DO NOT** create public issues for security vulnerabilities
- Email security@auterity.com directly
- Include detailed reproduction steps

## Recognition

Contributors are recognized through:
- GitHub contributor statistics
- Mention in release notes
- Attribution in documentation
- Community recognition

## Getting Help

- **Documentation**: [docs/](./docs/)
- **Discussions**: [GitHub Discussions](https://github.com/toobutta/auterity-error-iq/discussions)
- **Issues**: [GitHub Issues](https://github.com/toobutta/auterity-error-iq/issues)

Thank you for contributing to Auterity! 🚀
