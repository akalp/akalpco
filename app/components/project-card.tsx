"use client";

import { Project } from "@/app/types/portfolio";
import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-muted bg-background p-6 hover:border-primary"
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm text-secondary">{project.description}</p>
      </div>

      <div className="mt-auto">
        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 11).map((tech) => (
            <span
              key={tech.name}
              className="rounded-full bg-muted px-3 py-1 text-xs text-secondary"
            >
              {tech.name}
            </span>
          ))}
          {project.technologies.length > 11 && (
            <div className="group-hover:hidden">
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-secondary">
                +{project.technologies.length - 11} more
              </span>
            </div>
          )}
          {project.technologies.slice(11).map((tech) => (
            <span
              key={tech.name}
              className="hidden rounded-full bg-muted px-3 py-1 text-xs text-secondary group-hover:inline-block"
            >
              {tech.name}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {project.github && (
            <Link
              href={project.github}
              className="text-secondary hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
            </Link>
          )}
          {project.link && (
            <Link
              href={project.link}
              className="text-secondary hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
