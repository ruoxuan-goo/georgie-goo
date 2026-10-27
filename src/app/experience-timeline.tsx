"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import type { experience } from "./resume";

type Job = (typeof experience)[number];

// One red per role, ordered so neighbouring roles never share a tone. All
// pass 3:1 on white for the large highlight figures.
const ROLE_ACCENTS = [
  "#dc2626",
  "#7f1d1d",
  "#ef4444",
  "#991b1b",
  "#b91c1c",
  "#a34747",
];
const VISIBLE_POINTS = 3;

const toMonth = (ym: string) => {
  const [year, month] = ym.split("-").map(Number);
  return year * 12 + month - 1;
};

// Inclusive month count, e.g. Sep–Nov is 3 mos.
function formatDuration(start: string, end: string) {
  const months = toMonth(end) - toMonth(start) + 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [
    years && `${years} yr${years > 1 ? "s" : ""}`,
    rest && `${rest} mo${rest > 1 ? "s" : ""}`,
  ]
    .filter(Boolean)
    .join(" ");
}

const roleId = (index: number) => `role-${index}`;

/**
 * Experience as a sticky career chart beside role cards. The card crossing
 * the middle of the viewport becomes the active role, which highlights its
 * bar in the chart; clicking a bar scrolls to that role.
 */
