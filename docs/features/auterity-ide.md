# Auterity IDE Bundle

| Capability | Owner | Maturity |
| --- | --- | --- |
| Auterity IDE (VS Code + GitHub) | Developer Productivity | Beta |

The Auterity IDE delivers a packaged workspace that combines Workflow Studio dashboards, Git automation, and RelayCore telemetry
in one canvas. Use this guide to onboard quickly.

## Components

- **Unified Canvas:** [`frontend/src/components/ide/UnifiedIDE.tsx`](../../frontend/src/components/ide/UnifiedIDE.tsx) stitches
together Studio dashboards, RelayCore activity, and NeuroWeaver insights.
- **Git Controls:** [`frontend/src/components/ide/GitPanel.tsx`](../../frontend/src/components/ide/GitPanel.tsx) surfaces branch
workflows, commit status, and RelayCore deployment hooks.
- **GitHub Integration Service:** [`frontend/src/services/githubIntegration.ts`](../../frontend/src/services/githubIntegration.ts)
wraps GitHub App authentication, repo cloning, and workflow status polling.
- **Environment Definition:** [`.devcontainer/devcontainer.json`](../../.devcontainer/devcontainer.json) provisions Docker
compose, Node, Python, and RelayCore CLI dependencies to mirror CI.
- **Recommended Extensions:** [`.vscode/extensions.json`](../../.vscode/extensions.json) ensures linting, Python tooling, and
GitHub authentication remain aligned with platform policies.

## Onboarding Steps

1. **Clone via Auterity IDE Launcher**
   - Open VS Code and choose *Open Remote Repository* using the Auterity GitHub App credentials.
   - Select the Auterity Unified Platform repository; the dev container build kicks off automatically.

2. **Dev Container Bootstrap**
   - The configuration in `.devcontainer/devcontainer.json` installs Node 18, Python 3.11, Docker-in-Docker utilities, and the
     RelayCore CLI.
   - Post-create commands hydrate workspaces (`frontend`, `services/api`, `systems/relaycore`) and register linting hooks.

3. **Workspace Layout**
   - Launch the *Auterity IDE* view from the VS Code activity bar. `UnifiedIDE.tsx` renders Workflow Studio dashboards alongside
     Git and RelayCore panels.
   - Use the *Git* pane to manage branches; `GitPanel.tsx` surfaces commit history, PR creation, and CI feedback.

4. **GitHub Integration**
   - Authenticate through the in-app flow powered by `githubIntegration.ts` to receive repository-scoped tokens.
   - The service polls GitHub checks, updates RelayCore deployment readiness, and triggers Workflow Studio preview builds.

5. **Run Local Services**
   - Within the dev container terminal, run `npm run dev` to start the docker-compose stack.
   - Frontend assets hot-reload; `services/api` exposes the FastAPI endpoints while RelayCore integrates via WebSocket bridges.

## Operational Notes

- **Policy Enforcement:** VS Code settings enforce formatting and linting; failing tasks block PR creation inside the IDE.
- **Secrets Handling:** GitHub App secrets resolve through the dev container; avoid storing tokens locally.
- **Offline Mode:** When GitHub is unavailable, the IDE surfaces cached workflow metadata but disables deployment actions.

Refer back to this guide whenever new engineers join the platform or when updating IDE features.
