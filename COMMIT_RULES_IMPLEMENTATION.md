# Implementation Guide: AI Commit Message Rules

## Quick Setup

### 1. VS Code Integration (Already Configured)

The commit message rules are already integrated into your VS Code workspace via `.vscode/settings.json`. The AI will automatically:

- Analyze changed files to determine scope
- Select appropriate commit type based on changes
- Generate structured commit messages
- Validate format against conventional commit standards

### 2. Git Hook Installation (Recommended)

To enforce commit message validation:

```bash
# Copy the validation script to git hooks
cp scripts/validate-commit-msg.js .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg

# For Windows (Git Bash):
cp scripts/validate-commit-msg.js .git/hooks/commit-msg
```

### 3. Manual Validation

Test your commit messages:

```bash
# Test a commit message
node scripts/validate-commit-msg.js commit_message.txt

# Example commit message file:
echo "feat(workflow): add parallel execution engine" > test_commit.txt
node scripts/validate-commit-msg.js test_commit.txt
```

## AI Generation Examples

Based on the current repository state, here are examples of properly formatted AI-generated commit messages:

### Current Python Formatting Work

```text
style(backend): apply black formatting and import organization

- What: Reformatted 171 Python files and organized imports in 31 files
- Why: Ensure consistent code style across the entire backend codebase
- How: Used Black formatter with 88-char limit and isort for import sorting

Tested: All tests pass, no functional changes
```

### TypeScript Configuration Updates

```text
fix(config): update TypeScript moduleResolution to node16

- What: Updated tsconfig.json files to use modern module resolution
- Why: Resolve deprecated "node" moduleResolution warnings in TypeScript
- How: Changed moduleResolution from "node" to "node16" in affected configs

Refs: Phase 1 of systematic error resolution
Tested: TypeScript compilation works without warnings
```

### Multi-File Manual Fixes

```text
fix(backend): resolve Black formatter parsing errors

- What: Manually corrected syntax errors in 11 Python files  
- Why: Black formatter failed on files with indentation and syntax issues
- How: Fixed indentation, line length, and undefined variable references

Files: tenant_middleware.py, template.py, __init__.py, orchestrator_compatible.py
Tested: All files now pass Black formatting validation
```

## Scope Detection Logic

The AI uses these patterns to automatically detect scopes:

| File Pattern | Detected Scope | Example |
|--------------|----------------|---------|
| `backend/app/api/**` | `api` | `fix(api): handle malformed requests` |
| `backend/app/auth/**` | `auth` | `feat(auth): add MFA support` |
| `backend/app/services/workflow**` | `workflow` | `perf(workflow): optimize execution batching` |
| `backend/app/services/agents/**` | `agent` | `feat(agent): implement smart triage` |
| `frontend/src/**` | `frontend` | `feat(frontend): add workflow designer` |
| `tests/**` | `test` | `test(auth): add integration test coverage` |
| `*.json`, `*.yaml` | `config` | `chore(config): update environment settings` |
| `requirements*.txt` | `deps` | `build(deps): update FastAPI to v0.104` |

## Type Classification Rules

The AI classifies commit types based on:

| Change Pattern | Type | Logic |
|----------------|------|-------|
| New files added | `feat` | New functionality introduced |
| Bug fix keywords | `fix` | Words like "fix", "resolve", "correct" |
| Test files only | `test` | Only changes in test directories |
| Config files only | `chore` | Configuration updates without logic changes |
| Documentation only | `docs` | README, markdown, or doc changes |
| Formatting changes | `style` | Black, isort, or linting fixes |
| Code restructuring | `refactor` | Architecture or organization changes |

## Quality Gates

### Automatic Validation

✅ **Pass Criteria:**
- Conventional commit format
- Valid type and scope
- Subject ≤ 50 characters
- No forbidden generic terms
- Proper capitalization and punctuation

⚠️ **Warning Triggers:**
- Unknown scope (not in predefined list)
- Generic terms like "update", "changes"
- Missing body for significant changes
- Long body lines (>72 chars)

❌ **Fail Criteria:**
- Invalid conventional format
- Invalid commit type
- Subject too long (>50 chars)
- WIP/TODO/TEMP prefixes
- Empty commit message

### Manual Review Required

These changes trigger manual review:

- Breaking changes (API modifications)
- Security-related changes
- Database schema modifications
- Performance-critical changes
- Cross-system integrations

## Integration with Current Workflow

### Phase-Based Development

Current systematic error resolution work:

```text
# Phase 1: TypeScript
fix(config): resolve deprecated moduleResolution warnings

# Phase 3: Python Formatting  
style(backend): standardize code formatting across backend

# Phase 4: SQLAlchemy (upcoming)
fix(db): resolve column type assignment issues

# Phase 5: Validation (upcoming)
ci(validation): add comprehensive type checking pipeline
```

### Multi-Agent Coordination

For multi-agent workflows (Grok → Gemini → Claude):

```text
# Grok quick wins
fix(config): resolve TypeScript compilation warnings

# Gemini formatting
style(backend): apply comprehensive code formatting

# Claude validation  
ci(validation): implement end-to-end quality checks
```

## Best Practices

### 1. Context Inclusion

Always include relevant context:
- Changed file count for formatting work
- Performance impact for optimizations  
- Breaking change implications
- Test coverage evidence

### 2. Business Value

Connect technical changes to business value:
- "improve developer experience"
- "enhance system reliability"
- "reduce maintenance overhead"
- "increase automation efficiency"

### 3. Implementation Details

For significant changes, include:
- What specific patterns were used
- Why this approach was chosen
- How the solution addresses the problem
- What alternatives were considered

## Troubleshooting

### Common Issues

**Issue**: AI generates generic commit messages
**Solution**: Ensure changed files provide clear context

**Issue**: Scope detection is incorrect
**Solution**: Add file patterns to scope mapping in settings

**Issue**: Type classification is wrong
**Solution**: Include more descriptive keywords in commit content

**Issue**: Validation fails in git hook
**Solution**: Check Node.js is available and script is executable

### Support

- Reference: `AI_COMMIT_MESSAGE_RULES_FORMATTED.md`
- Quick guide: `COMMIT_QUICK_REFERENCE.md`
- Validation: `scripts/validate-commit-msg.js`
- Configuration: `.vscode/settings.json`

This implementation ensures consistent, high-quality commit messages that provide clear context and traceability for all changes in the Auterity platform.
