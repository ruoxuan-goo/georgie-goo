"use client";

import {
  MotionConfig,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
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
          to highlight one.
        </p>
        {logoGridLayouts.map((layout) => (
          <LogoGridComposition key={layout.name} layout={layout} />
        ))}
      </div>
    </MotionConfig>
  );
}

function LogoGridComposition({ layout }: { layout: LogoGridLayout }) {
  const interactiveCells = layout.cells.filter((c) => c.namedParts.length);
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
            label={
              index >= 0
                ? `Logo fragment ${index + 1} of ${interactiveCells.length}: ${cell.namedParts.map((p) => p.label).join(" and ")}`
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
  label,
  tabIndex,
  cellRef,
  onFocus,
  onKeyDown,
}: {
  cell: LogoGridCell;
  logoTransform: string;
  label?: string;
  tabIndex: number;
  cellRef: (el: HTMLDivElement | null) => void;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
}) {
  // Tapping (or Enter/Space) pins the highlight, so touch users get a
  // selected state that does not depend on hover.
  const [pressed, setPressed] = useState(false);
  const interactive = Boolean(label);
  const restFill = cell.soft ? REST_FILL.soft : REST_FILL.strong;

  const cellVariants: Variants = {
    rest: {
      backgroundColor: "#fafafa",
      boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0)",
    },
    active: {
      backgroundColor: "var(--cell-tint)",
      boxShadow: "inset 0 0 0 1px var(--cell-shade)",
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
    active: { fill: "var(--cell-shade)" },
  };

  return (
    <motion.div
      ref={cellRef}
      role={interactive ? "button" : undefined}
      aria-label={label}
      aria-pressed={interactive ? pressed : undefined}
      aria-hidden={interactive ? undefined : true}
      tabIndex={interactive ? tabIndex : undefined}
      className="relative cursor-pointer overflow-hidden outline-offset-[-2px] focus-visible:z-10"
      style={
        {
          gridArea: cell.area,
          "--cell-shade": cell.shade,
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
      onClick={() => setPressed((value) => !value)}
      onFocus={onFocus}
      onKeyDown={(event) => {
        if (interactive && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          setPressed((value) => !value);
        }
        onKeyDown(event);
      }}
    >
      {cell.parts.length > 0 && (
        <motion.div className="absolute inset-0" variants={fragmentVariants}>
          <svg
            viewBox={cell.viewBox}
            preserveAspectRatio="none"
            aria-hidden="true"
            className="block size-full"
          >
            <g transform={logoTransform}>
              {cell.parts.map((part) => (
                <motion.path key={part.id} d={part.d} variants={pathVariants} />
              ))}
            </g>
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}
