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
    year: "2026-PRESENT",
    role: "AI & Automation Specialist / IT Service Consultant",
    company: "Consulting IT (at DNB Bank)",
    description: "Building Microsoft Copilot + Power Automate workflows + identity governance via SailPoint. Orchestrating enterprise-scale automation for regulated banking environments.",
    skills: ["AI Agents", "Power Automate", "SailPoint", "Copilot Studio", "Python", "JSON", "XML", "Claude"]
  },
  {
    year: "2025-2026",
    role: "Thesis - Agentic AI Engineering",
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
    year: "2024-2025",
    role: "Sales Associate",
    company: "Elon",
    description: "Managed customer relationships and solved complex technical requirements for appliance and automation solutions.",
    skills: ["Customer Relations", "Technical Sales"]
  },
  {
    year: "2021-2024",
    role: "Customer Service Representative",
    company: "ICANIWILL",
    description: "Provided high-level support and issue resolution in a fast-paced e-commerce environment.",
    skills: ["Problem Solving", "CRM"]
  },
  {
    year: "2020-2021",
    role: "Accounting Assistant",
    company: "ICANIWILL",
    description: "Handled financial documentation, ledger management, and period-end closing tasks.",
    skills: ["Accounting", "Financial Data"]
  },
  {
    year: "2019-2020",
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
    degree: "Exchange Semester - International Business",
    period: "2024–2025"
  }
];

