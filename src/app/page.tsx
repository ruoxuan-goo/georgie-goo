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

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="#top" className="font-bold tracking-tight text-slate-900">
            Georgie<span className="text-teal-600">.</span>
          </a>
          <nav className="hidden gap-8 text-sm font-medium text-slate-600 sm:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-teal-600"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600"
          >
            Get in touch
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-teal-500/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-48 left-[-10%] h-[28rem] w-[28rem] rounded-full bg-indigo-500/30 blur-3xl"
          />
          <div className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-teal-200">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              {profile.location}
            </p>
            <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-7xl">
              Hi, I&apos;m {profile.preferredName}.
            </h1>
            <p className="mt-3 text-lg text-slate-400">{profile.name}</p>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-300 sm:text-2xl">
              Full-stack & UI engineer building fast, accessible,
              customer-facing products with React, TypeScript and Next.js.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#experience"
                className="rounded-full bg-teal-500 px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-teal-400"
              >
                View my work
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                LinkedIn
              </a>
            </div>
            <dl className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { value: "4+", label: "Years building for the web" },
                { value: "100+", label: "Defects resolved at Westpac" },
                { value: "120k+", label: "App installs shipped" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse justify-end gap-1">
                  <dt className="text-sm text-slate-400">{stat.label}</dt>
                  <dd className="text-3xl font-bold text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* About & skills */}
        <Section id="about" eyebrow="About" title="Profile & skills">
          <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
            {profile.summary}
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {skills.map((group) => (
              <div
                key={group.group}
                className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${
                  group.items.length > 10 ? "sm:col-span-2" : ""
                }`}
              >
                <h3 className="font-semibold text-slate-900">{group.group}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <div className="bg-slate-50">
          <Section id="experience" eyebrow="Experience" title="Where I've worked">
            <ol className="relative space-y-12 border-l border-slate-200 pl-8">
              {experience.map((job) => (
                <li key={`${job.company}-${job.role}`} className="relative">
                  <span className="absolute -left-[2.4rem] top-1.5 h-4 w-4 rounded-full border-4 border-slate-50 bg-teal-500" />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {job.role}{" "}
                      <span className="font-normal text-teal-700">
                        · {job.company}
                      </span>
                    </h3>
                    <p className="shrink-0 text-sm font-medium text-slate-500">
                      {job.period}
                    </p>
                  </div>
                  <ul className="mt-4 space-y-2 text-slate-600">
                    {job.points.map((point) => (
                      <li key={point} className="flex gap-3 leading-relaxed">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        {/* Projects */}
        <Section id="projects" eyebrow="Projects" title="Selected work">
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.name}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="text-sm font-medium text-slate-500">
                  {project.year}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  {project.name}
                </h3>
                <p className="mt-3 flex-1 leading-relaxed text-slate-600">
                  {project.description}
                </p>
                {project.highlight && (
                  <p className="mt-4 text-sm font-semibold text-teal-700">
                    {project.highlight}
                  </p>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm font-semibold text-slate-900 underline decoration-teal-500 decoration-2 underline-offset-4 hover:text-teal-700"
                  >
                    {project.linkLabel} →
                  </a>
                )}
              </article>
            ))}
          </div>
        </Section>

        {/* Education, leadership, achievements */}
        <div className="bg-slate-50">
          <Section id="education" eyebrow="Education" title="Learning & leadership">
            <div className="grid gap-6 md:grid-cols-2">
              {education.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-sm font-medium text-slate-500">
                    {item.period}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  {item.school && (
                    <p className="mt-1 text-teal-700">{item.school}</p>
                  )}
                  <p className="mt-3 text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 grid gap-12 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Leadership
                </h3>
                <ul className="mt-6 space-y-6">
                  {leadership.map((item) => (
                    <li key={item.title}>
                      <p className="font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-500">{item.period}</p>
                      <p className="mt-2 leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Achievements
                </h3>
                <ul className="mt-6 space-y-4">
                  {achievements.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed text-slate-600">
                      <span className="text-teal-600" aria-hidden>
                        ★
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </div>

        {/* Contact */}
        <section id="contact" className="scroll-mt-20 bg-slate-950 text-white">
          <div className="mx-auto max-w-5xl px-6 py-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Let&apos;s build something meaningful.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              I&apos;m always happy to chat about engineering, design systems
              and digital transformation. References available upon request.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="rounded-full bg-teal-500 px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-teal-400"
              >
                {profile.email}
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-6 py-3 font-semibold transition-colors hover:bg-white/10"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 pb-10 text-center text-sm text-slate-500">
        © {profile.name} ({profile.preferredName})
      </footer>
    </>
  );
}
