"use client";

import {
  MotionConfig,
  motion,
  useAnimate,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  gridAspectRatio,
  logoGridLayouts,
  type LogoGridCell,
  type LogoGridLayout,
} from "./logo-grid-layouts";

const REST_FILL = { strong: "#dcdcdc", soft: "#e8e8e8" };

export function InteractiveLogoGrid({ className }: { className?: string }) {
  // Reduced motion: no scale anywhere, and colour changes become quick fades.
  const reduceMotion = useReducedMotion() ?? false;
  // Bumped by the top-right cell; every cell replays its pulse when it
  // changes, so activating again restarts the wave instead of stacking one.
  const [pulseId, setPulseId] = useState(0);

  return (
    <MotionConfig
      transition={
        reduceMotion
          ? { duration: 0.15, ease: "linear" }
          : { duration: 0.25, ease: "easeOut" }
      }
    >
      <div className={className}>
        <p id="logo-grid-help" className="sr-only">
          Use the arrow keys to move between logo fragments, and Enter or Space
          to highlight one. The top-right cell sends a pulse through the grid.
        </p>
        {logoGridLayouts.map((layout) => (
          <LogoGridComposition
            key={layout.name}
            layout={layout}
            pulseId={pulseId}
            onPulse={() => setPulseId((id) => id + 1)}
          />
        ))}
      </div>
    </MotionConfig>
  );
}

function LogoGridComposition({
  layout,
  pulseId,
  onPulse,
}: {
  layout: LogoGridLayout;
  pulseId: number;
  onPulse: () => void;
}) {
  const fragmentCells = layout.cells.filter(
    (c) => c.namedParts.length && !c.pulseTrigger,
  );
  const interactiveCells = layout.cells.filter(
    (c) => c.pulseTrigger || fragmentCells.includes(c),
  );
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState(0);

  // Roving tabindex: one tab stop for the grid, arrow keys move inside it.
  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = interactiveCells.length - 1;
    const next = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const target = Math.min(Math.max(next, 0), last);
    setFocusIndex(target);
    cellRefs.current[target]?.focus();
  };

  return (
    <div
      role="group"
      aria-label="Interactive logo grid"
      aria-describedby="logo-grid-help"
      className={`${layout.visibility} gap-px border border-hairline bg-hairline`}
      style={{
        aspectRatio: gridAspectRatio(layout),
        gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
        gridTemplateAreas: layout.templateAreas,
      }}
    >
      {layout.cells.map((cell) => {
        const index = interactiveCells.indexOf(cell);
        return (
          <LogoGridCellRegion
            key={cell.area}
            cell={cell}
            logoTransform={layout.logoTransform}
            pulseFlash={layout.pulseFlash}
            pulseId={pulseId}
            onPulse={onPulse}
            label={
              cell.pulseTrigger
                ? "Pulse the logo grid"
                : index >= 0
                  ? `Logo fragment ${fragmentCells.indexOf(cell) + 1} of ${fragmentCells.length}: ${cell.namedParts.map((p) => p.label).join(" and ")}`
                  : undefined
            }
            tabIndex={index === focusIndex ? 0 : -1}
            cellRef={(el) => {
              if (index >= 0) cellRefs.current[index] = el;
            }}
            onFocus={() => index >= 0 && setFocusIndex(index)}
            onKeyDown={(event) => index >= 0 && onKeyDown(event, index)}
          />
        );
      })}
    </div>
  );
}

