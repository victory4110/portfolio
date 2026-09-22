/**
 * Portfolio audit — the checks described in RESEARCH.md, as a runnable script.
 *
 * No dependencies and no build step, to match the site itself. Paste this whole
 * file into the browser console on the page you want to check, then run:
 *
 *   await __audit.run()
 *
 * It returns a report object and prints a readable summary. `run()` waits for
 * transitions to settle before measuring, because colours mid-transition are
 * not the colours anyone sees.
 *
 * For viewport checks, run it once per width (390, 768, 1200). It reports the
 * width it measured at, so you cannot mistake which run was which.
 */
(() => {
  "use strict";

  const LAYOUT_SETTLE_MS = 1200;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ── Colour helpers ─────────────────────────────────────── */

  function parseColor(value) {
    const m = String(value).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    const [r, g, b] = parts;
    const a = parts.length > 3 ? parts[3] : 1;
    if ([r, g, b].some((n) => !Number.isFinite(n))) return null;
    return { r, g, b, a };
  }

  function over(top, bottom) {
    const a = top.a + bottom.a * (1 - top.a);
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    const mix = (t, b) => (t * top.a + b * bottom.a * (1 - top.a)) / a;
    return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a };
  }

  function luminance({ r, g, b }) {
    const channel = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  }

  function contrast(fg, bg) {
    const l1 = luminance(fg);
    const l2 = luminance(bg);
    const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
    return (hi + 0.05) / (lo + 0.05);
  }

  /** Composite the real painted background behind an element. */
  function paintedBackground(node, root) {
    let acc = { r: 255, g: 255, b: 255, a: 0 };
    const stack = [];
    for (let n = node; n && n.nodeType === 1; n = n.parentElement) {
      stack.push(n);
      if (n === root) break;
    }
    stack.push(document.documentElement);
    if (document.body && !stack.includes(document.body)) stack.push(document.body);

    let opaque = null;
    let hasImage = false;
    for (const n of stack) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== "none") hasImage = true;
      const c = parseColor(cs.backgroundColor);
      if (!c || c.a === 0) continue;
      opaque = opaque ? over(opaque, c) : c;
      if (opaque.a >= 0.999) break;
    }
    // Fall back to the canvas colour so an unpainted page is not scored as transparent.
    if (!opaque || opaque.a < 0.999) {
      const base = parseColor(getComputedStyle(document.documentElement).backgroundColor)
        || parseColor(getComputedStyle(document.body || document.documentElement).backgroundColor)
        || { r: 255, g: 255, b: 255, a: 1 };
      opaque = opaque ? over(opaque, base) : base;
    }
    acc = opaque;
    return { color: acc, hasImage };
  }

  function isVisible(el) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    if (Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    return true;
  }

  function hasOwnText(el) {
    return [...el.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim().length > 0
    );
  }

  /* ── The checks ─────────────────────────────────────────── */

  function checkContrast() {
    const failures = [];
    let measured = 0;
    let unmeasurable = 0;

    const all = document.querySelectorAll("body *");
    for (const el of all) {
      if (!hasOwnText(el) || !isVisible(el)) continue;
      const cs = getComputedStyle(el);
      const fg = parseColor(cs.color);
      if (!fg) continue;

      const size = parseFloat(cs.fontSize);
      const weight = Number(cs.fontWeight) || 400;
      const isLarge = size >= 24 || (size >= 18.66 && weight >= 700);
      const required = isLarge ? 3 : 4.5;

      const bgInfo = paintedBackground(el, document.body);
      if (bgInfo.hasImage) {
        unmeasurable++;
        continue;
      }
      const fgComposited = fg.a < 1 ? over(fg, bgInfo.color) : fg;
      const ratio = contrast(fgComposited, bgInfo.color);
      measured++;

      if (ratio < required) {
        failures.push({
          selector: selectorFor(el),
          text: el.textContent.trim().slice(0, 60),
          ratio: Number(ratio.toFixed(2)),
          required,
          fontSize: size,
          weight,
          fg: cs.color,
          bg: `rgb(${Math.round(bgInfo.color.r)}, ${Math.round(bgInfo.color.g)}, ${Math.round(bgInfo.color.b)})`,
        });
      }
    }
    return { measured, unmeasurable, failures };
  }

  function selectorFor(el) {
    if (el.id) return `#${el.id}`;
    const cls = (el.className && typeof el.className === "string")
      ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
      : "";
    return el.tagName.toLowerCase() + cls;
  }

  /** WCAG exempts a target that sits inside a sentence. */
  function insideSentence(el) {
    const parent = el.parentElement;
    if (!parent) return false;
    if (!/^(P|LI|SPAN|EM|STRONG|SMALL|FOOTER)$/.test(parent.tagName)) return false;
    const text = parent.textContent.trim();
    return text.length > el.textContent.trim().length;
  }

  function checkTargets() {
    const failures = [];
    const controls = document.querySelectorAll("a[href], button, [role='button'], input, select, textarea");
    for (const el of controls) {
      if (!isVisible(el)) continue;
      const r = el.getBoundingClientRect();
      const exempt = el.tagName === "A" && insideSentence(el);
      if (exempt) continue;
      if (r.height < 24 || r.width < 24) {
        failures.push({
          selector: selectorFor(el),
          text: el.textContent.trim().slice(0, 40),
          size: `${Math.round(r.width)}x${Math.round(r.height)}`,
        });
      }
    }
    return { checked: controls.length, failures };
  }

  function accessibleName(el) {
    const aria = el.getAttribute("aria-label");
    if (aria && aria.trim()) return aria.trim();
    const labelledBy = el.getAttribute("aria-labelledby");
    if (labelledBy) {
      const target = document.getElementById(labelledBy);
      if (target && target.textContent.trim()) return target.textContent.trim();
    }
    if (el.id) {
      const label = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (label && label.textContent.trim()) return label.textContent.trim();
    }
    const title = el.getAttribute("title");
    if (title && title.trim()) return title.trim();
    const value = el.getAttribute("value");
    if (el.tagName === "INPUT" && value) return value;
    const text = el.textContent.trim();
    if (text) return text;
    const img = el.querySelector("img[alt]");
    if (img && img.getAttribute("alt").trim()) return img.getAttribute("alt").trim();
    return "";
  }

  function checkNames() {
    const failures = [];
    const controls = document.querySelectorAll("a[href], button, [role='button'], input, select, textarea");
    for (const el of controls) {
      if (!isVisible(el)) continue;
      if (!accessibleName(el)) {
        failures.push({ selector: selectorFor(el), tag: el.tagName });
      }
    }
    return { checked: controls.length, failures };
  }

  function checkHeadings() {
    const headings = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")]
      .filter(isVisible)
      .map((h) => ({ level: Number(h.tagName[1]), text: h.textContent.trim().slice(0, 50) }));
    const jumps = [];
    for (let i = 1; i < headings.length; i++) {
      if (headings[i].level - headings[i - 1].level > 1) {
        jumps.push({
          from: `h${headings[i - 1].level} "${headings[i - 1].text}"`,
          to: `h${headings[i].level} "${headings[i].text}"`,
        });
      }
    }
    const h1s = headings.filter((h) => h.level === 1).length;
    return { count: headings.length, h1Count: h1s, jumps };
  }

  /**
   * Any element that paints a background or border but has no text and no
   * element children is an invisible-in-inspection defect. This is the check
   * that caught the toast rendering as an empty black pill on every load.
   *
   * Deliberate decoration may hold a shape, but it must say so with
   * `aria-hidden="true"`. Those are reported separately rather than dropped,
   * so nothing is silently exempted.
   */
  function checkEmptyPainted() {
    const failures = [];
    const decorative = [];
    for (const el of document.querySelectorAll("body *")) {
      if (["SCRIPT", "STYLE", "LINK", "META", "BR", "HR", "IMG", "SVG", "PATH", "CANVAS", "VIDEO", "IFRAME"].includes(el.tagName)) continue;
      if (!isVisible(el)) continue;
      const text = el.textContent.trim();
      if (text) continue;
      const elementChildren = [...el.children].filter((c) => !["SVG", "PATH"].includes(c.tagName));
      if (elementChildren.length) continue;
      const cs = getComputedStyle(el);
      const bg = parseColor(cs.backgroundColor);
      const paints = (bg && bg.a > 0) || (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== "none");
      if (paints) {
        const r = el.getBoundingClientRect();
        const entry = {
          selector: selectorFor(el),
          size: `${Math.round(r.width)}x${Math.round(r.height)}`,
          bg: cs.backgroundColor,
        };
        if (el.getAttribute("aria-hidden") === "true") {
          decorative.push({ ...entry, note: "declared decorative" });
        } else {
          failures.push({ ...entry, note: "paints but has no text or child content, and is not marked decorative" });
        }
      }
    }
    return { failures, decorative };
  }

  function checkLinks() {
    const unresolved = [];
    const brokenFragments = [];
    const PLACEHOLDER = /your-username|your-name|example\.com|\btbd\b|\btodo\b|changeme/i;

    for (const a of document.querySelectorAll("a[href]")) {
      const raw = a.getAttribute("href").trim();
      const label = a.textContent.trim().slice(0, 40);
      if (raw === "" || PLACEHOLDER.test(raw) || /^javascript:/i.test(raw)) {
        unresolved.push({ href: raw, label });
        continue;
      }
      if (raw.startsWith("#") && raw.length > 1) {
        if (!document.getElementById(raw.slice(1))) {
          brokenFragments.push({ href: raw, label });
        }
      }
    }
    const external = [...document.querySelectorAll("a[href^='http']")]
      .map((a) => a.getAttribute("href"));
    return {
      total: document.querySelectorAll("a[href]").length,
      unresolved,
      brokenFragments,
      external: [...new Set(external)],
    };
  }

  function checkOverflow() {
    const de = document.documentElement;
    const overflowing = [];
    if (de.scrollWidth > de.clientWidth + 1) {
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.right > de.clientWidth + 1 && r.width > 0) {
          overflowing.push({ selector: selectorFor(el), right: Math.round(r.right) });
        }
      }
    }
    return {
      viewport: `${de.clientWidth}x${de.clientHeight}`,
      scrollWidth: de.scrollWidth,
      clientWidth: de.clientWidth,
      hasOverflow: de.scrollWidth > de.clientWidth + 1,
      culprits: overflowing.slice(0, 10),
    };
  }

  function checkStage() {
    const toast = document.getElementById("toast");
    const revealHidden = [...document.querySelectorAll(".reveal")]
      .filter((el) => !el.classList.contains("is-in") && isVisible(el));
    return {
      toastText: toast ? toast.textContent.trim() : null,
      toastVisible: toast ? isVisible(toast) : null,
      stillRevealHidden: revealHidden.length,
    };
  }

  function checkTheme() {
    return {
      theme: document.documentElement.dataset.theme,
      prefersLight: window.matchMedia("(prefers-color-scheme: light)").matches,
    };
  }

  async function run({ settle = LAYOUT_SETTLE_MS } = {}) {
    await sleep(settle);
    const report = {
      url: location.href,
      when: new Date().toISOString(),
      theme: checkTheme(),
      contrast: checkContrast(),
      targets: checkTargets(),
      names: checkNames(),
      headings: checkHeadings(),
      emptyPainted: checkEmptyPainted(),
      links: checkLinks(),
      overflow: checkOverflow(),
      stage: checkStage(),
    };

    const problems =
      report.contrast.failures.length +
      report.targets.failures.length +
      report.names.failures.length +
      report.headings.jumps.length +
      report.emptyPainted.failures.length +
      report.links.unresolved.length +
      report.links.brokenFragments.length +
      (report.overflow.hasOverflow ? 1 : 0);

    report.summary = {
      problems,
      pass: problems === 0 && report.headings.h1Count === 1,
      details: {
        contrastFailures: report.contrast.failures.length,
        contrastMeasured: report.contrast.measured,
        smallTargets: report.targets.failures.length,
        unnamedControls: report.names.failures.length,
        headingJumps: report.headings.jumps.length,
        emptyPainted: report.emptyPainted.failures.length,
        decorativeShapes: report.emptyPainted.decorative.length,
        unresolvedLinks: report.links.unresolved.length,
        brokenFragments: report.links.brokenFragments.length,
        overflow: report.overflow.hasOverflow,
      },
    };

    console.group(`%cPortfolio audit — ${report.summary.pass ? "PASS" : "FAIL"}`,
      `font-weight:bold;color:${report.summary.pass ? "#15803d" : "#b91c1c"}`);
    console.log(`theme: ${report.theme.theme}   viewport: ${report.overflow.viewport}`);
    console.table(report.summary.details);
    if (report.contrast.failures.length) console.table(report.contrast.failures);
    if (report.targets.failures.length) console.table(report.targets.failures);
    if (report.emptyPainted.failures.length) console.table(report.emptyPainted.failures);
    if (report.headings.jumps.length) console.table(report.headings.jumps);
    if (report.links.unresolved.length) console.table(report.links.unresolved);
    if (report.links.brokenFragments.length) console.table(report.links.brokenFragments);
    console.groupEnd();

    return report;
  }

  window.__audit = {
    run,
    checks: {
      checkContrast,
      checkTargets,
      checkNames,
      checkHeadings,
      checkEmptyPainted,
      checkLinks,
      checkOverflow,
      checkStage,
      checkTheme,
    },
  };
  return "Portfolio audit loaded. Run: await __audit.run()";
})();
