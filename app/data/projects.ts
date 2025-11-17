import { Project } from "@/app/types/portfolio";

export const projects: Project[] = [
  {
    title: "gardro.app",
    description:
      "Owned the full-stack MVP using TypeScript, Next.js, Tailwind CSS and a Python/FastAPI backend. Improved image-generation reliability and refined SDXL prompts.",
    technologies: [
      { name: "TypeScript" },
      { name: "Next.js" },
      { name: "Tailwind CSS" },
      { name: "Python" },
      { name: "FastAPI" },
    ],
    featured: false,
    category: "professional",
  },
  {
    title: "A Livestreaming Platform",
    description:
      "Worked on livestreaming, moderation, and creator analytics—building backend services and streamer/moderator dashboards.",
    technologies: [
      { name: "JavaScript" },
      { name: "Vue.js" },
      { name: "Python" },
      { name: "Django" },
      { name: "MySQL" },
      { name: "Redis" },
      { name: "Firestore" },
      { name: "Docker" },
      { name: "Google Cloud" },
    ],
    featured: false,
    category: "professional",
  },
  {
    title: "Enterprise-Level Security System",
    description:
      "Developed React frontends and Spring Boot services for a mission-critical defense application.",
    technologies: [
      { name: "JavaScript" },
      { name: "React" },
      { name: "MUI" },
      { name: "Java" },
      { name: "Spring Boot" },
      { name: "PostgreSQL" },
      { name: "Redis" },
      { name: "Docker" },
    ],
    featured: false,
    category: "professional",
  },
  {
    title: "Microservices Architecture, CI/CD Pipelines & Kubernetes Platform",
    description:
      "Designed microservices, automated CI/CD pipelines, and managed Kubernetes environments (OpenShift, Rancher, MicroK8s).",
    technologies: [
      { name: "JavaScript" },
      { name: "React" },
      { name: "Java" },
      { name: "Spring Boot" },
      { name: "Bash Scripting" },
      { name: "PostgreSQL" },
      { name: "MongoDB" },
      { name: "Redis" },
      { name: "Kafka" },
      { name: "Elasticsearch" },
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "OpenShift" },
      { name: "Rancher" },
      { name: "MicroK8s" },
      { name: "Helm" },
      { name: "GitLab CI/CD" },
      { name: "Prometheus" },
      { name: "Grafana" },
      { name: "Kibana" },
    ],
    featured: false,
    category: "professional",
  },
  {
    title: "Enterprise Software Development & Test Management System",
    description:
      "A Django-based system integrated with IBM DOORS, ClearQuest and JIRA to streamline development, testing and reporting workflows.",
    technologies: [
      { name: "JavaScript" },
      { name: "Python" },
      { name: "jQuery" },
      { name: "Bootstrap" },
      { name: "Django" },
      { name: "PostgreSQL" },
      { name: "Docker" },
      { name: "GitLab CI/CD" },
    ],
    featured: false,
    category: "professional",
  },
  {
    title: "akalp.co",
    description:
      "Personal website and blog built with Next.js (App Router) and TypeScript, showcasing projects and writing.",
    technologies: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
    ],
    featured: false,
    category: "personal",
    github: "https://github.com/akalp/akalpco",
    link: "https://akalp.co",
  },
  {
    title: "ws",
    description:
      "A workspace switcher and scaffolding tool written in Go with a fuzzy-search TUI and project templates.",
    technologies: [{ name: "Go" }, { name: "TUI" }, { name: "CLI" }],
    featured: false,
    category: "personal",
    github: "https://github.com/akalp/ws",
  },
  {
    title: "SlidePlay",
    description:
      "A real-time multiplayer slideshow and quiz app built with Express and Socket.IO, featuring player, host, and admin views with live scoring, slide control, and in-memory state.",
    technologies: [
      { name: "Node.js" },
      { name: "Express" },
      { name: "Socket.IO" },
      { name: "JavaScript" },
      { name: "HTML" },
      { name: "CSS" },
    ],
    featured: false,
    category: "personal",
    github: "https://github.com/akalp/SlidePlay",
  },
  {
    title: "bs5-nav-tree",
    description:
      "A Bootstrap 5 plugin enabling searchable, collapsible, nested vertical navigation menus.",
    technologies: [
      { name: "JavaScript" },
      { name: "Bootstrap" },
      { name: "CSS" },
    ],
    featured: false,
    category: "personal",
    github: "https://github.com/akalp/bs5-nav-tree",
  },
];