export function ExperienceTimeline({
  jobs,
  now,
}: {
  jobs: Job[];
  /** Build month (YYYY-MM) used for current roles. */
  now: string;
}) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 55%", "end 55%"],
  });

  return (
    <div className="grid gap-10 md:grid-cols-[300px_minmax(0,1fr)] md:gap-16">
      <CareerChart
        jobs={jobs}
        now={now}
        active={active}
        onSelect={(index) => {
          setActive(index);
          document.getElementById(roleId(index))?.scrollIntoView();
        }}
      />
      <div className="relative">
        {/* Progress rail: fills in red as you scroll through the roles. */}
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[7px] w-px bg-hairline"
        >
          <motion.div
            className="size-full origin-top bg-red-600"
            style={{ scaleY: scrollYProgress }}
          />
        </div>
        <ol ref={listRef} className="space-y-6">
          {jobs.map((job, index) => (
            <RoleCard
              key={`${job.company}-${job.role}`}
              job={job}
              index={index}
              now={now}
              accent={ROLE_ACCENTS[index % ROLE_ACCENTS.length]}
              isActive={active === index}
              onActive={() => setActive(index)}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

function CareerChart({
  jobs,
  now,
  active,
  onSelect,
}: {
  jobs: Job[];
  now: string;
  active: number;
  onSelect: (index: number) => void;
}) {
  const first = Math.min(...jobs.map((job) => toMonth(job.start)));
  const last = toMonth(now) + 1;
  const toPercent = (month: number) =>
    `${((month - first) / (last - first)) * 100}%`;
  const firstYear = Math.floor(first / 12);
  const years = Array.from(
    { length: Math.floor(last / 12) - firstYear },
    (_, i) => firstYear + i + 1,
  );

  return (
    <div className="self-start md:sticky md:top-24">
      <p className="font-mono text-caption text-body uppercase">
        Career timeline
      </p>
      <div className="relative mt-4 rounded-md bg-canvas p-4 shadow-level-2">
        <div className="relative">
          {years.map((year) => (
            <div
              key={year}
              aria-hidden="true"
              className="absolute top-0 bottom-0 w-px bg-hairline"
              style={{ left: toPercent(year * 12) }}
            />
          ))}
          <ul className="relative">
            {jobs.map((job, index) => {
              const start = toMonth(job.start);
              const end = toMonth(job.end ?? now) + 1;
              const accent = ROLE_ACCENTS[index % ROLE_ACCENTS.length];
              const isActive = active === index;
              return (
                <li key={`${job.company}-${job.role}`}>
                  <button
                    type="button"
                    onClick={() => onSelect(index)}
                    aria-label={`${job.role} at ${job.company}, ${job.period}. Jump to role.`}
                    aria-current={isActive ? "true" : undefined}
                    className="group flex min-h-11 w-full cursor-pointer flex-col justify-center gap-1.5 rounded-xs text-left"
                  >
                    <span
                      className={`font-mono text-caption transition-colors duration-200 ${isActive ? "text-ink" : "text-body group-hover:text-ink"}`}
                    >
                      {job.shortCompany}
                    </span>
                    <span className="relative block h-1.5 w-full">
                      <span
                        className={`absolute inset-y-0 rounded-full transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-30 group-hover:opacity-70"}`}
                        style={{
                          left: toPercent(start),
                          width: `calc(${toPercent(end)} - ${toPercent(start)})`,
                          minWidth: 6,
                          backgroundColor: accent,
                        }}
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div aria-hidden="true" className="relative mt-2 h-4">
          {years.map((year) => (
            <span
              key={year}
              className="absolute -translate-x-1/2 font-mono text-caption text-body"
              style={{ left: toPercent(year * 12) }}
            >
              ’{String(year).slice(2)}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-3 text-caption text-body">
        Select a role to jump to it.
      </p>
    </div>
  );
}

function RoleCard({
  job,
  index,
  now,
  accent,
  isActive,
  onActive,
}: {
  job: Job;
  index: number;
  now: string;
  accent: string;
  isActive: boolean;
  onActive: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  const listId = useId();

  useEffect(() => {
    if (inView) onActive();
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  const extraPoints = job.points.slice(VISIBLE_POINTS);

  return (
    <li ref={ref} id={roleId(index)} className="relative scroll-mt-24 pl-8">
      <motion.span
        aria-hidden="true"
        className="absolute top-7 left-0 size-[15px] rounded-full border-2 border-canvas-soft"
        animate={{
          backgroundColor: isActive ? accent : "#d4d4d4",
          boxShadow: isActive
            ? `0 0 0 4px ${accent}33`
            : "0 0 0 4px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.25 }}
      />
      <article
        className={`rounded-md bg-canvas p-6 transition-shadow duration-200 ${isActive ? "shadow-level-4" : "shadow-level-2"}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div>
            <h3 className="text-display-sm">{job.role}</h3>
            <p className="mt-1 text-body-sm text-body">{job.company}</p>
          </div>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <p className="font-mono text-caption text-body uppercase">
              {job.period}
            </p>
            <p className="flex items-center gap-2 font-mono text-caption text-body">
              {!job.end && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas-soft-2 px-2 py-0.5 text-ink">
                  <span className="size-1.5 rounded-full bg-success" />
                  Current
                </span>
              )}
              {formatDuration(job.start, job.end ?? now)}
            </p>
          </div>
        </div>

        {job.highlight && (
          <p className="mt-5 flex items-baseline gap-3 border-t border-hairline pt-5">
            <span className="text-display-md" style={{ color: accent }}>
              {job.highlight.value}
            </span>
            <span className="text-body-sm text-body">
              {job.highlight.label}
            </span>
          </p>
        )}

        <ul className="mt-5 flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-canvas-soft-2 px-2 py-1 font-mono text-caption text-body"
            >
              {tag}
            </li>
          ))}
        </ul>

        <ul id={listId} className="mt-5 space-y-2 text-body-md text-body">
          {job.points.slice(0, VISIBLE_POINTS).map((point) => (
            <RolePoint key={point} point={point} />
          ))}
          <AnimatePresence initial={false}>
            {expanded &&
              extraPoints.map((point) => (
                <motion.li
                  key={point}
                  className="flex gap-3 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                >
                  <PointMarker />
                  {point}
                </motion.li>
              ))}
          </AnimatePresence>
        </ul>

        {extraPoints.length > 0 && (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => setExpanded((value) => !value)}
            className="relative mt-5 inline-flex h-9 cursor-pointer items-center rounded-pill bg-canvas px-4 text-button-md text-ink shadow-level-2 transition-colors duration-200 before:absolute before:inset-x-0 before:-inset-y-1 hover:bg-canvas-soft-2"
          >
            {expanded
              ? "Show less"
              : `Show all ${job.points.length} highlights`}
          </button>
        )}
      </article>
    </li>
  );
}

function RolePoint({ point }: { point: string }) {
  return (
    <li className="flex gap-3">
      <PointMarker />
      {point}
    </li>
  );
}

function PointMarker() {
  return (
    <span
      aria-hidden="true"
      className="mt-2.5 size-1 shrink-0 rounded-full bg-hairline-strong"
    />
  );
}
