import { Project } from "@/app/types/portfolio";

export const projects: Project[] = [
  {
    title: "gardro.app",
    description:
      "Led the development of backend and frontend architecture from scratch, implementing features using TypeScript, Next.js, and Python.",
    technologies: [
      // Languages
      { name: "TypeScript" },
      { name: "Python" },
      // Frontend
      { name: "Next.js" },
      { name: "Tailwind CSS" },
      { name: "Radix UI" },
    ],
    featured: true,
  },
  {
    title: "A Livestreaming Platform",
    description:
      "A livestreaming platform for content creators to stream their content to their audience.",
    technologies: [
      // Languages
      { name: "JavaScript" },
      { name: "Python" },
      // Frontend
      { name: "Vue.js" },
      // Backend
      { name: "Django" },
      // Databases
      { name: "MySQL" },
      { name: "Redis" },
      { name: "Firestore" },
      // Infrastructure
      { name: "Docker" },
      { name: "Google Cloud" },
    ],
    featured: true,
  },
  {
    title: "Enterprise Level Security System",
    description: "An enterprise level security system for a large corporation.",
    technologies: [
      // Languages
      { name: "JavaScript" },
      { name: "Java" },
      // Frontend
      { name: "React" },
      { name: "Material UI" },
      // Backend
      { name: "Spring Boot" },
      // Databases
      { name: "PostgreSQL" },
      { name: "Redis" },
      // Infrastructure
      { name: "Docker" },
    ],
    featured: true,
  },
  {
    title:
      "Microservices Architecture, CI/CD Pipeline, Kubernetes and Monitoring System",
    description:
      "Microservices architecture for internal use of a large corporation. CI/CD Pipelines for automating the build, test, and deployment process and Kubernetes for containerizing the application.",
    technologies: [
      // Languages
      { name: "JavaScript" },
      { name: "Java" },
      { name: "Bash Scripting" },
      // Frontend
      { name: "React" },
      // Backend
      { name: "Spring Boot" },
      // Databases
      { name: "PostgreSQL" },
      { name: "MongoDB" },
      { name: "Redis" },
      { name: "Elasticsearch" },
      // Message Brokers
      { name: "Kafka" },
      // Infrastructure & DevOps
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "OpenShift" },
      { name: "Rancher" },
      { name: "Microk8s" },
      { name: "Helm" },
      { name: "Gitlab CI/CD" },
      // Monitoring & Logging
      { name: "Prometheus" },
      { name: "Grafana" },
      { name: "Kibana" },
    ],
    featured: true,
  },
  {
    title:
      "Enterprise Level Software Development and Testing Management System",
    description:
      "An enterprise level software development and testing management system which is communicating with IBM Rational DOORS, IBM Rational ClearQuest and JIRA.",
    technologies: [
      // Languages
      { name: "JavaScript" },
      { name: "Python" },
      // Frontend
      { name: "jQuery" },
      { name: "Bootstrap" },
      // Backend
      { name: "Django" },
      // Database
      { name: "PostgreSQL" },
      // Infrastructure
      { name: "Docker" },
      { name: "Gitlab CI/CD" },
    ],
    featured: true,
  },
  {
    title: "HuDeX",
    description:
      "Blockchain Based Economy System for Games. An ecosystem to create, manage, and trade in-game items (as ERC-1155 tokens) on the Ethereum Network.",
    technologies: [
      // Languages
      { name: "Python" },
      { name: "Solidity" },
      // Backend
      { name: "Django" },
      // Database
      { name: "PostgreSQL" },
      // Blockchain
      { name: "Web3.js" },
      { name: "Truffle" },
    ],
    featured: false,
  },
];
