"use client";

import { Project } from "@/types/portfolio";
import Link from "next/link";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { motion } from "motion/react";

const VISIBLE_TECH_SIZE = 11;

export function ProjectCard({ project }: { project: Project }) {
  const hasLinks = Boolean(project.github || project.link);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-muted bg-background p-6 hover:border-primary"
    >
      <div className="flex h-full flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <p className="mt-2 text-sm text-secondary">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, VISIBLE_TECH_SIZE).map((tech) => (
            <span
              key={tech.name}
              className="rounded-full bg-muted px-3 py-1 text-xs text-secondary"
            >
              {tech.name}
            </span>
          ))}
          {project.technologies.length > VISIBLE_TECH_SIZE && (
            <div className="group-hover:hidden">
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-secondary">
                +{project.technologies.length - VISIBLE_TECH_SIZE} more
              </span>
            </div>
          )}
          {project.technologies.slice(VISIBLE_TECH_SIZE).map((tech) => (
            <span
              key={tech.name}
              className="hidden rounded-full bg-muted px-3 py-1 text-xs text-secondary group-hover:inline-block"
            >
              {tech.name}
            </span>
          ))}
        </div>

        {hasLinks && (
          <div className="mt-auto flex justify-end gap-4 pt-4">
            {project.github && (
              <Link
                href={project.github}
                className="text-secondary hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiGithub className="h-5 w-5" />
              </Link>
            )}
            {project.link && (
              <Link
                href={project.link}
                className="text-secondary hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiExternalLink className="h-5 w-5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
