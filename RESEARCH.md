# Portfolio research and how this site applies it

Researched 2026-09-22. This file is the reasoning behind the site's structure, so you
can re-check it later or argue with it. Every claim below is sourced; the last section
lists what the research says but this site still does not do.

## Sources consulted

| Source | What it gave |
| --- | --- |
| [What 60+ Hiring Managers Look For](https://soychristian.com/contents/developer-portfolio-guide/) (survey of 60+ hiring managers, via Profy.dev) | Overall structure, case study content, mistakes list |
| [Josh Comeau, Building an Effective Dev Portfolio](https://www.joshwcomeau.com/effective-portfolio/) ([notes](https://www.jenkens.dev/blog/leveling-up-your-portfolio/)) | The "tour guide" idea, project detail pages, personal copy |
| [ShowProof: backend portfolio](https://showproof.io/guides/backend-developer-portfolio/) | Selling decisions and trade-offs instead of screenshots |
| [ShowProof: fullstack portfolio](https://showproof.io/guides/fullstack-developer-portfolio/) | The "senior in nothing" trap, lean, tiered skills |
| [FreeCodeCamp review of 50 portfolios](https://www.freecodecamp.org/news/i-reviewed-fifty-portfolios-on-reddit-and-this-is-what-i-learned-e5d2b43150bc/) | Accessibility failure rates, no percentage bars |
| [web.dev: Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds) | LCP / INP / CLS targets |
| [DEV.to: 40+ portfolio reviews](https://dev.to/kethmars/what-i-learned-after-reviewing-over-40-developer-portfolios-9-tips-for-a-better-portfolio-4me7) | Contact in header and footer, colour discipline |

One caution on a statistic you will see everywhere: the "6 to 7 second scan" comes from
[eye-tracking of **resumes**](https://www.wonsulting.com/job-search-hub/hidden-eye-tracker-how-recruiters-actually-read-resumes),
not portfolios. The portfolio figure that is actually supported is roughly
**3 minutes per portfolio** for candidates who get looked at. Do not over-index on
6 seconds; do make the page scannable, because the same sources agree people skim.

## Findings, and what this site does about each

**1. Structure: hero, work, about, contact.**
This site uses hero → selected work → how I work → about → contact. The extra section is
deliberate, see finding 3.

**2. The hero must land lean, stack and domain.**
"Fullstack developer" is the most common title in tech and by itself reads as junior in
two things (ShowProof). What works is a lean plus a stack plus a domain.
→ Hero now reads "Fullstack Engineer, backend depth — TypeScript, Node.js, NestJS",
with the domain ("education and back-office systems") directly underneath. Both come
from `role`, `lean` and `focus` in `content.js`.

**3. Backend work is invisible, so sell decisions and trade-offs.**
Screenshots cannot show a schema choice or an auth boundary. The recommended artefacts
are trade-off write-ups and architecture decisions: what you chose, what you rejected,
and why. "One ADR with thoughtful trade-offs outperforms ten generic READMEs."
→ Added the **How I work** section: three real trade-offs, each stating what was chosen,
why, and **what it cost**. The cost line is the one that reads as experience.
→ Each project also has a **case study** with the problem, your role, what you built,
the decisions, and what you would do differently.

**4. Two to five projects, one flagship taking most of the space.**
→ Five projects. ScholarOS is `featured: true` and gets the large card.

**5. Skills should be tiered by real depth.**
Flat lists of 40 technologies read as unfocused and invite questions you cannot answer.
Percentage bars ("85% React") are criticised by every source reviewed; nobody knows what
they mean.
→ Skills are now three honest tiers: Strongest, Comfortable, Currently deepening.
No percentages anywhere.

**6. Every project needs a live demo and source code.**
"Without any opportunity to inspect your code, you're making the reviewer's job
tougher." Both are required, not one.
→ **Still open.** No repo or live URLs are set yet. The case study buttons carry the
weight in the meantime, but this is the biggest remaining gap.

**7. Dead links are worse than no link.**
"Nothing kills excitement faster than clicking a demo link and getting a 404."
→ This site refuses to render a button whose destination is `#` or empty. The résumé
button is currently hidden for exactly this reason, and reappears the moment you set a
real `href`. Verified: zero dead links in the automated check.

**8. Accessibility is a differentiator, because most portfolios fail it.**
In a review of 50 portfolios: **40% had low contrast text**, **34% could not be
navigated with keyboard alone**.
→ Verified by measurement, not assumption: **zero WCAG AA contrast failures across 120
rendered text elements in both light and dark themes** (colours alpha-composited against
their real painted backgrounds, not read as raw hex), 22 interactive controls all with
accessible names and visible focus rings, no heading-level skips, no horizontal overflow
at 390 / 768 / 1200px, no empty-but-painted elements, no runtime or console errors. The
case-study dialog is a native modal: focus moves inside on open, cannot reach the page
behind, closes on Escape and on backdrop click, and returns focus to the button that
opened it.

Two real accessibility defects were found and fixed by this process, both invisible to
inspection:

1. The footer separator used `--line`, a **border** token, as text colour. Measured
   **1.35:1 in dark and 1.20:1 in light**, against a 4.5:1 requirement. Now uses
   `--muted` (7.78:1 dark, 5.69:1 light).
2. The standalone "Source code" project link rendered **23px tall**, one pixel under the
   24x24 minimum in WCAG 2.2 SC 2.5.8. Now 24px. (Inline links inside a sentence are
   exempt; that one was not inline.)

Also worth recording, because it nearly caused a false pass: the browser had cached a
**stale copy of `styles.css`** (95 rules served from cache against 163 in the file), and
one early theme measurement sampled colours **mid-transition**, producing a page of
impossible contrast failures. Both were measurement faults, not site faults, but they
show why each check needs a control and a settle step.

**9. Performance: LCP under 2.5s, CLS under 0.1, load under 3s.**
→ Measured on the local server with `Network.setCacheDisabled`, so these are cold-cache
numbers:

| Metric | Measured | Threshold |
| --- | --- | --- |
| LCP | **120ms** (browser cached), **788ms** cold | under 2500ms |
| FCP | 120ms | - |
| CLS | **0** | under 0.1 |
| TTFB | 9ms | - |
| Load event | 87ms | under 3s |

The LCP element was `H1.hero__title` in the warm run and `P.featured__blurb` in the cold
run, which is why the two figures differ. Both are far inside the threshold, so the
honest statement is "LCP 120-790ms", not a single cherry-picked number.

Four requests, 59.7KB transferred, 58.5KB decoded:

| File | Transfer | Decoded |
| --- | --- | --- |
| `index.html` | (in navigation) | 6.7KB |
| `styles.css` | 19.5KB | 19.3KB |
| `main.js` | 18.1KB | 17.8KB |
| `content.js` | 15.0KB | 14.7KB |

No framework, no build step and no webfont download are why this is fast. Note that
`content.js` is currently larger than `main.js`, because it holds all your copy; if it
keeps growing, split the per-project case studies into a separate file loaded on demand.

**10. Contact in both header and footer.**
→ Email link in the sticky header and in the footer, plus a copy-to-clipboard button.

**11. Keep design restrained: about 3 colours, 2 fonts.**
→ One accent colour, one text colour, one muted, one border, one typeface, one mono for
labels.

**12. Make it scannable.**
"If we scroll through and only read your 1-2 sentence captions, we should still
understand the project." Detail belongs behind the case study, not in the card.
→ Cards carry a one-sentence blurb plus tags. The depth is one click away.

**13. A third of traffic is mobile.**
→ Checked at 390px, 768px and 1200px width. No horizontal overflow at any of them.

**14. Should work without JavaScript, at least for the essentials.**
→ The name, role, positioning and email are static HTML, and there is a `<noscript>`
block with the essentials. The project details do need JavaScript.

## What the research recommends that this site still does not do

These need your input or are deliberately out of scope.

1. ~~**No links to repositories or live demos.**~~ **Done for one project.** The meeting-QR
   project now has both a live URL and a repository link, and it is the strongest evidence on
   the page that something shipped and is being used. The other four projects still have no
   public URL. Deploying one more (ScholarOS is the obvious candidate) remains the highest-value
   remaining fix.
2. ~~**No system diagram.**~~ **Done.** The flagship card now shows the core ScholarOS
   path from the Tauri desktop client through Rust and SQLite to NestJS and MongoDB.
3. **No metrics.** The backend guides are emphatic that before/after numbers matter,
   even as percentages ("reduced sync payload size by ~40%" is enough). You have to
   supply these from real work; inventing them would be worse than omitting them.
4. **No public writing.** A single write-up of the offline-first sync problem would be
   the highest-leverage addition, because it is shareable independently of this site.
5. **No custom domain.** Recommended as a credibility signal (yourname.dev).
6. **No GitHub or OSS activity to corroborate the stack claims.** Note the warning: if
   your GitHub language breakdown contradicts your listed stack, that mismatch is
   visible to anyone who checks.
7. **Never claim production experience you do not have.** The tiered skills section is
   deliberately worded to avoid this. Keep it honest as you apply for roles.
8. **The X link is still a placeholder.** LinkedIn and the résumé are now live. The site
   hides the remaining placeholder rather than rendering something that goes nowhere.

Also fixed, and worth knowing because it was visible to every visitor and invisible to
inspection: the toast was shown on **every page load** as an empty black pill sitting
over the "Selected work" heading. It was hidden only by `transform: translate(-50%, 130%)`,
but that percentage is relative to the toast's own height (about 22px), so it moved only
~29px against a 32px `bottom` offset and never actually left the screen. Now hidden with
`opacity` and `visibility` as well. This is the class of bug that only a visual check
catches, and it is why the automated check now fails on any empty element that still
paints.

Two more, found by checking the site the way the research says to check it:

3. **Placeholder profile URLs were rendering as live links.** `https://github.com/your-username`
   is not `"#"`, so the dead-link check passed it, but it 404s. LinkedIn's
   `your-username` resolves to a real 200 page that is not yours. Both are now caught by
   `isUnresolved()` in `main.js`, which also treats `example.com`, `tbd`, `todo` and
   `changeme` as unresolved, and the same guard covers project `live`/`code` URLs and the
   contact socials. This is why the hero currently shows only "Email me".
4. **The scroll-reveal animation could blank the whole page.** `.reveal` sets
   `opacity: 0` in CSS, and `main.js` adds `.is-in` from an `IntersectionObserver`. If the
   observer never delivers a callback, nothing ever becomes visible and the site renders
   as a single flat colour. Measured directly: a headless render of the page produced
   **1 distinct colour** before the fix and **704** after, and the `#contact` screenshot
   was a uniform block. There is now a timeout that reveals anything still hidden, so the
   worst case is a missing animation rather than a missing page. A purely cosmetic effect
   should never be able to hide all content.

## Re-running the checks

These are now a script instead of throwaway snippets: **`tools/audit.js`**. Paste the whole
file into the browser console on the page you want to check, then `await __audit.run()`. It
prints a pass/fail table and returns the full report. It has no dependencies, matching the
site. Run it in both themes and at 390 / 768 / 1200 / 1440px, and again with a case study open.

What each check actually looks at, so you could rebuild any of them:

- **Contrast**: for every element with its own text, walk up the ancestor chain compositing
  `backgroundColor` values, then compare the text colour against that real painted
  background. Do not compare raw hex values, and do not sample during a CSS transition;
  wait about 1.2s first. Thresholds are 3:1 for large text, 4.5:1 otherwise. If an ancestor
  paints a `background-image`, the audit reports the element as unmeasurable rather than
  guessing and passing it.
- **Target size**: every `a` and `button` should be at least 24x24 unless it sits inside a
  sentence, which WCAG exempts.
- **Accessible names**: every control needs `aria-label`, `aria-labelledby`, `title`, a
  `<label for>`, or text.
- **Heading continuity**: walk `h1`-`h6` in document order and flag any jump over a level.
- **Empty painted elements**: any element with no text, no children, and a visible background
  or border is a defect. This is the check that catches the toast bug, so do not exempt
  live regions from it. Deliberate decoration (the theme-toggle icon, the availability dot)
  must carry `aria-hidden="true"` and is reported in a separate "decorative" list, so the
  exemption is visible rather than silent.
- **Overflow**: `scrollWidth > clientWidth` at 390, 768 and 1200px, with the offending
  elements named.
- **Links**: flag anything empty, `"#"`, or containing a placeholder, plus any `#fragment`
  with no matching element on the page.
- **Console**: enable `Log` and `Runtime` domains *before* loading, then confirm capture
  works by emitting one deliberate error. An empty console is otherwise indistinguishable
  from broken capture. The audit checks runtime state; console capture is a browser-side step.
- **Performance**: register a `PerformanceObserver` for `largest-contentful-paint` via
  `Page.addScriptToEvaluateOnNewDocument` before navigating, or LCP comes back empty.

### Latest measured run

After adding the meeting-QR case study and the real GitHub links, at 1440px dark, 1440px
light, 390px, and with a case study open in light theme: **0 problems** in every run.
No contrast failures across 130-163 measured elements, no small targets, no unnamed
controls, no heading jumps, no empty painted elements, no unresolved links, no overflow.
The two `aria-hidden` shapes were reported as decorative, which is what should happen.
