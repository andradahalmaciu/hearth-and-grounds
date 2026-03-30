# Reflection - NeXtgineer Training
**Author:** Andrada Halmaciu
**Project:** Hearth & Grounds - Specialty Coffee Shop Web App

---

## 1. What Worked Well

I was genuinely surprised by how much Claude understood without being told. When implementing the CSV export, it spotted that the download logic didn't belong in the API service layer and moved it to a utility without me asking. That kind of awareness felt like working with a real developer.

The `implement-story` skill changed how I think about workflows. Instead of orchestrating steps manually, I invoked a skill and focused on reviewing the output. It felt like having a small team, not a single tool.

The Playwright browser testing was a highlight. Navigating the live app, clicking buttons, checking console errors - all from the same conversation. That felt like the future.

The quality gate habit was the biggest time saver. Running tests and lint before every commit caught issues early. Without it I would have missed the failing Reserve tests entirely.

---

## 2. Challenges & Solutions

The failing tests were a good lesson. The error pointed to the wrong place - the API mock wasn't being called - but the real problem was earlier: the form wasn't submitting because a required field was never filled. I learned to look upstream when something is never called.

The code review roleplay surfaced a blind spot I didn't know I had. CSV injection via `=`, `+`, `-` prefixes - I had never considered it. One line of code fixed it, but the lesson was bigger: user input is untrusted for every format it touches, not just SQL or HTML.

The `.gitignore` mistake was avoidable. I ignored the whole `.claude/` directory to reduce VS Code noise, but those files were required deliverables. Be specific with ignore rules from the start.

---

## 3. Best Practices Discovered

Giving Claude a role with constraints made the biggest difference. "You are Alex, a skeptical senior developer" produced specific, actionable feedback. "Review my code" would not have.

Scope constraints matter. Without explicitly saying "do ONLY this, do not touch anything else," Claude will improve surrounding code you didn't ask about. Once I added that, output was tighter and easier to review.

I'd set up `CLAUDE.md` and custom skills before writing any code next time. Having the context and workflows in place from the start makes everything more consistent.

---

## 4. Client Application Ideas

This is going to change the way we work. Not slightly - fundamentally. The speed, the coverage, the consistency - it's not comparable to anything I've used before.

The quality gate chain is what I'd bring to clients first. Implement - QA agent review - UX review - browser test - commit. Most teams do code review as a human step at the end. Running an automated pass first means humans focus on architecture and business logic, not missed edge cases.

Small product teams gain the most. The `implement-story` workflow covers backend, frontend, and tests in one invocation. That's exactly the context-switching that slows small teams down.

For adoption I'd start with `handle-pr-feedback`. It's low risk - the code already exists - and immediately saves time. Engineers see Claude doing something useful without having to trust it with new implementation. The case for the fuller workflow makes itself from there.

The one thing I'd tell any team: invest in `CLAUDE.md` before anything else. The quality of what Claude produces is directly proportional to how well it understands your project. That document is the foundation everything else builds on.
