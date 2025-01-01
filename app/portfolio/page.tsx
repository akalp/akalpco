import { projects } from "../data/projects";
import { ProjectCard } from "./components/project-card";
import { portfolioMetadata } from "../config/metadata";

export const metadata = portfolioMetadata;

export default function PortfolioPage() {
  return (
    <div className="container-width py-6 md:py-12">
      <div className="mb-12">
        <h1 className="heading-1 mb-6">Portfolio</h1>
        <p className="body-text max-w-2xl">
          A collection of projects I&apos;ve worked on throughout my career as a
          Full-Stack Software Engineer.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}
