# GitHub Repository Meta Structure

This directory centralizes community health files, automation, and compliance references for the Auterity Unified Platform.

## Directory Map

| Path | Purpose |
| --- | --- |
| `rules/` | Code ownership, triage rules, and labeling automation (e.g., `labeler.yml`). |
| `templates/` | Pull request and issue templates used by contributors. |
| `workflows/` | GitHub Actions workflows that drive CI/CD and guardrails. |
| `scripts/` | Helper scripts invoked by workflows (no runtime secrets). |
| `compliance/` | Dependabot policies, environment checklists, and security baselines. |

The primary `CODEOWNERS` file remains in `.github/CODEOWNERS` to satisfy GitHub's discovery rules. When updating ownership or
labeling logic, edit the files under `rules/` and ensure changes are reflected in the root `CODEOWNERS` as needed.
