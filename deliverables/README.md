# Deliverables Index

Quick-reference inventory of all Claude Code customisations built for **Hearth & Grounds**.

---

## Custom Skills

| Skill | Location | Description |
|-------|----------|-------------|
| `implement-story` | `.claude/skills/implement-story/SKILL.md` | Full story implementation workflow: reads the story, consults system-architect if needed, implements backend then frontend, runs quality gates (qa-specialist + ux-reviewer), commits and raises a PR |
| `auto-implement` | `.claude/skills/auto-implement/SKILL.md` | Lightweight story implementation — plan → approve → code → test → commit, without the full agent chain |
| `handle-pr-feedback` | `.claude/skills/handle-pr-feedback/SKILL.md` | Fetches reviewer comments from an ADO PR, groups them by priority, addresses each one, runs tests and lint, commits and posts a summary comment back on the PR |

---

## Custom Agents

| Agent | Location | Description |
|-------|----------|-------------|
| `qa-specialist` | `.claude/agents/qa-specialist.md` | Meticulous QA reviewer for Hearth & Grounds — tests happy paths, edge cases, auth boundaries, and accessibility; navigates the live app via Playwright and reports issues by severity |
| `researcher` | `.claude/agents/researcher.md` | Domain knowledge researcher constrained to authoritative sources only (SCA standards, MDN, OWASP, project schema) — never invents facts; used for coffee terminology, hospitality rules, and security decisions |
| `ux-reviewer` | `.claude/agents/ux-reviewer.md` | UX specialist who reviews public pages and admin panel for visual hierarchy, consistency, responsiveness (375px/768px), and accessibility (WCAG AA); uses Playwright to inspect the live app |

---

## Automated Workflow

| Workflow | Skill | Description |
|----------|-------|-------------|
| Story Implementation Pipeline | `implement-story` | Multi-step orchestration: Preparation → Planning (system-architect) → Implementation (senior-developer conventions) → Quality Gates (qa-specialist + ux-reviewer) → Completion (commit + PR + ADO update). Blocks on failures at each phase before proceeding. |

---

## Hooks

| Hook | Trigger | Location | Description |
|------|---------|----------|-------------|
| `block-dangerous-ops` | `PreToolUse` on Bash | `.claude/hooks/block-dangerous-ops.sh` | Intercepts Bash commands before execution; blocks `rm -rf`, `--force`, and force-push patterns with a deny decision |
| `warn-debug-statements` | `PostToolUse` on Write/Edit | `.claude/hooks/warn-debug-statements.sh` | Scans file content after every write; warns if `console.log` or `debugger` statements are detected |

Hooks are registered in `.claude/settings.json`.

---

## Other Deliverables

| File | Description |
|------|-------------|
| `CLAUDE.md` | Project context for AI — tech stack, conventions, API endpoints, test pyramid, Z-Cora commands |
| `README.md` | Full project documentation — features, architecture, setup, API reference, CI/CD |
| `azure-pipelines.yml` | CI/CD pipeline: Lint → Test → Build, triggers on PRs and pushes to `main` |
| `docs/adr/001-tech-stack.md` | ADR: React + Vite + Express + SQLite technology choices |
| `docs/adr/002-authentication.md` | ADR: JWT bearer tokens + bcrypt, single admin user |
| `docs/adr/003-data-model.md` | ADR: Four flat SQLite tables, no ORM, self-initialising schema |
| `docs/stories/user-stories.md` | All user stories US-01–US-09 with acceptance criteria and complexity ratings |
| `docs/browser-test-report.md` | Playwright browser test report — 8 test cases, 0 console errors |
| `deliverables/reflection.md` | Personal reflection on learnings, challenges, and best practices |
| `deliverables/prompts-collection/` | Exported Claude Code conversation history |
