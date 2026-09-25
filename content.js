/**
 * ─────────────────────────────────────────────────────────────
 *  THIS IS THE ONLY FILE YOU NEED TO EDIT FOR NORMAL UPDATES.
 *  Change the text between the quotes, save, refresh the page.
 *
 *  Positioning (read this once, then it will make sense):
 *  Keep the role, primary stack and product domain visible.
 * ─────────────────────────────────────────────────────────────
 */

window.PORTFOLIO = {
  /* ── Identity ─────────────────────────────────────────── */
  name: "Victory Ogundipe",
  role: "Full-Stack Developer",
  // The domain you go deep in. This is what makes you specific
  // instead of "another fullstack dev". Change it if the truth changes.
  focus: "Education & back-office systems",
  tagline:
    "I build complete digital products across frontend and backend development, from responsive interfaces and API design to databases, desktop applications, and deployment. I work with TypeScript, Node.js, React, Next.js, NestJS, MongoDB, and Rust to create practical systems that are reliable, maintainable, and easy to use.",
  location: "Ogbomoso, Oyo State, Nigeria",
  // Drop a photo at assets/avatar.jpg and it appears automatically.
  // Leave as "" to show your initials instead.
  avatar: "assets/avatar.jpg",
  availableForWork: true,

  /* ── Short bio (2–3 sentences is plenty) ──────────────── */
  about: [
    "I'm a fullstack engineer working mainly in TypeScript, with my depth on the backend. That means NestJS services, MongoDB and Mongoose schemas, multi-tenant data scoping, and auth built around JWT and role-based access control. On the frontend I build the React and Next.js interfaces that talk to those APIs.",
    "I also write Rust: the on-site apps in my school platform are Tauri desktop clients with a Rust backend on SQLite, an async sync loop, and mDNS service discovery so they can find a server on the local network. Most of what I've built has been for schools and back-office teams, where the interesting problems are not visual. Offline-first data sync, keeping one tenant's records away from another's, and making installs survive flaky internet are the parts I actually enjoy.",
  ],

  /* ── Buttons under your name ──────────────────────────── */
  links: [
    { label: "View selected work", href: "#work", primary: true },
    { label: "Email me", href: "mailto:victoryogundipe4110@gmail.com" },
    { label: "GitHub", href: "https://github.com/victory4110" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ogundipe-victory-708875337" },
  ],

  /* ── Skills: TIERED by real depth, not a flat list ──────
   *  A flat list of 40 technologies reads as unfocused and
   *  invites interview questions you cannot answer. Tiers read
   *  as self-aware. Be honest per item, it costs nothing and
   *  protects you in interviews.
   *  ──────────────────────────────────────────────────── */
  tiers: [
    {
      level: "Strongest",
      note: "I have shipped working projects with these and can debug them without a tutorial.",
      items: ["TypeScript", "Node.js", "Rust", "NestJS", "MongoDB"],
    },
    {
      level: "Comfortable",
      note: "Used in real projects. Productive, still learning the sharp edges.",
      items: [
        "Tauri desktop applications",
        "SQLite / rusqlite",
        "JWT & RBAC",
        "Zod validation",
        "Jest & Supertest",
        "REST API design",
        "Mongoose",
        "React & Next.js",
        "Tailwind CSS",
        "TanStack Query",
        "Turborepo & npm workspaces",
        "AWS S3",
        "Nodemailer",
      ],
    },
    {
      level: "Currently deepening",
      note: "Where I am actively putting time right now.",
      items: ["System design", "Automated testing", "Docker"],
    },
  ],

  /* ── How I work: the trade-offs behind the code ─────────
   *  For backend work this matters more than any screenshot.
   *  Each entry should say what you chose, what you gave up,
   *  and why. "What it costs" is the part that reads as senior.
   *  ──────────────────────────────────────────────────── */
  decisions: [
    {
      title: "Rust for the on-site client, TypeScript for the server",
      chose:
        "Tauri and Rust own local storage, background sync and LAN discovery. The central API stays in NestJS and MongoDB.",
      why: "School installs must keep working offline, while the central service benefits from the backend stack I use most productively.",
      cost:
        "Rust structs, JSON payloads and Mongoose schemas must stay aligned across two languages and two data models.",
    },
    {
      title: "Offline-first sync instead of a cloud-only API",
      chose:
        "Each school works against local storage and synchronizes with a central API when connectivity returns.",
      why: "Schools lose connectivity during the day. If the register cannot be taken when the internet drops, the software is useless there.",
      cost:
        "The sync layer has to handle retries and duplicate suppression. Records carry a local ID so a dropped connection does not create a second copy.",
    },
    {
      title: "Tenant credentials in headers for machine sync, JWT for humans",
      chose:
        "Server-to-server sync authenticates with a per-school id and secret header pair. Interactive users get JWT sessions with role checks.",
      why: "A scheduled sync job has no user to log in, so a session-based flow does not fit it.",
      cost:
        "There are two authentication paths to secure and maintain, although machine credentials can be rotated without affecting user accounts.",
    },
  ],

  /* ── Projects ───────────────────────────────────────────
   *  featured: true  → shown as the big card at the top
   *  Exactly one project should be featured.
   *  A `caseStudy` adds a "Read the case study" button that
   *  opens a detailed panel. This is what turns a card into
   *  something a hiring manager can actually evaluate.
   *  ──────────────────────────────────────────────────── */
  projects: [
    {
      title: "ScholarOS — offline-first school platform",
      slug: "scholaros",
      blurb:
        "A school platform where the on-site apps are Tauri desktop clients backed by Rust and SQLite, syncing to a NestJS and MongoDB central API with per-school tenant isolation.",
      tags: ["Rust", "Tauri", "SQLite", "NestJS", "MongoDB", "Multi-tenant"],
      live: "",
      code: "",
      featured: true,
      type: "Offline-first platform",
      scope: "End-to-end engineering",
      architecture: [
        { label: "Desktop UI", detail: "Tauri client" },
        { label: "Local core", detail: "Rust + SQLite" },
        { label: "Sync API", detail: "NestJS" },
        { label: "Central data", detail: "MongoDB" },
      ],
      caseStudy: {
        summary:
          "School management software is usually sold as a cloud app, which assumes the school always has internet. ScholarOS instead assumes it usually does not. Each install runs locally and syncs up when it can.",
        problem:
          "Schools need to keep working through outages, and their records contain other people's data, so one school must never be able to read another's. The system also had to be installable by non-technical staff on a local network.",
        role:
          "I built both sides. On the client that is the Rust backend of the Tauri desktop apps: the SQLite schema and data layer, the async sync loop, mDNS discovery, and the IPC commands the UI calls. On the server that is the NestJS service modules, the Mongoose schemas and indexing, and the tenant checks on every sync route.",
        built: [
          "Rust data layer on SQLite (rusqlite, bundled) holding the local tables, with a synced flag per row driving what gets pushed",
          "Async sync loop in Rust on tokio: a push cycle local to cloud, then a pull cycle cloud to local, on a timer",
          "mDNS service discovery so a client finds the server on the LAN without being told an IP address",
          "NestJS sync endpoints that accept batched pushes from an install",
          "Per-tenant scoping using a school id and secret, validated on every request",
          "Mongoose schemas for schools, transactions and results, with unique indexes on school id and access key",
          "A live monitor page showing connected clients and recent sync activity",
        ],
        decisions: [
          "Records carry their origin's local id, so a retry after a dropped connection updates the same row instead of creating a duplicate.",
          "The client owns durable local storage rather than caching in the UI layer, because an install can be killed mid-write and must come back consistent.",
          "Lazy database connection with a short timeout on the server, so the service boots on a site where the database is not up yet.",
          "Kept sync auth separate from user auth, because a scheduled job has no user to log into.",
        ],
        honest:
          "Automated test coverage is thin. Beyond the default spec files, most of this was verified by hand against a real local install. If I rebuilt it now, the sync path is where I would start with integration tests, because that is the part where a silent bug corrupts records.",
      },
    },
    {
      title: "Poolot admin dashboard",
      slug: "poolot",
      blurb:
        "A back-office dashboard where what you can see and do depends on your role, backed by MongoDB, S3 uploads and transactional email.",
      tags: ["Next.js", "MongoDB", "RBAC", "Zod"],
      live: "",
      code: "",
      type: "Internal operations",
      scope: "Full-stack development",
      caseStudy: {
        summary:
          "An internal admin tool for a team that needed different people to have different levels of access to the same data.",
        problem:
          "Admin tools tend to start open and get bolted shut later. This one had to be built with permissions as a first-class concern, including for the accounting data.",
        role:
          "I work across the frontend and backend, building admin dashboard interfaces, student-management workflows, payment and transaction integrations, accounting tools, and operational features.",
        built: [
          "Role-based access control seeded through provisioning scripts rather than clicked in by hand",
          "Session handling signed with jose, and request validation with Zod on the way in",
          "MongoDB-backed user and accounting data",
          "File uploads to S3 and transactional email through Nodemailer",
        ],
        decisions: [
          "Seeded roles from scripts so a new environment comes up with identical permissions, instead of relying on someone remembering to set them.",
          "Validated every request body with Zod at the boundary, so bad data fails at the edge rather than halfway through a write.",
        ],
        honest:
          "The permission model is enforced on the server, but I would add explicit tests that a lower role is actually rejected, rather than trusting the guard in code review.",
      },
    },
    {
      title: "DHave Gadgetz payment QR",
      slug: "dhave-gadgetz-qr",
      blurb:
        "A client payment utility where scanning a QR code opens a mobile-friendly page with verified bank details and a one-tap account-number copy action.",
      tags: ["Node.js", "Express", "MongoDB", "QR Code"],
      live: "https://dhave-gadgetz-qr.vercel.app",
      code: "https://github.com/victory4110/dhave-gadgetz-qr",
      type: "Client payment utility",
      scope: "End-to-end engineering",
      caseStudy: {
        summary:
          "I built this for a retail client to make bank-transfer details quick to access and easy to copy from a customer's phone.",
        problem:
          "Customers needed a reliable way to retrieve the correct account details during a transaction without the business repeatedly typing or sending them manually.",
        role:
          "I built the QR flow, backend API, account-data model, and responsive account-details page.",
        built: [
          "Permanent QR generation linked to the client's payment-information page",
          "Express API for retrieving the correct account details",
          "MongoDB account storage and update flow",
          "Mobile-friendly profile page with a one-tap copy action",
        ],
        decisions: [
          "Kept the QR destination stable so the printed code remains useful while the account information can be managed behind it.",
          "Added a dedicated copy action to reduce typing mistakes during bank transfers.",
        ],
        honest:
          "The current version focuses on making manual transfers easier; it does not independently confirm that a bank transfer has completed.",
      },
    },
    {
      title: "One QR code that never needs reprinting",
      slug: "meeting-qr",
      blurb:
        "A permanent QR code for meeting registration. It points at a page I control, and that page holds the form link that changes, so the printed code keeps working.",
      tags: ["JavaScript", "GitHub Pages", "Node.js", "Testing"],
      live: "https://victory4110.github.io/meeting/",
      code: "https://github.com/victory4110/meeting",
      type: "Production utility",
      scope: "End-to-end engineering",
      caseStudy: {
        summary:
          "A QR code is just a picture of a URL, so once it is printed it cannot be edited. This moves the part that changes behind the part that does not.",
        problem:
          "Every meeting had a new registration form, which meant a new QR code and a new printed poster each time.",
        role:
          "Everything: the redirect page, the QR generation and verification scripts, the printable poster, and the tests.",
        built: [
          "A static redirect page where the current form link lives in one config line",
          "A generator that writes the QR as both a 2048px PNG and a vector SVG",
          "A verification script that decodes the generated PNG and asserts it resolves to the deployed URL",
          "An end-to-end test that loads the page in jsdom and checks the redirect target and the tap-through fallback button",
        ],
        decisions: [
          "The QR points at a page I control rather than the form itself, because the printed code is the one artefact that cannot be corrected later.",
          "The test decodes the actual generated image instead of trusting the generator, since a wrong QR is not obvious until someone scans it in a room.",
        ],
        honest:
          "There is no analytics, so the only signal that it worked is someone telling me. The tests cover the page and the decoded image, not how the poster prints.",
      },
    },
    {
      title: "This portfolio site",
      slug: "portfolio",
      blurb:
        "Hand-built with no framework and no build step, designed to still work when JavaScript does not.",
      tags: ["HTML", "CSS", "JavaScript", "Accessibility"],
      live: "https://victory4110.github.io/portfolio/",
      code: "https://github.com/victory4110/portfolio",
      type: "Personal platform",
      scope: "Design & frontend",
      caseStudy: {
        summary:
          "I built this without a framework on purpose, so the fundamentals are visible rather than hidden behind a build tool.",
        problem:
          "Most developer portfolios are a template with the text swapped. I wanted one where I could explain every decision on the page.",
        role: "Everything: design, markup, styles and behaviour.",
        built: [
          "All content in one editable data file, so updating the site never means touching markup",
          "Light and dark themes that persist and follow the operating system by default",
          "Static fallback content so the page still makes sense with JavaScript disabled",
        ],
        decisions: [
          "No framework: it removes the build step entirely and keeps the file size small.",
          "Checked contrast and keyboard navigation deliberately, because roughly a third of portfolios fail the keyboard test.",
        ],
        honest:
          "There is no analytics and no contact form. Email is a plain link on purpose, since a form nobody monitors is worse than no form.",
      },
    },
  ],

  /* ── Timeline: keep it short and honest ───────────────── */
  timeline: [
    {
      period: "Jan 2026 — present",
      title: "Full-Stack Developer at Poolot",
      detail:
        "Working across frontend and backend systems, including admin dashboards, student workflows, payments, accounting tools, and operational features.",
    },
  ],

  /* ── Contact ──────────────────────────────────────────── */
  contact: {
    heading: "Let's build something",
    blurb:
      "I'm open to full-time roles, internships, freelance projects, and remote opportunities. If you want to discuss the systems and projects above, email is the fastest way to reach me.",
    email: "victoryogundipe4110@gmail.com",
    socials: [
      { label: "GitHub", href: "https://github.com/victory4110" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/ogundipe-victory-708875337" },
    ],
  },

  footer: "Built by hand with HTML, CSS and JavaScript. No framework, no build step.",
};
