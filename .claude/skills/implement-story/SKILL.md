---
name: implement-story
description: Implement a Hearth and Grounds story with full workflow including quality gates. Chains system-architect, senior-developer, qa-specialist, and ux-reviewer agents. Use this for any feature affecting the API, data model, or UI.
---

Implement the specified story with the full Hearth and Grounds workflow.

## Phase 1: Preparation
1. Read the story from `docs/stories/user-stories.md` (or fetch from Azure DevOps if an ID is provided)
2. Check whether any dependent stories are complete (dependencies listed in the story)
3. If blockers exist, STOP and report them — do not proceed
4. Identify which layers are affected: backend routes, DB schema, frontend pages, tests

## Phase 2: Planning
1. Invoke the **system-architect** agent if any of the following apply:
   - A new DB table or column is needed
   - A new API endpoint or change to an existing one
   - A new npm dependency is being introduced
   - Auth or security is involved
2. The architect produces a written plan covering: data model changes, API contract, and any ADR updates needed
3. If no architecture change is needed, the **senior-developer** agent produces the plan directly
4. Present the full implementation plan
5. **WAIT for user approval before writing any code**

## Phase 3: Implementation
1. Implement following the approved plan — backend first, then frontend
2. Backend conventions:
   - Validate all request bodies with Zod before any business logic
   - Protected routes must use the `authenticate` middleware
   - DB access only via `getDb()` in `backend/src/db/schema.ts`
3. Frontend conventions:
   - API calls go in `frontend/src/services/`
   - New pages go in `frontend/src/pages/`
4. Write unit tests (Vitest) alongside the code — target >80% coverage for new code
5. Run `npm test` and fix any failures before proceeding

## Phase 4: Quality Gates
1. **qa-specialist** agent reviews the implementation for:
   - Edge cases not covered by tests
   - Missing input validation
   - Auth boundary issues
   - Report any Critical or Major issues — fix them before continuing
2. **ux-reviewer** agent reviews any UI changes using Playwright:
   - Navigate the affected pages in the running app (`npm run dev`)
   - Check mobile (375px) and desktop viewports
   - Flag any High priority UX issues — fix them before continuing
3. If the researcher agent is needed for domain-specific decisions (e.g. coffee terminology, reservation rules), invoke it now

## Phase 5: Completion
1. Run the full test suite: `npm test`
2. Run lint: `npm run lint`
3. All checks must pass before committing
4. Create a commit on a feature branch:
   - Branch name: `feat/[story-id]-[short-description]`
   - Commit message: `feat: [story summary]`
5. Push the branch and create a pull request
6. Update the story status to "Done" (in `docs/stories/user-stories.md` or ADO)
7. Provide a summary: what was built, what was tested, any open questions

If any phase fails, STOP and report the issue clearly before attempting to continue.
