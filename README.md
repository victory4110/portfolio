# Portfolio

Victory Ogundipe's portfolio. Plain HTML, CSS and JavaScript, with no build step and no
dependencies. `RESEARCH.md` explains why the site is structured the way it is, with
sources.

## Run it

```bash
cd ~/Projects/portfolio
python3 -m http.server 4173
```

Then open http://127.0.0.1:4173. Opening `index.html` by double-clicking also works.

## Editing your content

**Everything you normally want to change lives in `content.js`.** You do not need to touch
the HTML, CSS or JavaScript for day-to-day updates.

| What you want to change | Where in `content.js` |
| --- | --- |
| Your name | `name` |
| Title, and which half you are strongest in | `role`, `lean` |
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

### The three names that matter most

`role`, `lean` and `focus` build your positioning line, which is the first thing anyone
reads:

> Fullstack Engineer, backend depth — TypeScript, Node.js, NestJS

The `lean` tells a hiring manager where to slot you, and `focus` tells them which problem
domain you understand. Both are doing real work. If you drop the lean, you read as a
generic fullstack developer, which is the most crowded title in the industry.

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
Aim for two to five projects in total; one flagship plus three supporting projects is
the pattern this site is built around.

### Links are never dead

Any `link` or project URL that is empty or `"#"` is skipped rather than rendered. A
button that goes nowhere is worse than no button. So the Résumé button is currently
hidden; set its `href` to `assets/resume.pdf` and it appears.

## Why there are no percentage skill bars

Repeatedly identified in the research as a mistake: nobody knows what "85% React" means,
and it invites an interview question you cannot win. See `RESEARCH.md`.

## Publishing it

**Netlify (drag and drop)**

1. Go to https://app.netlify.com/drop
2. Drag the whole `portfolio` folder onto the page

**GitHub Pages**

```bash
git add . && git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git push -u origin main
```

Then Settings → Pages → Source: `main` / root. Live at
`https://YOUR-USERNAME.github.io/portfolio/`.

After deploying, update the `og:` tags in `index.html` so link previews are correct, and
consider a custom domain (research recommends `yourname.dev`).

## Files

```
portfolio/
├── index.html    Structure and static fallback content
├── styles.css    All styling. Numbered sections at the top.
├── main.js       Renders content.js and runs the case-study dialog.
├── content.js    ← Your content. This is the file you edit.
├── RESEARCH.md   Why the site is built this way, with sources.
├── README.md     This file.
└── assets/       Photos and PDFs.
```

## Verified, not assumed

Checked by measurement in a real browser, in both themes and at 390 / 768 / 1200px:

- Zero WCAG AA contrast failures across 120 rendered text elements, in both themes,
  measured against real composited backgrounds
- 22 interactive controls, all with accessible names and visible focus rings, no heading skips
- No horizontal overflow at any tested width
- Case-study dialog: native modal, focus enters and cannot escape to the page behind,
  closes on Escape and backdrop click, returns focus to the trigger, and syncs with the URL
  so deep links and back/forward work
- Zero dead links, no empty-but-painted elements, no console or runtime errors
- LCP 120-790ms, FCP 120ms, CLS 0, 4 requests, 59.7KB transferred
- Still readable with JavaScript disabled

Four real defects this process caught and fixed: the footer separator was drawn in a
border colour (1.35:1 contrast, needs 4.5:1), a standalone project link was 23px tall
(needs 24px), the toast rendered as an empty black pill on every page load because
`translate(-50%, 130%)` is relative to its own 22px height rather than the screen, and the
scroll-reveal could blank the entire page if the animation's observer never fired.
Details in `RESEARCH.md`.

## Links that are not real yet are hidden

The site will not render a link to a destination you have not set. That covers empty
strings, `"#"`, and placeholders like `your-username`, `example.com` and `tbd`. So right
now the hero shows only "Email me", because the GitHub and LinkedIn entries in
`content.js` still point at `your-username`. Replace them with your real profile URLs and
the buttons appear on their own. The project cards have no buttons yet for the same
reason: every `live` and `code` field is still empty.
