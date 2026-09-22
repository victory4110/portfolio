/**
 * ─────────────────────────────────────────────────────────────
 *  THIS IS THE ONLY FILE YOU NEED TO EDIT FOR NORMAL UPDATES.
 *  Change the text between the quotes, save, refresh the page.
 *
 *  Positioning (read this once, then it will make sense):
 *  "Fullstack developer" on its own is the most common title in
 *  tech and signals nothing. What works is LEAN + STACK + DOMAIN.
 *  Keep those three things visible in `role`, `lean` and `focus`.
 * ─────────────────────────────────────────────────────────────
 */

window.PORTFOLIO = {
  /* ── Identity ─────────────────────────────────────────── */
  name: "Victory Ogundipe",
  role: "Fullstack Engineer",
  lean: "Backend Depth",
  // The domain you go deep in. This is what makes you specific
  // instead of "another fullstack dev". Change it if the truth changes.
  focus: "Education & back-office systems",
  tagline:
    "I build the API and the interface, from database schema to shipped screen.",
  location: "Nigeria",
  // Drop a photo at assets/avatar.jpg and it appears automatically.
  // Leave as "" to show your initials instead.
  avatar: "",
  availableForWork: true,

  /* ── Short bio (2–3 sentences is plenty) ──────────────── */
  about: [
    "I'm a fullstack engineer working mainly in TypeScript, with my depth on the backend. That means NestJS services, MongoDB and Mongoose schemas, multi-tenant data scoping, and auth built around JWT and role-based access control. On the frontend I build the React and Next.js interfaces that talk to those APIs.",
    "I also write Rust: the on-site apps in my school platform are Tauri desktop clients with a Rust backend on SQLite, an async sync loop, and mDNS service discovery so they can find a server on the local network. Most of what I've built has been for schools and back-office teams, where the interesting problems are not visual. Offline-first data sync, keeping one tenant's records away from another's, and making installs survive flaky internet are the parts I actually enjoy.",
  ],

  /* ── Buttons under your name ──────────────────────────── */
  links: [
    { label: "Email me", href: "mailto:victoryogundipe4110@gmail.com", primary: true },
    { label: "GitHub", href: "https://github.com/victory4110" },
    { label: "LinkedIn", href: "https://linkedin.com/in/your-username" }, // replace with your real profile URL
    { label: "Résumé (PDF)", href: "#" }, // point this at assets/resume.pdf once you add it
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
      items: [
        "TypeScript",
        "Node.js",
        "NestJS",
        "MongoDB",
        "Mongoose",
        "React",
        "Next.js",
      ],
    },
    {
      level: "Comfortable",
      note: "Used in real projects. Productive, still learning the sharp edges.",
      items: [
        "Rust & Tauri (desktop app backends)",
        "SQLite / rusqlite",
        "JWT & RBAC",
        "Zod validation",
        "Jest & Supertest",
        "REST API design",
        "Tailwind CSS",
        "TanStack Query",
        "Turborepo & npm workspaces",
        "AWS S3",
        "Nodemailer",
        "Solidity & Hardhat",
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
        "The on-site apps are Tauri desktop applications with their own Rust backend: SQLite for local storage, an async tokio loop for sync, and mDNS to find the server on the LAN. The central API stays NestJS and MongoDB.",
      why: "The installs are offline for most of the working day, so the client has to own durable local storage and survive being killed mid-write. Rust is good at that, and the server side is better off in the language I move fastest in.",
      cost:
        "Two languages and two data models to keep in step. Every synced record has to agree on its shape across Rust structs, serde JSON and Mongoose schemas, and a mismatch only shows up when sync runs, on a machine I am not sitting at.",
    },
    {
      title: "Offline-first sync instead of a cloud-only API",
      chose:
        "School installs run their own local server and push records to a central API, rather than every client talking straight to the cloud.",
      why: "Schools lose connectivity during the day. If the register cannot be taken when the internet drops, the software is useless there.",
      cost:
        "I had to own duplicate-suppression and idempotency myself. Every pushed record carries a localId so a retry after a dropped connection does not create a second copy. A cloud-only design would have none of that work.",
    },
    {
      title: "Tenant credentials in headers for machine sync, JWT for humans",
      chose:
        "Server-to-server sync authenticates with a per-school id and secret header pair. Interactive users get JWT sessions with role checks.",
      why: "A scheduled sync job has no user to log in, so a session-based flow does not fit it.",
      cost:
        "Two auth paths to maintain and reason about. I keep them separate on purpose so the machine path can be rotated per install without touching user accounts.",
    },
    {
      title: "Tolerate a missing database at boot",
      chose:
        "The Mongoose connection is lazy with a short selection timeout, so the process starts even when the database is unreachable.",
      why: "On-site installs get started before the database is ready. Crashing on boot there means someone has to drive out and restart it.",
      cost:
        "Failures surface later, on the first query rather than at startup, which is harder to debug. I accepted that in exchange for the service staying up.",
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
      caseStudy: {
        summary:
          "An internal admin tool for a team that needed different people to have different levels of access to the same data.",
        problem:
          "Admin tools tend to start open and get bolted shut later. This one had to be built with permissions as a first-class concern, including for the accounting data.",
        role:
          "I built the access control model and the backend that enforces it, plus the supporting infrastructure for uploads and email.",
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
      title: "ERC-20 token with a Hardhat test suite",
      slug: "token",
      blurb:
        "A Solidity token built with a full Hardhat toolchain, including TypeScript tests and type-safe contract bindings for the frontend.",
      tags: ["Solidity", "Hardhat", "TypeScript", "Testing"],
      live: "",
      code: "",
      caseStudy: {
        summary:
          "A token contract taken all the way through the toolchain rather than stopped at the contract file.",
        problem:
          "Contract code is deployed once and cannot be quietly patched, so the value is in the tests and the deployment path, not the contract itself.",
        role:
          "I wrote the contract, the test suite covering token behaviour, and the deployment setup.",
        built: [
          "ERC-20 contract with minting, transfer and allowance behaviour",
          "TypeScript tests asserting the expected success and failure paths",
          "Ignition deployment modules and a local node workflow",
          "Generated type-safe bindings so the frontend cannot call a contract incorrectly",
        ],
        decisions: [
          "Tested the failure cases as deliberately as the happy path, since the reverts are where tokens usually break.",
          "Generated typed bindings instead of hand-writing calls, so a contract change fails at compile time.",
        ],
        honest:
          "This is a learning project, not an audited contract. I would not deploy it with real value attached.",
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
      live: "",
      code: "https://github.com/your-username/portfolio",
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
      period: "2026 — now",
      title: "Fullstack engineer (self-taught, building in public)",
      detail:
        "Building TypeScript systems end to end: NestJS and MongoDB services on the backend, React and Next.js on the frontend.",
    },
    {
      period: "Earlier",
      title: "Digital marketing",
      detail:
        "Ran campaigns and content, which taught me how real users actually behave on a page.",
    },
  ],

  /* ── Contact ──────────────────────────────────────────── */
  contact: {
    heading: "Let's build something",
    blurb:
      "I'm looking for a junior fullstack or backend role. If you want to talk about the sync design above, or anything else on this page, email is the fastest way to reach me.",
    email: "victoryogundipe4110@gmail.com",
    socials: [
      { label: "GitHub", href: "https://github.com/victory4110" },
      { label: "LinkedIn", href: "https://linkedin.com/in/your-username" }, // replace with your real profile URL
      { label: "X / Twitter", href: "https://x.com/your-username" },
    ],
  },

  footer: "Built by hand with HTML, CSS and JavaScript. No framework, no build step.",
};