function LogoGridCellRegion({
  cell,
  logoTransform,
  pulseFlash,
  pulseId,
  onPulse,
  label,
  tabIndex,
  cellRef,
  onFocus,
  onKeyDown,
}: {
  cell: LogoGridCell;
  logoTransform: string;
  pulseFlash: number;
  pulseId: number;
  onPulse: () => void;
  label?: string;
  tabIndex: number;
  cellRef: (el: HTMLDivElement | null) => void;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
}) {
  // Tapping (or Enter/Space) pins the highlight, so touch users get a
  // selected state that does not depend on hover. The top-right cell starts
  // the pulse instead.
  const [pressed, setPressed] = useState(false);
  const activate = () =>
    cell.pulseTrigger ? onPulse() : setPressed((value) => !value);
  const interactive = Boolean(label);
  const restFill = cell.soft ? REST_FILL.soft : REST_FILL.strong;

  // Pulse: an overlay in the cell's accent fades in and out after the cell's
  // distance-based delay. It sits above the cell's own state, so hover and
  // pinned states are untouched and each cell returns to exactly where it
  // was. Re-triggering restarts the overlay animation rather than stacking.
  const reduceMotion = useReducedMotion() ?? false;
  const [pulseScope, animatePulse] = useAnimate<HTMLDivElement>();
  useEffect(() => {
    if (!pulseId) return;
    animatePulse(
      pulseScope.current,
      { opacity: reduceMotion ? [0, 0.6, 0] : [0, 1, 0] },
      reduceMotion
        ? { duration: 0.4, ease: "easeInOut" }
        : {
            delay: cell.pulseDelay / 1000,
            duration: pulseFlash / 1000,
            times: [0, 0.3, 1],
            ease: "easeInOut",
          },
    );
  }, [pulseId]); // eslint-disable-line react-hooks/exhaustive-deps

  const cellVariants: Variants = {
    rest: {
      backgroundColor: "#fafafa",
      boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0)",
    },
    active: {
      backgroundColor: "var(--cell-tint)",
      boxShadow: "inset 0 0 0 1px var(--cell-accent)",
    },
  };
  // Fragments only fade, never scale, so pinned cells stay aligned with
  // their neighbours and the logo reads as one shape.
  const fragmentVariants: Variants = {
    rest: { opacity: 0.92 },
    active: { opacity: cell.soft ? 0.5 : 1 },
  };
  const pathVariants: Variants = {
    rest: { fill: restFill },
    active: { fill: "var(--cell-accent)" },
  };

  return (
    <motion.div
      ref={cellRef}
      role={interactive ? "button" : undefined}
      aria-label={label}
      aria-pressed={interactive && !cell.pulseTrigger ? pressed : undefined}
      aria-hidden={interactive ? undefined : true}
      tabIndex={interactive ? tabIndex : undefined}
      className="relative cursor-pointer overflow-hidden outline-offset-[-2px] focus-visible:z-10"
      style={
        {
          gridArea: cell.area,
          "--cell-accent": cell.accent,
          "--cell-tint": cell.tint,
        } as CSSProperties
      }
      initial="rest"
      animate={pressed ? "active" : "rest"}
      whileHover="active"
      whileFocus="active"
      // Motion makes whileTap elements focusable, so only interactive cells
      // get it; decorative cells still pin via onClick.
      whileTap={interactive ? "active" : undefined}
      variants={cellVariants}
      onClick={activate}
      onFocus={onFocus}
      onKeyDown={(event) => {
        if (interactive && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          activate();
        }
        onKeyDown(event);
      }}
    >
      <CellFragment
        cell={cell}
        logoTransform={logoTransform}
        variants={fragmentVariants}
        pathVariants={pathVariants}
      />
      <div
        ref={pulseScope}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-(--cell-tint) opacity-0 shadow-[inset_0_0_0_1px_var(--cell-accent)]"
      >
        <CellFragment
          cell={cell}
          logoTransform={logoTransform}
          variants={{}}
          fill="var(--cell-accent)"
          opacity={cell.soft ? 0.5 : 1}
        />
      </div>
    </motion.div>
  );
}

// The cell's slice of the logo: the full logo paths drawn in the shared
// coordinate space, clipped to this cell by its viewBox.
function CellFragment({
  cell,
  logoTransform,
  variants,
  pathVariants,
  fill,
  opacity,
}: {
  cell: LogoGridCell;
  logoTransform: string;
  variants: Variants;
  pathVariants?: Variants;
  fill?: string;
  opacity?: number;
}) {
  if (!cell.parts.length) return null;
  return (
    <motion.div
      className="absolute inset-0"
      variants={variants}
      style={{ opacity }}
    >
      <svg
        viewBox={cell.viewBox}
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block size-full"
      >
        <g transform={logoTransform}>
          {cell.parts.map((part) => (
            <motion.path
              key={part.id}
              d={part.d}
              // CSS variables only resolve in style, not the fill attribute.
              style={fill ? { fill } : undefined}
              variants={pathVariants}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
}
