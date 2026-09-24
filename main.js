/* ──────────────────────────────────────────────────────────
   Renders the page from window.PORTFOLIO (content.js).
   You shouldn't need to edit this file to update your content.
   ────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  const data = window.PORTFOLIO;
  const $ = (sel) => document.querySelector(sel);
  const root = document.documentElement;

  if (!data) {
    console.error("content.js did not load, so the page has no content.");
    return;
  }

  /* ── Small helpers ──────────────────────────────────────── */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function setText(sel, value) {
    const node = $(sel);
    if (node && value) node.textContent = value;
  }

  function initials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("");
  }

  const slug = (value) =>
    String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  /* Returns true when a link is not yet a real destination.
     Covers the obvious cases (empty, "#", javascript:) and the less obvious one:
     placeholder URLs such as https://github.com/your-username. Those are NOT
     "#", so an href check alone lets them through and the button ships pointing
     at a 404. Anything a visitor can click should either work or not exist. */
  const PLACEHOLDER = /your-username|yourname|username|example\.com|your-?domain|todo|tbd|changeme|xxx+/i;

  function isUnresolved(href) {
    if (!href) return true;
    const value = String(href).trim();
    if (value === "" || value === "#") return true;
    if (/^javascript:/i.test(value)) return true;
    return PLACEHOLDER.test(value);
  }

  /* ── Theme ──────────────────────────────────────────────── */
  const THEME_KEY = "portfolio-theme";

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const toggle = $("#themeToggle");
    if (toggle) toggle.setAttribute("aria-pressed", String(theme === "light"));
  }

  let stored = null;
  try {
    stored = localStorage.getItem(THEME_KEY);
  } catch (_) {
    /* private mode, ignore */
  }
  applyTheme(stored || systemTheme());

  $("#themeToggle").addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (_) {}
  });

  /* ── Head / identity ────────────────────────────────────── */
  document.title = `${data.name} — ${data.role}`;

  const brand = document.querySelector('[data-content="name"]');
  if (brand) brand.textContent = data.name;

  setText("#heroName", data.name);
  setText("#heroTagline", data.tagline);
  setText("#footerText", data.footer);

  // Positioning line: role + primary stack.
  const stackHint = (data.tiers?.[0]?.items || []).slice(0, 3).join(", ");
  setText(
    "#heroPositioning",
    [data.role, stackHint]
      .filter(Boolean)
      .join(" — ")
  );

  if (data.focus) setText("#heroFocus", `Focused on ${data.focus.toLowerCase()}.`);

  const availability = $("#availability");
  if (availability) {
    if (data.availableForWork) {
      setText(
        "#availabilityText",
        "Open to fullstack development roles"
      );
    } else {
      availability.classList.add("pill--idle");
      setText("#availabilityText", "Not currently available");
    }
  }

  const mailto = `mailto:${data.contact?.email || ""}`;
  const navEmail = $("#navEmail");
  if (navEmail) navEmail.href = "#contact";
  const footerEmail = $("#footerEmail");
  if (footerEmail && data.contact?.email) {
    footerEmail.href = mailto;
    footerEmail.textContent = data.contact.email;
  }

  /* ── Avatar ─────────────────────────────────────────────── */
  const avatar = $("#avatar");
  if (avatar) {
    if (data.avatar) {
      const img = el("img");
      img.src = data.avatar;
      img.alt = `${data.name} portrait`;
      img.addEventListener("error", () => {
        // Bad/removed file: fall back to initials instead of a broken image.
        avatar.textContent = initials(data.name);
      });
      avatar.appendChild(img);
      avatar.removeAttribute("aria-hidden");
    } else {
      avatar.textContent = initials(data.name);
    }
  }

  /* ── Hero links ─────────────────────────────────────────── */
  const heroLinks = $("#heroLinks");
  (data.links || []).forEach((link) => {
    // A button that goes nowhere is worse than no button at all. Skip anything
    // without a real destination yet (an unadded résumé, or a profile URL still
    // set to "your-username"), then it appears on its own once you add one.
    if (isUnresolved(link.href)) return;

    const a = el("a", "btn" + (link.primary ? " btn--primary" : ""), link.label);
    a.href = link.href;
    if (/^https?:/.test(link.href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", `${link.label} (opens in a new tab)`);
    }
    heroLinks.appendChild(a);
  });

  /* ── Case study dialog ──────────────────────────────────── */
  const dialog = $("#caseStudy");
  const dialogSupported = !!(dialog && typeof dialog.showModal === "function");
  const caseBody = $("#caseBody");
  const caseEyebrow = $("#caseEyebrow");
  let lastTrigger = null;

  function caseSection(title, text) {
    if (!text) return null;
    const wrap = el("section", "case__section");
    wrap.appendChild(el("h4", "case__heading", title));
    wrap.appendChild(el("p", "case__text", text));
    return wrap;
  }

  function caseList(title, items, ordered) {
    if (!items || !items.length) return null;
    const wrap = el("section", "case__section");
    wrap.appendChild(el("h4", "case__heading", title));
    const list = el(ordered ? "ol" : "ul", ordered ? "case__list case__list--num" : "case__list");
    items.forEach((item) => list.appendChild(el("li", null, item)));
    wrap.appendChild(list);
    return wrap;
  }

  function renderCaseStudy(project) {
    const cs = project.caseStudy || {};
    caseBody.textContent = "";

    const heading = el("h3", "case__title", project.title);
    heading.id = "caseTitle";
    caseBody.appendChild(heading);

    if (project.type || project.scope) {
      caseBody.appendChild(
        el("p", "case__meta", [project.type, project.scope].filter(Boolean).join(" · "))
      );
    }

    if (project.tags && project.tags.length) {
      const chips = el("div", "chips case__chips");
      project.tags.forEach((tag) => chips.appendChild(el("span", "chip", tag)));
      caseBody.appendChild(chips);
    }

    if (cs.summary) caseBody.appendChild(el("p", "case__summary", cs.summary));

    const sections = [
      caseSection("The problem", cs.problem),
      caseSection("My role", cs.role),
      caseList("What I built", cs.built, false),
      caseList("Decisions I made", cs.decisions, true),
      caseSection("What I'd do differently", cs.honest),
    ];
    sections.forEach((node) => node && caseBody.appendChild(node));

    const links = document.createElement("div");
    links.className = "case__links";
    if (!isUnresolved(project.live)) {
      const live = el("a", "btn", "Live site ↗");
      live.href = project.live;
      live.target = "_blank";
      live.rel = "noopener noreferrer";
      live.setAttribute("aria-label", `${project.title} live site (opens in a new tab)`);
      links.appendChild(live);
    }
    if (!isUnresolved(project.code)) {
      const code = el("a", "btn", "Source code ↗");
      code.href = project.code;
      code.target = "_blank";
      code.rel = "noopener noreferrer";
      code.setAttribute("aria-label", `${project.title} source code (opens in a new tab)`);
      links.appendChild(code);
    }
    if (links.children.length) caseBody.appendChild(links);
  }

  function showCase(project) {
    renderCaseStudy(project);
    if (caseEyebrow) {
      caseEyebrow.textContent = project.featured
        ? "Featured project"
        : "Case study";
    }
    if (!dialog.open) dialog.showModal();
    caseBody.scrollTop = 0;
  }

  function openCase(project, trigger) {
    if (!project.caseStudy || !dialogSupported) {
      // No dialog support: nothing to open.
      if (trigger) trigger.blur();
      return;
    }
    lastTrigger = trigger || document.activeElement || null;
    showCase(project);

    // pushState does NOT fire hashchange, so this cannot re-enter openCase.
    const target = `#case-${project.slug}`;
    if (location.hash !== target) {
      history.pushState({ case: project.slug }, "", target);
    }
  }

  function closeCase() {
    if (!dialogSupported || !dialog.open) return;
    dialog.close();
  }

  if (dialogSupported) {
    $("#caseClose").addEventListener("click", closeCase);

    // Click on the backdrop (outside the dialog box) closes it.
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeCase();
    });

    // Native Esc fires 'cancel' then 'close'. Clean up URL and focus here.
    dialog.addEventListener("close", () => {
      if (location.hash.startsWith("#case-")) {
        history.replaceState(null, "", location.pathname + location.search);
      }
      if (lastTrigger && document.contains(lastTrigger)) {
        lastTrigger.focus();
      }
      lastTrigger = null;
    });
  }

  /* ── Projects ───────────────────────────────────────────── */
  const projects = data.projects || [];

  function projectLinks(project, small) {
    const wrap = el("div", small ? "card__links" : "featured__links");
    if (!isUnresolved(project.live)) {
      const live = el("a", null, "Live site ↗");
      live.href = project.live;
      live.target = "_blank";
      live.rel = "noopener noreferrer";
      live.setAttribute("aria-label", `${project.title} live site (opens in a new tab)`);
      wrap.appendChild(live);
    }
    if (!isUnresolved(project.code)) {
      const code = el("a", null, "Source code ↗");
      code.href = project.code;
      code.target = "_blank";
      code.rel = "noopener noreferrer";
      code.setAttribute("aria-label", `${project.title} source code (opens in a new tab)`);
      wrap.appendChild(code);
    }
    return wrap;
  }

  function architectureDiagram(project) {
    if (!project.architecture || !project.architecture.length) return null;

    const figure = el("figure", "architecture");
    figure.setAttribute("aria-label", `${project.title} architecture at a glance`);
    figure.appendChild(el("figcaption", "architecture__label", "Architecture at a glance"));

    const flow = el("div", "architecture__flow");
    project.architecture.forEach((item, index) => {
      const node = el("div", "architecture__node");
      node.appendChild(el("strong", null, item.label));
      node.appendChild(el("span", null, item.detail));
      flow.appendChild(node);

      if (index < project.architecture.length - 1) {
        const arrow = el("span", "architecture__arrow", "→");
        arrow.setAttribute("aria-hidden", "true");
        flow.appendChild(arrow);
      }
    });
    figure.appendChild(flow);
    return figure;
  }

  function caseButton(project, className) {
    if (!project.caseStudy) return null;
    const btn = el("button", className || "btn btn--case", "Read the case study");
    btn.type = "button";
    btn.addEventListener("click", () => openCase(project, btn));
    return btn;
  }

  const featured = projects.find((p) => p.featured) || projects[0];

  if (featured) {
    const box = $("#featured");
    box.hidden = false;

    const body = el("div", "featured__body");
    body.appendChild(
      el("p", "featured__label", ["Featured project", featured.scope].filter(Boolean).join(" · "))
    );
    body.appendChild(el("h3", "featured__title", featured.title));
    body.appendChild(el("p", "featured__blurb", featured.blurb));

    if (featured.tags) {
      const chips = el("div", "chips");
      featured.tags.forEach((tag) => chips.appendChild(el("span", "chip", tag)));
      body.appendChild(chips);
    }

    const actions = el("div", "featured__actions");
    const openBtn = caseButton(featured, "btn btn--primary");
    if (openBtn) actions.appendChild(openBtn);
    const linkWrap = projectLinks(featured, false);
    if (linkWrap.children.length) actions.appendChild(linkWrap);
    if (actions.children.length) body.appendChild(actions);

    const preview = el("div", "featured__preview");
    const diagram = architectureDiagram(featured);
    if (diagram) {
      preview.appendChild(diagram);
    } else {
      preview.appendChild(
        el("span", "featured__placeholder", featured.live ? "View the live site" : "Screenshots on request")
      );
    }

    box.append(body, preview);
    box.classList.add("reveal");
  }

  const grid = $("#projectGrid");
  projects
    .filter((p) => p !== featured)
    .forEach((project) => {
      const card = el("article", "card reveal");
      if (project.type || project.scope) {
        card.appendChild(
          el("p", "card__meta", [project.type, project.scope].filter(Boolean).join(" · "))
        );
      }
      card.appendChild(el("h3", "card__title", project.title));
      card.appendChild(el("p", "card__blurb", project.blurb));

      if (project.tags) {
        const chips = el("div", "chips");
        project.tags.forEach((tag) => chips.appendChild(el("span", "chip", tag)));
        card.appendChild(chips);
      }

      const links = projectLinks(project, true);
      if (links.children.length) card.appendChild(links);

      const openBtn = caseButton(project, "card__case");
      if (openBtn) card.appendChild(openBtn);

      grid.appendChild(card);
    });

  /* ── How I work (trade-offs) ────────────────────────────── */
  const decisionList = $("#decisionList");
  (data.decisions || []).forEach((item) => {
    const card = el("article", "decision reveal");
    card.appendChild(el("h3", "decision__title", item.title));

    const rows = [
      ["I chose", item.chose],
      ["Because", item.why],
      ["What it cost", item.cost],
    ];
    rows.forEach(([label, value]) => {
      if (!value) return;
      const row = el("div", "decision__row");
      row.appendChild(el("dt", "decision__label", label));
      row.appendChild(el("dd", "decision__value", value));
      card.appendChild(row);
    });

    decisionList.appendChild(card);
  });

  // Remove the whole section if there is nothing to show.
  if (!decisionList.children.length) {
    const section = $("#decisions");
    if (section) section.remove();
  }

  /* ── About + tiers + timeline ───────────────────────────── */
  const prose = $("#aboutProse");
  (data.about || []).forEach((para) => prose.appendChild(el("p", null, para)));

  if (data.location) setText("#aboutLocation", `Based in ${data.location}`);

  const tiers = $("#tiers");
  (data.tiers || []).forEach((tier) => {
    const wrap = el("div", "tier");
    const head = el("div", "tier__head");
    head.appendChild(el("h4", "tier__level", tier.level));
    if (tier.note) head.appendChild(el("p", "tier__note", tier.note));
    wrap.appendChild(head);

    const chips = el("div", "chips");
    (tier.items || []).forEach((item) => chips.appendChild(el("span", "chip", item)));
    wrap.appendChild(chips);
    tiers.appendChild(wrap);
  });

  const timeline = $("#timeline");
  (data.timeline || []).forEach((item) => {
    const li = el("li");
    li.appendChild(el("div", "timeline__period", item.period));
    li.appendChild(el("div", "timeline__title", item.title));
    li.appendChild(el("div", "timeline__detail", item.detail));
    timeline.appendChild(li);
  });

  /* ── Contact ────────────────────────────────────────────── */
  const contact = data.contact || {};
  setText("#contactHeading", contact.heading);
  setText("#contactBlurb", contact.blurb);

  const socials = $("#contactSocials");
  (contact.socials || []).forEach((social) => {
    if (isUnresolved(social.href)) return;
    const a = el("a", null, social.label);
    a.href = social.href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", `${social.label} (opens in a new tab)`);
    socials.appendChild(a);
  });

  /* ── Copy email ─────────────────────────────────────────── */
  const toast = $("#toast");
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      // Fallback for non-secure contexts (file://) or blocked clipboard.
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (_) {}
      document.body.removeChild(area);
      return ok;
    }
  }

  $("#copyEmail").addEventListener("click", async () => {
    if (!contact.email) return;
    const ok = await copyText(contact.email);
    showToast(ok ? `Copied ${contact.email}` : `Email: ${contact.email}`);
  });

  /* ── Nav state + scroll progress ────────────────────────── */
  const nav = $("#nav");
  const progress = $("#navProgress");

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("is-stuck", y > 8);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${Math.min((y / max) * 100, 100)}%` : "0%";
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ── Deep links: /#case-scholaros opens that case study ─── */
  function projectFromHash() {
    const match = /^#case-(.+)$/.exec(location.hash);
    if (!match) return null;
    const wanted = match[1];
    const project = projects.find(
      (p) => p.slug === wanted || slug(p.title) === wanted
    );
    return project && project.caseStudy ? project : null;
  }

  function syncFromUrl() {
    if (!dialogSupported) return;
    const project = projectFromHash();
    if (project) {
      if (!dialog.open) showCase(project);
    } else if (dialog.open) {
      closeCase();
    }
  }

  // Back and forward buttons. Anchor navigation also fires this, which is
  // harmless: non-#case hashes just leave the dialog closed.
  window.addEventListener("popstate", syncFromUrl);
  window.addEventListener("hashchange", syncFromUrl);

  syncFromUrl();

  /* ── Scroll reveal ──────────────────────────────────────── */
  const reveals = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    reveals.forEach((node) => node.classList.add("is-in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  reveals.forEach((node) => observer.observe(node));

  /* Safety net. These elements start at opacity: 0 from CSS, so if the observer
     never delivers a callback the page renders completely blank. That is a
     severe failure mode for a purely cosmetic effect, and it is reachable: it
     happens in headless rendering, and it would happen for any observer
     misfire or long main-thread stall. Reveal anything still hidden shortly
     after load. The animation is a nicety; the content is the point. */
  const revealMissing = () => {
    reveals.forEach((node) => {
      if (!node.classList.contains("is-in")) node.classList.add("is-in");
    });
  };
  setTimeout(revealMissing, 1200);
  window.addEventListener("load", () => setTimeout(revealMissing, 300), {
    once: true,
  });
})();
