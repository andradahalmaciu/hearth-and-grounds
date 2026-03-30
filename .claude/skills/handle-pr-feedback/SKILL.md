---
name: handle-pr-feedback
description: Handle reviewer feedback on a pull request. Provide the PR number. Fetches comments from Azure DevOps, addresses each item, commits, and summarises changes back on the PR.
---

Handle feedback on the specified pull request.

1. Fetch PR details and all reviewer comments from Azure DevOps (using the ADO MCP)
2. List every actionable feedback item — group by: must-fix, should-fix, optional
3. If any feedback item is unclear, ask for clarification **before making any changes**
4. For each must-fix and should-fix item:
   a. Analyse the request in context of the existing code
   b. Implement the fix following project conventions (Zod validation, authenticate middleware, etc.)
   c. Add or update tests if the fix touches business logic
5. Run `npm test` — all tests must pass
6. Run `npm run lint` — no new errors
7. Create a commit on the same branch:
   - Message: `fix: address PR feedback`
   - Body: bullet list of each item addressed
8. Push to the same branch (the PR updates automatically)
9. Post a comment on the PR summarising:
   - What was addressed and how
   - Anything intentionally not addressed (with rationale)
   - Any follow-up questions for the reviewer