export const PROJECTS = [
  {
    id: "I",
    title: "Kitty Mesh - Browser-Only Computer Vision Cockpit",
    subtitle: "An on-device MediaPipe vision cockpit that reads face, hand, and pose signals from a webcam and classifies sixteen gestures. It presents the live pipeline in a retro desktop interface with no backend or telemetry.",
    tech: ["TypeScript", "React 19", "Vite 7", "@mediapipe/tasks-vision", "WASM", "FaceLandmarker", "HandLandmarker", "PoseLandmarker", "Blendshape Scoring", "Gesture Stabilization", "Web Audio API", "getUserMedia", "Vitest", "Vercel", "Git"],
    link: "https://github.com/MaximilianWik/Kitty-Mesh",
    liveLink: "https://kittymesh.vercel.app/"
  },
  {
    id: "II",
    title: "MW-Finance - Personal Finance Terminal",
    subtitle: "A personal finance terminal connected to real bank data through Enable Banking and BankID. It automates categorisation, salary-cycle budgeting, recurring-payment detection, savings goals, and spending insights in a retro CLI interface.",
    tech: ["Next.js 15", "TypeScript", "React 19", "Drizzle ORM", "Neon Postgres", "Enable Banking API", "RS256 JWT", "BankID", "Gemini 2.0 Flash", "ntfy", "Tailwind CSS", "Vercel Blob", "App Router", "Vercel", "Git"],
    link: "https://github.com/MaximilianWik/MW-Finance",
    liveLink: "https://mw-finance-six.vercel.app/"
  },
  {
    id: "III",
    title: "Sharon Shakti - Horror-Realism Portfolio & Live Booking",
    subtitle: "A gallery-led portfolio and live booking system for tattoo artist Sharon Shakti. Google Calendar drives availability and bookings, while React Three Fiber, GSAP, and bespoke gothic details shape the visual experience.",
    tech: ["Next.js 14", "React Three Fiber", "Three.js", "TypeScript", "Tailwind CSS", "Simplex Noise Shader", "Canvas2D", "GSAP", "Lenis", "Framer Motion", "Google Calendar API", "Nodemailer", "Gmail SMTP", "App Router", "Vercel", "Git"],
    link: "https://github.com/MaximilianWik/Sharon-Shakti",
    liveLink: "https://sharon-shakti.vercel.app/"
  },
  {
    id: "IV",
    title: "Paleblood Vigil - Generative Algorithmic Art",
    subtitle: "A seeded p5.js art piece where particles orbit four changing attractors and leave heat-map trails. Live controls adjust the simulation without a build step or backend.",
    tech: ["p5.js", "JavaScript", "HTML5", "Perlin Noise", "N-body Simulation", "HSB Colour", "Procedural Generation", "Seeded PRNG", "Off-screen Canvas", "Cinzel", "Crimson Text", "MIT License", "Git"],
    link: "https://github.com/MaximilianWik/Paleblood-Vigil",
    liveLink: "https://paleblood-vigil.vercel.app/"
  },
  {
    id: "V",
    title: "Carpet Eater - Audio-Mauling Desktop Tool",
    subtitle: "A transparent Windows desktop tool that chews audio files into deterministic distorted versions. It combines PySide6 drag and drop with an ffmpeg-backed, multi-stage numpy DSP pipeline.",
    tech: ["Python", "PySide6", "Qt 6", "numpy", "soundfile", "ffmpeg", "PyInstaller", "Inno Setup", "GitHub Actions", "Threaded DSP", "Deterministic Seeding", "Frameless Transparent Window", "Drag-and-Drop", "Git"],
    link: "https://github.com/MaximilianWik/Carpet-Eater"
  },
  {
    id: "VI",
    title: "Studio Panic Attack - Interactive 3D Web Experience",
    subtitle: "An immersive landing experience for Stockholm creative collective Studio Panic Attack. A single WebGL scene combines React Three Fiber, post-processing shaders, GSAP choreography, and supplied media.",
    tech: ["TypeScript", "React 19", "Vite 6", "React Three Fiber", "drei", "@react-three/postprocessing", "@paper-design/shaders-react", "GSAP", "Three.js", "WebGL", "Vercel", "Git"],
    link: "https://github.com/MaximilianWik/Studio-Panic-Attack",
    liveLink: "https://studio-panic-attack-maximilian.vercel.app/"
  },
  {
    id: "VII",
    title: "Subdermal - QR-Tattoo Domain & Collaborative Canvas",
    subtitle: "A QR-tattoo destination that can switch between nine React states. Its Subdermal canvas lets visitors draw together on a large D1-backed surface with ownership, replay, moderation, and nine tools.",
    tech: ["TypeScript", "React 19", "Vite 6", "Hono 4", "Cloudflare Workers", "Cloudflare D1", "SQLite at the Edge", "HTMLCanvas", "Pan / Zoom", "localStorage", "UUID Ownership", "Auto-Deploy", "QR Code", "Git"],
    link: "https://github.com/MaximilianWik/Cloudflare-Domain",
    liveLink: "https://max-wik.com/"
  },
  {
    id: "VIII",
    title: "Tessera - Verified-Permanent QR Code Generator",
    subtitle: "A browser-only QR generator for durable uses such as tattoos. It verifies output against ISO test vectors, checks independent decoders, and stress-tests damage tolerance before producing an archival specification sheet.",
    tech: ["JavaScript", "HTML5", "CSS", "QR Encoding", "ISO/IEC 18004", "Client-Side Only", "Vendored Decoders", "Canvas Rendering", "PDF Generation", "Spec-Compliant", "Vercel", "MIT License", "Git"],
    link: "https://github.com/MaximilianWik/Tessera",
    liveLink: "https://tessera-neon.vercel.app/"
  },
  {
    id: "IX",
    title: "Cursed Echoes - Typing Survival Game",
    subtitle: "A gothic browser typing game where players cast spells by typing incoming words. It tracks health, combos, accuracy, difficulty, high scores, and hidden encounters.",
    tech: ["TypeScript", "React 19", "Vite", "Tailwind CSS 4", "Framer Motion", "Lucide React", "Express", "Node.js", "Vercel", "HTML5", "Game State Management", "Git"],
    link: "https://github.com/MaximilianWik/CursedEchoesMiniGame.git",
    liveLink: "https://cursedechoes.vercel.app/"
  },
  {
    id: "X",
    title: "PortfolioV3 - Soulsborne-Inspired Personal Portfolio",
    subtitle: "This portfolio is a React and Vite site built around a Soulsborne visual language. It combines motion, tilt, smooth scrolling, interactive text, ambient audio, and Vercel Analytics in one codebase.",
    tech: ["TypeScript", "React 19", "Vite 6", "Tailwind CSS 4", "motion/react", "vanilla-tilt", "lenis", "Canvas 2D", "Vercel Analytics", "Code Splitting", "Vercel", "Git"],
    link: "https://github.com/MaximilianWik/PortfolioV3"
  },
  {
    id: "XI",
    title: "Podd App - (RSS Feed Podcast Manager)",
    subtitle: "A Windows RSS podcast manager. Users add feeds, group shows into custom categories, and manage the collection through a layered C# application.",
    tech: ["C#", ".NET 6", "Windows Forms", "XML / RSS Parsing", "XPath", "Layered Architecture", "Repository Pattern", "Visual Studio", "Git"],
    link: "https://github.com/MaximilianWik/Podd-App-RSS-FEED.git"
  },
  {
    id: "XII",
    title: "CV Portal - (ASP.NET Core Web Application)",
    subtitle: "A full-stack CV platform where users build public or private profiles, publish projects, browse other members, and exchange private messages through an Identity-protected ASP.NET Core app.",
    tech: ["C#", ".NET 8", "ASP.NET Core MVC", "Razor", "Entity Framework Core", "SQL Server", "ASP.NET Core Identity", "EF Migrations", "Dependency Injection", "Bootstrap", "jQuery", "HTML", "CSS", "JavaScript", "Git"],
    link: "https://github.com/MaximilianWik/CVPortal-Asp.Net.git"
  },
  {
    id: "XIII",
    title: "MIB Project - (Java Swing Desktop Application)",
    subtitle: "A team-built Java Swing application for managing fictional agents, aliens, and administrators. Role-based flows cover registration, profile updates, search, and MySQL-backed records.",
    tech: ["Java", "Java Swing", "AWT", "MySQL", "JDBC", "SQL", "NetBeans", "Apache Ant", "Role-Based Access Control", "Team Project", "Git"],
    link: "https://github.com/MaximilianWik/MIB-projekt-Java-Winframe.git"
  },
  {
    id: "XIV",
    title: "Hattfabriken - Custom Factory Management System",
    subtitle: "A full-stack system for a custom hat factory. It handles requests, offers, orders, inventory, invoices, notifications, and a documented API through ASP.NET Core.",
    tech: ["C#", ".NET 8", "ASP.NET Core MVC", "ASP.NET Core Web API", "Razor", "Entity Framework Core", "SQL Server", "ASP.NET Core Identity", "EF Migrations", "Dependency Injection", "QuestPDF", "MailKit", "Swagger", "Bootstrap", "jQuery", "Git"],
    link: "https://github.com/hannesmalm/Hattfabriken"
  }
];

