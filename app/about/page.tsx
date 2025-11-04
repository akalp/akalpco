import ExportedImage from "next-image-export-optimizer";
import { aboutMetadata } from "../config/metadata";

export const metadata = aboutMetadata;

const technologies = {
  languages: ["JavaScript", "TypeScript", "Python", "Java", "Go"],
  frontend: [
    "React",
    "Next.js",
    "Vue.js",
    "Tailwind CSS",
    "Radix UI",
    "Bootstrap",
  ],
  backend: ["Node.js", "Spring Boot", "Django", "FastAPI"],
  databases: ["PostgreSQL", "MySQL", "Firestore"],
  devops: [
    "Docker",
    "Kubernetes",
    "Helm",
    "GitLab CI/CD",
    "Bash",
    "PowerShell",
  ],
  cloud: ["Firebase", "BigQuery", "Cloud Functions"],
};

export default function AboutPage() {
  return (
    <div className="container-width py-6 md:py-12">
      {/* Hero Section */}
      <section className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="heading-1 mb-6">About Me</h1>
          <p className="body-text mb-8">
            Results-driven Full-Stack Software Engineer with 4+ years of
            experience in designing and deploying scalable web applications.
            Skilled in modern technologies and DevOps practices, with a proven
            track record in optimizing workflows and improving system
            performance.
          </p>
        </div>
        <div className="relative aspect-square lg:aspect-video">
          <ExportedImage
            src="/images/hasan.webp"
            alt="Hasan Akalp"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="rounded-2xl object-cover"
          />
        </div>
      </section>

      {/* Technologies Section */}
      <section className="mb-16">
        <h2 className="heading-2 mb-8">Technologies</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(technologies).map(([category, items]) => (
            <div
              key={category}
              className="rounded-lg border border-muted bg-background p-6"
            >
              <h3 className="mb-4 text-lg font-semibold capitalize">
                {category}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-muted px-3 py-1 text-sm text-secondary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Information */}
      <section>
        <h2 className="heading-2 mb-8">Additional Information</h2>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-lg border border-muted bg-background p-6">
            <h3 className="mb-4 text-lg font-semibold">Languages</h3>
            <ul className="space-y-2">
              <li className="text-secondary">Native Turkish</li>
              <li className="text-secondary">Fluent English</li>
            </ul>
          </div>
          <div className="rounded-lg border border-muted bg-background p-6">
            <h3 className="mb-4 text-lg font-semibold">Interests</h3>
            <p className="text-secondary">
              Exploring new technologies, engaging in strategy and RPG video
              games, brewing specialty coffee, and perfecting homemade burgers
              and desserts. Passionate about combining creativity and precision
              in both personal and professional pursuits.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
