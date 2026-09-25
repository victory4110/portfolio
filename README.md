# Portfolio

Victory Ogundipe's portfolio. Plain HTML, CSS and JavaScript, with no build step and no
dependencies. `RESEARCH.md` explains why the site is structured the way it is, with
sources.

## Run it

This folder lives at `~/Desktop/Workshops/portfolio`, alongside your other workshop
projects. It is its own git repository, so `Workshops/.gitignore` lists `portfolio/` to stop
the outer folder's repo from swallowing it.

```bash
cd ~/Desktop/Workshops/portfolio
python3 -m http.server 4173
```

Then open http://127.0.0.1:4173. Opening `index.html` by double-clicking also works.

## Editing your content

**Everything you normally want to change lives in `content.js`.** You do not need to touch
the HTML, CSS or JavaScript for day-to-day updates.

| What you want to change | Where in `content.js` |
| --- | --- |
| Your name | `name` |
| Professional title | `role` |
| The domain you specialise in | `focus` |
| The one-line pitch | `tagline` |
| Open-to-work badge | `availableForWork` |
| Bio paragraphs | `about` |
| Buttons under your name | `links` |
| Skills, by depth | `tiers` |
| Trade-offs and engineering decisions | `decisions` |
| Projects and case studies | `projects` |
| Work / study history | `timeline` |
| Contact block | `contact` |
| Footer line | `footer` |

After saving, refresh the browser tab.

### The positioning fields that matter most

`role` and `focus` build your positioning, which is the first thing anyone
reads:

> Fullstack Developer — TypeScript, Node.js, NestJS

The role states what you do, the strongest skill tier supplies the stack, and `focus`
shows the kinds of systems you understand.

### Skills are tiered, on purpose

`tiers` is an array of depth levels. Keep the wording honest: a flat list of everything
you have ever touched reads as unfocused, and claiming depth you do not have gets found
out in the technical interview. Add or rename tiers freely, but keep the honesty.

### Case studies

Each project can carry a `caseStudy`. It renders a "Read the case study" button that
opens a dialog, and each one gets a shareable link like `/#case-scholaros`.

Only two fields are required for a useful one: `problem` and `role`. The rest are
optional. The field that does the most work is `honest` ("What I'd do differently"),
because it reads as self-awareness rather than a sales pitch.

```js
caseStudy: {
  summary: "One paragraph framing the project.",
  problem: "What needed to exist, and why.",
  role: "Specifically what you did. Not 'we'.",
  built: ["Concrete things you built"],
  decisions: ["Trade-offs you made, as an ordered list"],
  honest: "What is missing, or what you would do differently.",
}
```

### Adding a project

```js
{
  title: "Project name",
  slug: "short-name",          // becomes /#case-short-name
  blurb: "One scannable sentence. Detail belongs in the case study.",
  tags: ["NestJS", "MongoDB"],
  live: "",                    // leave "" to hide the button
  code: "",                    // leave "" to hide the button
  featured: false,
  caseStudy: { /* see above */ },
}
```

Exactly one project should have `featured: true`. It gets the large card at the top.
Aim for two to five projects in total; one flagship plus supporting projects is
the pattern this site is built around.

### Links are never dead

Any `link` or project URL that is empty, `"#"`, or still contains a placeholder
(`your-username`, `example.com`, `tbd`, `todo`, `changeme`) is skipped rather than rendered. A
button that goes nowhere is worse than no button.

Live now: the hero shows **Email me**, **GitHub**, **LinkedIn**, and **Résumé (PDF)**. The DHave Gadgetz,
meeting QR, and portfolio project cards carry public links. Private collaboration projects
do not show dead or inaccessible source buttons.

Still hidden because the destination is not real:

| Entry | What it needs |
| --- | --- |
| ScholarOS `live` / `code` | a deployed URL and/or a public repo |
| Poolot admin dashboard `live` / `code` | a deployed URL and/or a public repo (may never be public) |

Set any of those and the button appears on its own. Nothing else to change. A project with
no real destination simply shows no buttons rather than a dead one.

## Checking your work

`tools/audit.js` is the checks from `RESEARCH.md` as something you can actually run. It has
no dependencies. Open the site, paste the whole file into the browser console, then:

```js
await __audit.run()
```

It prints a pass/fail table and returns the full report. Run it in **both themes** and at
**390 / 768 / 1200px**, then switch the theme and run again. It reports the theme and
viewport it measured, so a run is never ambiguous.

What it checks: WCAG AA contrast against real composited backgrounds, 24px target sizes,
accessible names, heading continuity, elements that paint but have no content, unresolved
and dead links, and horizontal overflow. An element that deliberately holds a shape (the
theme toggle icon, the availability dot) must say `aria-hidden="true"`, and is listed as
decorative rather than counted as a defect.

## Publishing it

Primary deployment: **https://victory-ogundipe-portfolio.vercel.app/**, connected to the GitHub repository. GitHub Pages remains available as a fallback. To push a
change:

```bash
git add . && git commit -m "What changed" && git push
```

Pages rebuilds itself in about a minute.

Netlify works as an alternative, drag-and-drop at https://app.netlify.com/drop.

For a custom domain (research recommends `yourname.dev`): add a `CNAME` file containing the
domain, point a `CNAME` DNS record at `victory4110.github.io`, then enable HTTPS in
Settings → Pages.

## Why there are no percentage skill bars

Repeatedly identified in the research as a mistake: nobody knows what "85% React" means,
and it invites an interview question you cannot win. See `RESEARCH.md`.

## Files

```
portfolio/
├── index.html    Structure and static fallback content
├── styles.css    All styling. Numbered sections at the top.
├── main.js       Renders content.js and runs the case-study dialog.
├── content.js    ← Your content. This is the file you edit.
├── RESEARCH.md   Why the site is built this way, with sources.
├── README.md     This file.
├── tools/        audit.js — the checks, runnable in the browser console.
└── assets/       Photos and PDFs.
```

## Verified, not assumed

Re-run with `tools/audit.js` after today's content changes. Checked by measurement in a real
browser, in both themes and at 390 / 768 / 1200 / 1440px:

- Zero WCAG AA contrast failures across 130-134 rendered text elements per width, in both
  themes, measured against real composited backgrounds (163 elements with a case study open)
- 22 interactive controls, all with accessible names and visible focus rings, no heading skips
- No horizontal overflow at any tested width
- No unresolved or dead links; every external URL resolves
- No element paints without content
- Case-study dialog: native modal, focus enters and cannot escape to the page behind, opens
  from a deep link, closes on Escape and backdrop click, returns focus to the trigger, and
  syncs with the URL so back/forward work
- Zero console or runtime errors
- LCP 120-790ms, FCP 120ms, CLS 0, 4 requests, 59.7KB transferred
- Still readable with JavaScript disabled

Four real defects this process caught and fixed: the footer separator was drawn in a
border colour (1.35:1 contrast, needs 4.5:1), a standalone project link was 23px tall
(needs 24px), the toast rendered as an empty black pill on every page load because
`translate(-50%, 130%)` is relative to its own 22px height rather than the screen, and the
scroll-reveal could blank the entire page if the animation's observer never fired.
Details in `RESEARCH.md`.
