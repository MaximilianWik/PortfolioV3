/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PROFILE = {
  name: "Maximilian Wikström",
  role: "AI & Automation Specialist",
  location: "Stockholm",
  email: "max.wik@icloud.com",
  phone: "+46 70 736 0515",
  github: "https://github.com/MaximilianWik",
  linkedin: "https://www.linkedin.com/in/maximilian-wikström/?locale=en",
};

// Single source of truth for the headline figures. Consumed by Hero and About
// so the two surfaces can never drift out of sync.
export const STATS = {
  yearsActive:  6,   // 2020 → present
  systemsTamed: 19,
  linguaFranca: 8,   // C#, Java, TS, JS, Python, SQL, HTML, CSS
} as const;

export const EXPERIENCE = [
  {
    year: "2026—PRESENT",
    role: "AI & Automation Specialist / IT Service Consultant",
    company: "Consulting IT (at DNB Bank)",
    description: "Building Microsoft Copilot + Power Automate workflows + identity governance via SailPoint. Orchestrating enterprise-scale automation for regulated banking environments.",
    skills: ["AI Agents", "Power Automate", "SailPoint", "Copilot Studio", "Python", "JSON", "XML", "Claude"]
  },
  {
    year: "2025—2026",
    role: "Thesis — Agentic AI Engineering",
    company: "SEB",
    description: "Researching and developing Agentic AI frameworks within highly regulated financial sectors. Focusing on risk mitigation and reliability of autonomous agents.",
    skills: ["Agentic AI", "Regulatory Compliance", "LLMs"]
  },
  {
    year: "2025",
    role: "Business Intelligence Developer (Internship)",
    company: "Örebro University",
    description: "Modernized Power BI architecture using Medallion architecture. Developed decay-curve models for resource allocation.",
    skills: ["Power BI", "DAX", "Medallion Architecture", "Data Modeling"]
  },
  {
    year: "2024—2025",
    role: "Sales Associate",
    company: "Elon",
    description: "Managed customer relationships and solved complex technical requirements for appliance and automation solutions.",
    skills: ["Customer Relations", "Technical Sales"]
  },
  {
    year: "2021—2024",
    role: "Customer Service Representative",
    company: "ICANIWILL",
    description: "Provided high-level support and issue resolution in a fast-paced e-commerce environment.",
    skills: ["Problem Solving", "CRM"]
  },
  {
    year: "2020—2021",
    role: "Accounting Assistant",
    company: "ICANIWILL",
    description: "Handled financial documentation, ledger management, and period-end closing tasks.",
    skills: ["Accounting", "Financial Data"]
  },
  {
    year: "2019—2020",
    role: "Receptionist",
    company: "Friskis & Svettis",
    description: "Managed member inquiries and facility operations in Stockholm's premier fitness chain.",
    skills: ["Service Excellence", "Operations"]
  }
];

export const EDUCATION = [
  {
    institution: "Örebro University",
    degree: "BSc in Information Systems",
    period: "2023–2026"
  },
  {
    institution: "Nuremberg Institute of Technology",
    degree: "Exchange Semester — International Business",
    period: "2024–2025"
  }
];

