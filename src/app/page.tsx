import { InteractiveLogoGrid } from "./interactive-logo-grid";
import {
  achievements,
  education,
  experience,
  leadership,
  profile,
  projects,
  skills,
} from "./resume";

const nav = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

const stats = [
  { value: "5+", label: "Years building for the web" },
  { value: "100+", label: "Defects resolved at Westpac" },
  { value: "120k+", label: "App installs shipped" },
];

const container = "mx-auto w-full max-w-[1200px] px-4 sm:px-6";
const eyebrow = "font-mono text-caption uppercase text-body";
const card = "rounded-md bg-canvas p-6 shadow-level-3";
const pillPrimary =
  "inline-flex h-12 items-center rounded-pill bg-ink px-6 text-button-lg text-white transition-colors duration-200 hover:bg-[#383838]";
const pillSecondary =
  "inline-flex h-12 items-center rounded-pill bg-canvas px-6 text-button-lg text-ink shadow-level-2 transition-colors duration-200 hover:bg-canvas-soft-2";

function Section({
  id,
  label,
  title,
  surface = "bg-canvas-soft",
  children,
}: {
  id: string;
  label: string;
  title: string;
  surface?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-16 py-16 sm:py-24 ${surface}`}>
      <div className={container}>
        <p className={eyebrow}>{label}</p>
        <h2 className="mt-3 text-display-lg">{title}</h2>
        <div className="mt-10 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-canvas/70 backdrop-blur-xl backdrop-saturate-150">
        <div className={`${container} flex h-16 items-center gap-4`}>
          <a
            href="#top"
            className="text-body-md font-semibold tracking-[-0.32px] text-ink"
          >
            Georgie Goo
          </a>
          <nav aria-label="Sections" className="mx-auto hidden md:block">
            <ul className="flex">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex h-11 items-center rounded-full px-3 text-body-sm text-body transition-colors duration-200 hover:bg-canvas-soft-2 hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href={`mailto:${profile.email}`}
            className="relative ml-auto inline-flex h-9 items-center rounded-pill bg-ink px-4 text-button-md text-white transition-colors duration-200 before:absolute before:inset-x-0 before:-inset-y-1 hover:bg-[#383838] md:ml-0"
          >
            Get in touch
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero: copy and the logo grid share one grid area from desktop up;
            below that they stack so nothing sits behind the copy. */}
        <section className="overflow-hidden bg-canvas-soft py-12 sm:py-16 md:py-24">
          <div className={`${container} grid`}>
            <div className="pointer-events-none relative z-10 [grid-area:1/1] md:w-1/2 md:self-center md:py-12 md:pl-10 lg:pl-12 [&_a]:pointer-events-auto">
              <p className="inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-1 font-mono text-caption text-body shadow-level-1">
                <span className="size-2 rounded-full bg-success" />
                Engineer at Westpac · {profile.location}
              </p>
              <h1 className="mt-6 text-display-xl max-sm:text-[40px] max-sm:leading-[40px] max-sm:tracking-[-2px]">
                Hi, I&apos;m {profile.preferredName}.
              </h1>
              <p className="mt-4 max-w-[34rem] text-body-lg text-body">
                I&apos;m a full-stack and UI engineer building fast, accessible,
                customer-facing products with React, TypeScript and Next.js.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#experience" className={pillPrimary}>
                  View my work
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={pillSecondary}
                >
                  LinkedIn
                </a>
              </div>
              <dl className="mt-10 grid max-w-[34rem] grid-cols-3 gap-4 border-t border-hairline pt-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col-reverse justify-end gap-1"
                  >
                    <dt className={eyebrow}>{stat.label}</dt>
                    <dd className="text-display-md">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <InteractiveLogoGrid className="z-0 mt-12 md:mt-0 md:[grid-area:1/1]" />
          </div>
        </section>

        <Section
          id="about"
          label="About"
          title="Profile and skills."
          surface="bg-canvas border-t border-hairline"
        >
          <p className="max-w-3xl text-body-lg text-body">{profile.summary}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {skills.map((group) => (
              <div
                key={group.group}
                className={`${card} ${group.items.length > 10 ? "sm:col-span-2" : ""}`}
              >
                <h3 className="text-display-sm">{group.group}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-canvas-soft-2 px-2 py-1 font-mono text-caption text-body"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="experience" label="Experience" title="Where I've worked.">
          <ol className="border-t border-hairline">
            {experience.map((job) => (
              <li
                key={`${job.company}-${job.role}`}
                className="grid gap-2 border-b border-hairline py-8 md:grid-cols-[200px_1fr] md:gap-8"
              >
                <p className={`${eyebrow} md:pt-1.5`}>{job.period}</p>
                <div>
                  <h3 className="text-display-sm">{job.role}</h3>
                  <p className="mt-1 text-body-sm text-body">{job.company}</p>
                  <ul className="mt-4 space-y-2 text-body-md text-body">
                    {job.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2.5 size-1 shrink-0 rounded-full bg-hairline-strong"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          id="projects"
          label="Projects"
          title="Selected work."
          surface="bg-canvas border-y border-hairline"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <article key={project.name} className={`${card} flex flex-col`}>
                <p className={eyebrow}>{project.year}</p>
                <h3 className="mt-2 text-display-sm">{project.name}</h3>
                <p className="mt-3 flex-1 text-body-md text-body">
                  {project.description}
                </p>
                {project.highlight && (
                  <p className="mt-4 font-mono text-caption text-ink">
                    {project.highlight}
                  </p>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link mt-4 inline-flex min-h-11 items-center self-start text-body-sm font-medium"
                  >
                    {project.linkLabel} →
                  </a>
                )}
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="education"
          label="Education"
          title="Learning and leadership."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {education.map((item) => (
              <div key={item.title} className={card}>
                <p className={eyebrow}>{item.period}</p>
                <h3 className="mt-2 text-display-sm">{item.title}</h3>
                {item.school && (
                  <p className="mt-1 text-body-sm text-body">{item.school}</p>
                )}
                <p className="mt-3 font-mono text-caption text-body">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <div>
              <h3 className="text-display-md">Leadership</h3>
              <ul className="mt-6 border-t border-hairline">
                {leadership.map((item) => (
                  <li
                    key={item.title}
                    className="border-b border-hairline py-5"
                  >
                    <p className={eyebrow}>{item.period}</p>
                    <p className="mt-2 text-body-md font-medium">
                      {item.title}
                    </p>
                    <p className="mt-2 text-body-md text-body">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-display-md">Achievements</h3>
              <ul className="mt-6 border-t border-hairline">
                {achievements.map((item) => (
                  <li
                    key={item}
                    className="border-b border-hairline py-5 text-body-md text-body"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <section id="contact" className="scroll-mt-16 bg-ink py-24 text-white">
          <div className={`${container} text-center`}>
            <p className="font-mono text-caption text-[#a1a1a1] uppercase">
              Contact
            </p>
            <h2 className="mt-3 text-display-lg">
              Let&apos;s build something meaningful.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-body-lg text-[#a1a1a1]">
              I&apos;m always happy to chat about engineering, design systems
              and digital transformation. References available upon request.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex h-12 items-center rounded-pill bg-canvas px-6 text-button-lg text-ink transition-colors duration-200 hover:bg-canvas-soft-2"
              >
                Email me
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-pill px-6 text-button-lg text-white shadow-[inset_0_0_0_1px_#ffffff3d] transition-colors duration-200 hover:bg-white/10"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline bg-canvas py-10">
        <div
          className={`${container} flex flex-col gap-2 text-body-sm text-body sm:flex-row sm:justify-between`}
        >
          <p>© {profile.name}</p>
          <p className="flex gap-6">
            <a href={`mailto:${profile.email}`} className="link">
              {profile.email}
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
