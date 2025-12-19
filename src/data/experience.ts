import type { Experience } from "@/types/experience";

export const experiences: Experience[] = [
  {
    company: "Independent",
    role: "Freelance Engineer & Personal Projects",
    start: "Jan 2025",
    end: "Present",
    location: "Remote, Türkiye",
    bullets: [
      "Delivered short freelance work with JS/TS, Node.js, Next.js, and Python (APIs, dashboards, automation scripts)",
      "R&D on LLM-driven systems (prompt design, evaluation loops, retrieval, function/tool use)",
    ],
  },
  {
    company: "gardro.app",
    role: "Lead Full-Stack Software Engineer (Freelance)",
    start: "Aug 2024",
    end: "Dec 2024",
    location: "Remote, Türkiye",
    bullets: [
      "Owned MVP delivery using TypeScript, Next.js, Tailwind CSS and a Python/FastAPI backend",
      "Iterated SDXL prompts to improve relevance and reduce nudity outputs",
      "Added basic job queueing and rate limiting to improve image-generation stability",
    ],
  },
  {
    company: "Scorp",
    role: "Full-Stack Software Engineer",
    start: "Oct 2023",
    end: "Aug 2024",
    location: "Remote, Türkiye",
    bullets: [
      "Implemented backend features in Node.js and Python for livestream and moderation workflows",
      "Built streamer-facing dashboards and enhanced moderator UIs in Vue.js",
    ],
  },
  {
    company: "Aselsan",
    role: "Full-Stack Software Engineer (Full-time)",
    start: "Aug 2020",
    end: "Oct 2023",
    location: "Ankara, Türkiye",
    bullets: [
      "Developed React/TypeScript frontends and Spring Boot/Java backend services",
      "Managed Kubernetes clusters (OpenShift, Rancher, MicroK8s) and Helm deployments",
      "Improved CI/CD and ops workflows using Bash and Go scripting",
    ],
  },
  {
    company: "Aselsan",
    role: "Full-Stack Software Engineer (Part-time)",
    start: "Dec 2019",
    end: "Aug 2020",
    location: "Ankara, Türkiye",
    bullets: [
      "Built a Python/Django web tool to automate Excel/XML data processing",
      "Integrated IBM Rational ClearQuest for streamlined bug and issue tracking",
      "Reduced manual work by integrating the tool into an existing Django system",
    ],
  },
];
