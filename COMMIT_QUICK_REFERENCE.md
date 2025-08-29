# 🤖 AI Commit Message Quick Reference

## Format Template
```
<type>(<scope>): <description>

- What: <what changed>
- Why: <business reason> 
- How: <technical approach>

Refs: #<issue>
Tested: <evidence>
```

## Types 🏷️
- `feat` - New feature
- `fix` - Bug fix  
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructure
- `perf` - Performance
- `test` - Tests
- `build` - Dependencies
- `ci` - CI/CD
- `chore` - Maintenance

## Scopes 📁
- `backend` - Python/FastAPI
- `frontend` - React/TypeScript  
- `api` - Endpoints
- `auth` - Authentication
- `workflow` - Execution engine
- `agent` - AI framework
- `db` - Database
- `ui` - Components
- `config` - Settings
- `test` - Test files

## Examples 💡

### Simple Fix
```
fix(auth): handle expired token edge case
```

### Full Feature
```
feat(workflow): add parallel execution engine

- What: Implemented concurrent step processing with dependency resolution
- Why: Improve workflow performance for complex automation tasks
- How: Added TopologicalExecutor with async batch processing

Refs: #147
Tested: Unit tests, integration tests, performance benchmarks
```

## Rules ✅
- Subject ≤ 50 chars
- Lowercase, imperative
- No ending period
- Body for changes >5 files
- Test evidence required
- Reference issues for bugs

## AI Context 🧠
✅ Include: Changed files, diff stats, test changes
❌ Exclude: Temp files, logs, cache, node_modules

## Quality Gates 🚪
- Conventional format enforced
- Scope validation required
- Breaking changes flagged
- Security changes reviewed
