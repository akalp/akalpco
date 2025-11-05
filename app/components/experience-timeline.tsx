import { experiences } from "@/app/data/experience";

export function ExperienceTimeline() {
  if (!experiences.length) return null;

  return (
    <section className="mb-16">
      <h2 className="heading-2 mb-8">Experience</h2>
      <ol className="relative border-s border-dashed border-muted">
        {experiences.map((exp, idx) => (
          <li key={`${exp.company}-${exp.role}-${idx}`} className="relative mb-10 ps-6">
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border border-background bg-primary" />

            <div className="rounded-lg border border-muted bg-background p-6">
              <div className="mb-2 flex flex-wrap items-baseline gap-2">
                {exp.link ? (
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-lg font-semibold hover:text-primary"
                  >
                    {exp.company}
                  </a>
                ) : (
                  <h3 className="text-lg font-semibold">{exp.company}</h3>
                )}
                <span className="text-secondary">·</span>
                <span className="text-secondary">{exp.role}</span>
              </div>

              <div className="mb-4 text-sm text-secondary">
                <span>
                  {exp.start} — {exp.end}
                </span>
                {exp.location ? (
                  <span className="ms-2">• {exp.location}</span>
                ) : null}
              </div>

              <ul className="ms-4 list-disc space-y-2 text-sm text-secondary">
                {exp.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
