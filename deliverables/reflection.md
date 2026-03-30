# Reflection - NeXtgineer Training
**Author:** Andrada Halmaciu
**Project:** Hearth & Grounds - Specialty Coffee Shop Web App

---

## 1. What Worked Well

As a QA automation engineer I was surprised what can be build in such a short amount of time.I could build an entire webapp FE and BE using the latest technologies and on top of that building the whole architecture with 1 prompt. One thing that I remember now is that when implementing the CSV export, it spotted that the download logic didn't belong in the API service layer and moved it to a utility without me asking. Awesome.

The Playwright browser testing was a highlight. Navigating the live app, clicking buttons, checking console errors; all from the same conversation. For a QA engineer that is a bit of a game changer.

---

## 2. Challenges & Solutions

Due to the limited number of tokens I had to use my personal subscription and then I lost a lot of context plus prompt files which maybe matter to the overall evaluation of this... plus each time I resumed working on this project I missed the whole context and didn't have much continuity despite having the agents I defined. Also I'm not really sure of all of the gaps these might have in terms of quality as it's size is quite big and don't have the capacity to really review it well.
There were failing tests generated and the error pointed to the wrong place which made me loose time to actually focus on where's the issue and had to debug it myself.

---

## 3. Best Practices Discovered

I like how the scope constraints thing worked. Without explicitly saying "do ONLY this, do not touch anything else," it improved surrounding code I didn't ask about and once I added that, output was tighter and easier to review. I would set up `CLAUDE.md` and custom skills before writing any code next time. I think having the context and workflows in place from the start makes everything more consistent.

---

## 4. Client Application Ideas

I think this is going to change the way we work but only if we know how to use it. It could add speed but not precision, certainty nor quality. Claude code it is indeed not comparable to anything I've used before but still I think there's a lot to consider when used in real projects.
I think from a QA perspective that the quality gate chain is super useful too. Most teams do code review as a human step at the end. Running an automated pass first means humans focus on architecture and business logic, not missed edge cases, but again this is very dependent on how this whole gate is set up to behave considering the actual real project. The one thing I'd tell any team: invest in `CLAUDE.md` before anything else. That document could be the foundation everything else builds on.
