# AI-Generated Commit Message Rules

## Overview

This document defines the exact format and rules for AI-generated commit messages in the Auterity Error IQ platform. These rules ensure consistency, clarity, and traceability across all code changes.

## Core Format

### Conventional Commits Structure

```text
<type>(<scope>): <description>

<body>

<footer>
```

### Required Elements

1. **Type**: One of the predefined commit types
2. **Scope**: Component or area affected (recommended)
3. **Description**: Brief, imperative description (max 50 chars)
4. **Body**: Structured explanation for significant changes
5. **Footer**: References and metadata

## Commit Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat(workflow): add parallel execution engine` |
| `fix` | Bug fix | `fix(auth): resolve token validation race condition` |
| `docs` | Documentation | `docs(api): update workflow execution endpoints` |
| `style` | Code formatting | `style(backend): apply black formatting to auth module` |
| `refactor` | Code restructuring | `refactor(backend): standardize error handling patterns` |
| `perf` | Performance improvements | `perf(workflow): optimize step execution batching` |
| `test` | Test changes | `test(auth): add integration tests for JWT flow` |
| `build` | Build/dependency changes | `build(deps): update fastapi to latest version` |
| `ci` | CI/CD changes | `ci(github): add code quality gates` |
| `chore` | Maintenance tasks | `chore(config): update environment variables` |
| `revert` | Revert previous commit | `revert: feat(auth): implement SSO integration` |

## Scopes

| Scope | Description | File Patterns |
|-------|-------------|---------------|
| `backend` | Backend Python/FastAPI | `backend/**`, `app/**`, `*.py` |
| `frontend` | Frontend React/TypeScript | `frontend/**`, `src/**`, `*.tsx`, `*.ts` |
| `api` | API endpoints | `**/api/**`, `**/routes/**` |
| `db` | Database models/migrations | `**/models/**`, `**/migrations/**` |
| `auth` | Authentication/authorization | `**/auth/**`, `**/security/**` |
| `workflow` | Workflow execution engine | `**/workflow/**`, `**/execution/**` |
| `agent` | AI agent framework | `**/agents/**`, `**/orchestrator/**` |
| `ui` | User interface components | `**/components/**`, `**/styles/**` |
| `config` | Configuration files | `*.json`, `*.yaml`, `*.toml`, `.env*` |
| `infra` | Infrastructure/deployment | `docker/**`, `kubernetes/**` |
| `deps` | Dependencies | `requirements*.txt`, `package*.json` |
| `test` | Test files | `tests/**`, `**/*.test.*` |
| `ci` | CI/CD configuration | `.github/**`, `*.yml` |
| `docs` | Documentation | `docs/**`, `*.md` |

## Message Structure Rules

### Subject Line
- **Format**: `<type>(<scope>): <description>`
- **Length**: Maximum 50 characters
- **Case**: Lowercase, imperative mood
- **Punctuation**: No period at the end
- **Pattern**: `^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z-]+\))?: .{1,50}$`

### Body (For Significant Changes)
Use structured format with bullet points:
```
- What: <clear description of what changed>
- Why: <business reason or problem being solved>
- How: <brief technical implementation detail>
```

**Requirements**:
- Start with blank line after subject
- Maximum 72 characters per line
- Use present tense, imperative mood
- Focus on what and why, not how

### Footer (Optional)
```
Refs: #<issue_number>
Tested: <testing evidence>
Breaking Change: <if applicable>
Co-authored-by: <if applicable>
```

## Examples

### Simple Bug Fix
```
fix(auth): handle expired token edge case
```

### Feature with Full Structure
```
feat(workflow): add parallel execution engine

- What: Implemented concurrent step processing with dependency resolution
- Why: Improve workflow performance for complex automation tasks  
- How: Added TopologicalExecutor with async batch processing

Refs: #147
Tested: Unit tests, integration tests, performance benchmarks
```

### Refactoring Example
```
refactor(backend): standardize error handling patterns

- What: Unified exception hierarchy and response formatting
- Why: Reduce code duplication and improve error consistency
- How: Created BaseAppException with proper HTTP status mapping

Tested: All existing tests pass, error scenarios covered
```

### Breaking Change Example
```
feat(api): implement new authentication flow

- What: Replaced JWT with OAuth2 + PKCE for enhanced security
- Why: Address security vulnerabilities in current auth system
- How: Integrated with industry-standard OAuth2 providers

Breaking Change: Existing API tokens will be invalidated
Migration: See docs/auth-migration-guide.md

Refs: #203
Tested: Full regression suite, security audit
```

## AI Generation Context

### Analysis Inputs
- Changed files and their types
- Diff statistics (additions, deletions, modifications)
- Directory structure affected
- Test file changes
- Configuration changes
- Breaking change detection

### Scope Detection Logic
1. Analyze file patterns to determine primary scope
2. If multiple scopes affected, choose the most business-critical
3. For cross-cutting changes, use broader scope (e.g., `backend`, `frontend`)
4. Prioritize business logic over infrastructure changes

### Type Classification
- **New files**: Usually `feat`
- **Deleted files**: Usually `refactor`
- **Test files only**: Use `test`
- **Config files only**: Use `chore`
- **Documentation only**: Use `docs`
- **Bug fix keywords**: Use `fix`
- **Feature keywords**: Use `feat`

## Validation Rules

### Forbidden Patterns
- Generic subjects: "update", "changes", "misc", "stuff", "work"
- Capitalized first letter (except proper nouns)
- Ending period
- Missing type or malformed type
- WIP/TODO/TEMP prefixes

### Required for Large Changes
- Body explanation for changes affecting >5 files
- Test evidence for new features
- Issue reference for bug fixes
- Breaking change notice if applicable

## Quality Checks

### Automated Validation
1. Conventional commit format compliance
2. Subject length validation
3. Scope existence validation  
4. Body structure for complex changes
5. Footer format validation

### Manual Review Triggers
- Breaking changes
- Security-related changes
- Performance modifications
- Database schema changes
- API contract changes

## Implementation

### VS Code Settings
The rules are configured in `.vscode/settings.json` with:
- Git input validation
- Commit message templates
- AI generation context
- Project-specific mappings

### Git Hooks (Recommended)
```bash
#!/bin/sh
# .git/hooks/commit-msg
node .git/hooks/validate-commit-msg.js "$1"
```

### IDE Integration
- Configure commit message templates
- Enable conventional commit validation
- Set up auto-completion for types/scopes
- Configure AI context inclusion

## Project-Specific Guidelines

### Auterity Error IQ Platform
- **Business Domains**: Workflow automation, AI agent orchestration, multi-tenant auth
- **Technical Areas**: FastAPI backend, React frontend, PostgreSQL, Redis, Docker
- **Quality Standards**: All changes need tests, breaking changes need migration guides

### Priority Keywords
- Authentication, workflow, agent, security, performance
- Database, API, frontend, backend, compliance
- Error handling, testing, documentation

This comprehensive rule set ensures that all AI-generated commit messages maintain high quality, consistency, and provide clear context for code changes across the Auterity platform.
