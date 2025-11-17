import { projects } from "@/app/data/projects";
import { ProjectCard } from "@/app/components/project-card";
import { portfolioMetadata } from "@/app/config/metadata";

export const metadata = portfolioMetadata;

export default function PortfolioPage() {
  const professionalProjects = projects.filter(
    (project) => project.category === "professional"
  );
  const personalProjects = projects.filter(
    (project) => project.category === "personal"
  );

  return (
    <div className="container-width py-6 md:py-12">
      <div className="mb-12">
        <h1 className="heading-1 mb-6">Portfolio</h1>
        <p className="body-text max-w-2xl">
          A collection of projects I&apos;ve worked on throughout my career.
        </p>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="heading-2 mb-4">Professional Projects</h2>
          <p className="body-text text-secondary">
            Work completed while doing freelance or contract engagements for
            clients or employers.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {professionalProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-6">
        <div>
          <h2 className="heading-2 mb-4">Personal Projects</h2>
          <p className="body-text text-secondary">
            Experimentation, hobbies, and side projects that demonstrate my
            interests outside of client work.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {personalProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