export const PROJECTS = [
  {
    id: "I",
    title: "Sharon Shakti - Horror-Realism Portfolio & Live Booking",
    subtitle: "A gallery-grade portfolio and live booking system for blackwork and horror-realism tattoo artist Sharon Shakti (@sharonnshakti), built pro bono. Next.js 14 App Router with a React Three Fiber hero — simplex-noise displacement shader driving a sculpted mesh, canvas2D oxblood ember particles overlaid. Google Calendar is the sole source of truth for availability and bookings: no database, no CMS. Three API routes handle day-level slot queries (/api/slots), a 28-day horizon availability summary (/api/availability), and atomic booking with race-condition guard (/api/book) — a 409 is returned if the slot is claimed in the intervening milliseconds. Lenis smooth scroll and GSAP ScrollTrigger drive all entrance choreography; Framer Motion handles per-route page transitions and a full-screen lightbox. A bespoke gothic ornament system spans SVG quatrefoils, arcade arches, tracery corner brackets, rose windows, and pointed-arch clip-path buttons. Confirmation emails — to both client and artist — sent via Nodemailer and Gmail SMTP. Image drops into public/ folders auto-appear on next deploy with no code changes.",
    tech: ["Next.js 14", "React Three Fiber", "Three.js", "TypeScript", "Tailwind CSS", "Simplex Noise Shader", "Canvas2D", "GSAP", "Lenis", "Framer Motion", "Google Calendar API", "Nodemailer", "Gmail SMTP", "App Router", "Vercel", "Git"],
    link: "https://github.com/MaximilianWik/Sharon-Shakti",
    liveLink: "https://sharon-shakti.vercel.app/"
  },
  {
    id: "II",
    title: "Paleblood Vigil - Generative Algorithmic Art",
    subtitle: "A single-file, zero-dependency generative art piece built with p5.js. Simulates an N-body attractor system: four gravitational attractors orbit the canvas centre, each exerting inverse-square pull with sinusoidal strength pulsing. Particles accumulate trails on a persistent off-screen p5.Graphics buffer, dimmed each frame to produce heat-map convergence zones in deep crimson-to-blood-orange HSB colour encoding. A geometric substrate of three counter-rotating concentric polygons (hexagon, nonagon, dodecagon) underlays the particle field at low opacity. All randomness is seeded — same seed and parameters reproduce the output exactly. Five live parameters (particle count, gravity pull, turbulence, viscosity, trail fade) update without reinitialisation. No npm, no build step, no server — fully self-contained HTML distributed via GitHub.",
    tech: ["p5.js", "JavaScript", "HTML5", "Perlin Noise", "N-body Simulation", "HSB Colour", "Procedural Generation", "Seeded PRNG", "Off-screen Canvas", "Cinzel", "Crimson Text", "MIT License", "Git"],
    link: "https://github.com/MaximilianWik/Paleblood-Vigil",
    liveLink: "https://paleblood-vigil.vercel.app/"
  },
  {
    id: "III",
    title: "Carpet Eater - Audio-Mauling Desktop Tool",
    subtitle: "A frameless, transparent, mouth-shaped Windows desktop tool made for the artist Carpet Eater. Drag any audio file onto the open mouth — it chews, then writes a horrifyingly distorted version next to the original. Built on PySide6 (Qt 6) with a true alpha-channel-shaped window, drag-and-drop, threading and timers. Decodes any format via a bundled ffmpeg.exe (mp3, m4a, opus, ogg, flac, wav, aiff…) piped to raw float32 PCM. DSP is pure numpy across nine vectorised stages — pitch + speed mangle, granular shuffle, bitcrush, sample-rate reduction, hard-clip waveshaping, ring modulation, comb-filter resonance, reverse-tail smear reverb, random dropouts — composed into five named chains (standard_mauling, wet_slobber, bone_grinder, pulper, stomach_acid). Every chew is fully deterministic: chain selection, DSP parameters and output filename are all seeded from a SHA-1 of the input file's path + size + mtime via independent numpy SeedSequence sub-streams. Output filenames escalate per chew (\"chewed - tasted 47 GAMEY!!!\" → \"putrid_incestuous_chewed - tasted 89 RANCID!!!\"). Packaged with PyInstaller into a single ~80 MB EXE plus a per-user Inno Setup installer (no admin required). GitHub Actions CI builds installer + portable ZIP on every push.",
    tech: ["Python", "PySide6", "Qt 6", "numpy", "soundfile", "ffmpeg", "PyInstaller", "Inno Setup", "GitHub Actions", "Threaded DSP", "Deterministic Seeding", "Frameless Transparent Window", "Drag-and-Drop", "Git"],
    link: "https://github.com/MaximilianWik/Carpet-Eater"
  },
  {
    id: "IV",
    title: "Studio Panic Attack - Interactive 3D Web Experience",
    subtitle: "A GPU-accelerated, fully immersive landing experience for Stockholm creative collective Studio Panic Attack. Built on React Three Fiber with drei composition utilities, @react-three/postprocessing for layered render passes, and @paper-design/shaders-react for full-screen generative shading effects. GSAP orchestrates scroll-driven narrative choreography across the 3D scene graph while R3F manages camera, lighting, and geometry entirely within a single WebGL context — zero DOM animations, no layout thrash. Public assets (61 images, 3 video clips) feed directly into the scene. Deployed on Vercel with Vite 6.",
    tech: ["TypeScript", "React 19", "Vite 6", "React Three Fiber", "drei", "@react-three/postprocessing", "@paper-design/shaders-react", "GSAP", "Three.js", "WebGL", "Vercel", "Git"],
    link: "https://github.com/MaximilianWik/Studio-Panic-Attack",
    liveLink: "https://studio-panic-attack-maximilian.vercel.app/"
  },
  {
    id: "V",
    title: "Subdermal - QR-Tattoo Domain & Collaborative Canvas",
    subtitle: "A React 19 single-page application deployed at the edge as a Cloudflare Worker, with a Hono 4 API backend and Cloudflare D1 (SQLite at the edge) for persistence. Live at max-wik.com — reached via a real QR-code tattoo on my arm. Runs on a state-switch architecture: a single number in state.ts selects which of nine pages renders, and Cloudflare auto-deploys on every push to main, so the destination behind the tattoo can be re-skinned from a phone in under a minute. The flagship state, Subdermal, is a 16384 × 24576 collaborative canvas where any visitor can sign a piece beside everyone else's. Features nine brushes (pen, watercolor, calligraphy, spray, airbrush, pixel-art, blender, eyedropper, eraser), pinch/zoom + pan, undo/redo with 50-step history, debounced draft auto-save to localStorage, per-browser ownership via UUID + server-side owner_secret, a stroke-by-stroke replay on each detail card, and a token-gated admin moderation flow (Hide / Ban IP) validated on the Worker.",
    tech: ["TypeScript", "React 19", "Vite 6", "Hono 4", "Cloudflare Workers", "Cloudflare D1", "SQLite at the Edge", "HTMLCanvas", "Pan / Zoom", "localStorage", "UUID Ownership", "Auto-Deploy", "QR Code", "Git"],
    link: "https://github.com/MaximilianWik/Cloudflare-Domain",
    liveLink: "https://max-wik.com/"
  },
  {
    id: "VI",
    title: "Tessera - Verified-Permanent QR Code Generator",
    subtitle: "A zero-dependency, client-side QR code generator designed for codes that must work for life — like tattoo QR codes. Verifies correctness against ISO/IEC 18004 Annex I test vectors, round-trip decodes through multiple independent decoders (jsQR, ZXing-js, native BarcodeDetector), and stress-tests damage tolerance with clustered blot overlays (5–30% coverage). Generates archival specification sheets with full module matrices (ASCII + hex), timestamp, source code SHA-256, and reproduction instructions. 100% static, no build step, no runtime dependencies, no server — runs in any browser, deployed on Vercel.",
    tech: ["JavaScript", "HTML5", "CSS", "QR Encoding", "ISO/IEC 18004", "Client-Side Only", "Vendored Decoders", "Canvas Rendering", "PDF Generation", "Spec-Compliant", "Vercel", "MIT License", "Git"],
    link: "https://github.com/MaximilianWik/Tessera",
    liveLink: "https://tessera-neon.vercel.app/"
  },
  {
    id: "VII",
    title: "Cursed Echoes - Typing Survival Game",
    subtitle: "A Dark Souls-inspired gothic typing survival game built in the browser. Players type incoming words drawn from a large lore-flavored dictionary (spanning Dark Souls, Bloodborne, Sekiro, and Elden Ring terminology) to cast spells and survive waves of increasing difficulty. Features include a health and scoring system, combo multipliers, difficulty scaling, pause/resume, accuracy tracking (total vs. correct keystrokes), a high-score board, mobile-friendly input focus handling, responsive canvas scaling, hidden secret screens with interactive easter eggs, and animated character states (idle / casting). Deployed live on Vercel.",
    tech: ["TypeScript", "React 19", "Vite", "Tailwind CSS 4", "Framer Motion", "Lucide React", "Express", "Node.js", "Vercel", "HTML5", "Game State Management", "Git"],
    link: "https://github.com/MaximilianWik/CursedEchoesMiniGame.git",
    liveLink: "https://cursedechoes.vercel.app/"
  },
  {
    id: "VIII",
    title: "PortfolioV3 - Soulsborne-Inspired Personal Portfolio",
    subtitle: "This very site. A hand-crafted, theatrical personal portfolio built on React 19, Vite 6, and Tailwind CSS 4, leaning into a deliberately ceremonial soulsborne-inspired visual language — ember-blood accents on ink-void, Cormorant Garamond / Cinzel / EB Garamond / JetBrains Mono typography, and a bonfire-lit hero. Features declarative motion choreography via motion/react, parallax card tilt with vanilla-tilt, smooth inertial scrolling through Lenis, a pointer-reactive dispersing-text engine, code-split sections, ambient audio handling, and Vercel Analytics for deploy-side metrics. All content is centralized in a single typed data module.",
    tech: ["TypeScript", "React 19", "Vite 6", "Tailwind CSS 4", "motion/react", "vanilla-tilt", "lenis", "Canvas 2D", "Vercel Analytics", "Code Splitting", "Vercel", "Git"],
    link: "https://github.com/MaximilianWik/PortfolioV3"
  },
  {
    id: "IX",
    title: "Podd App - (RSS Feed Podcast Manager)",
    subtitle: "A Windows desktop application for collecting and organizing podcasts via RSS feeds. Users add podcasts by pasting an RSS URL, which the app parses to automatically retrieve the podcast title from the feed's XML. Podcasts can be assigned to custom user-defined categories, with full CRUD operations (add, edit, remove) synchronized across the list view and dropdown selector. The project is structured around a classic three-tier architecture, separating UI (WinForms), business logic (BL), and data access (DAL) into distinct class library projects — demonstrating separation of concerns and modular software design.",
    tech: ["C#", ".NET 6", "Windows Forms", "XML / RSS Parsing", "XPath", "Layered Architecture", "Repository Pattern", "Visual Studio", "Git"],
    link: "https://github.com/MaximilianWik/Podd-App-RSS-FEED.git"
  },
  {
    id: "X",
    title: "CV Portal - (ASP.NET Core Web Application)",
    subtitle: "A full-stack web portal where users can register an account, build and publish their personal CV, showcase projects, browse other users' profiles, and send private messages. Essentially a lightweight LinkedIn-style platform for job seekers and students. Users can toggle profiles between public and private, upload profile pictures, fill in CV details (education, experience, skills), attach personal projects, and reach out to other users through an in-app inbox. Protected pages are gated via ASP.NET Core Identity.",
    tech: ["C#", ".NET 8", "ASP.NET Core MVC", "Razor", "Entity Framework Core", "SQL Server", "ASP.NET Core Identity", "EF Migrations", "Dependency Injection", "Bootstrap", "jQuery", "HTML", "CSS", "JavaScript", "Git"],
    link: "https://github.com/MaximilianWik/CVPortal-Asp.Net.git"
  },
  {
    id: "XI",
    title: "MIB Project - (Java Swing Desktop Application)",
    subtitle: "A Men in Black-themed desktop application for managing aliens, agents, and administrators within a fictional MIB organization. Built as a team project (three developers). The app presents different menus based on user role — administrators create and modify records, agents search and inspect alien profiles, and aliens can log in to view and update their own information. Includes role-based login flows (Admin / Agent / Alien), account registration, password changes, alien registration with registration dates and equipment tracking, search functionality, and a MySQL backend for persistent storage.",
    tech: ["Java", "Java Swing", "AWT", "MySQL", "JDBC", "SQL", "NetBeans", "Apache Ant", "Role-Based Access Control", "Team Project", "Git"],
    link: "https://github.com/MaximilianWik/MIB-projekt-Java-Winframe.git"
  },
  {
    id: "XII",
    title: "Hattfabriken - Custom Factory Management System",
    subtitle: "A full-stack web application for managing the operations of a custom hat manufacturer. The system supports the entire workflow from customer inquiry to delivery: customers can browse hats, submit custom requests specifying material, measurements, height, and special effects, and receive a price quote. Staff can then convert requests into formal offers and confirmed orders, while admins manage the warehouse inventory, materials catalog, and special-effects options. Orders include automatically generated PDF invoices and email notifications sent to customers, with a status pipeline and shipping/cost calculations. Also exposes a documented Web API alongside the MVC frontend.",
    tech: ["C#", ".NET 8", "ASP.NET Core MVC", "ASP.NET Core Web API", "Razor", "Entity Framework Core", "SQL Server", "ASP.NET Core Identity", "EF Migrations", "Dependency Injection", "QuestPDF", "MailKit", "Swagger", "Bootstrap", "jQuery", "Git"],
    link: "https://github.com/hannesmalm/Hattfabriken"
  }
];
