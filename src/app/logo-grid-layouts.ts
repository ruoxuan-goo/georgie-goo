import { logoParts, type LogoPart, type Point } from "./westpac-logo";

// Each layout is a CSS grid-template-areas map. The logo is drawn once in a
// shared coordinate space (100 units per column, 75 per row) and every cell
// shows only its own slice, so the cells read as one connected logo.
const COLUMN_UNITS = 100;
const ROW_UNITS = 75;

// Pulse: clicking the grid's top-right cell sends a wave outward from that
// corner, moving ~40ms per column of distance. Each
// cell's flash is sized so the whole wave lasts about 700ms on every layout.
const PULSE_MS_PER_COLUMN = 40;
const PULSE_TOTAL_MS = 700;
const PULSE_MIN_FLASH_MS = 320;

type LogoGridLayoutConfig = {
  name: string;
  /** Tailwind classes that show this layout only at its breakpoint. */
  visibility: string;
  areas: string[];
  /** Logo placement in grid units: offset and uniform scale. */
  logo: { x: number; y: number; scale: number };
  /** Columns covered by hero copy; cells starting here use softer reds. */
  textColumns: number;
};

const layoutConfigs: LogoGridLayoutConfig[] = [
  {
    name: "wide",
    visibility: "hidden lg:grid",
    logo: { x: 397, y: 137.5, scale: 2.5 },
    textColumns: 6,
    areas: [
      "A A A B C C D D E F F G",
      "A A A H C C I J E K L G",
      "M M N H O P I J Q K L R",
      "M M N S O P T T Q U U R",
      "V W W S X X T T Y U U Z",
      "V W W a X X b c Y d e Z",
      "f f g a h i b c j d e k",
      "f f g l h i m m j n n k",
    ],
  },
  {
    name: "desktop",
    visibility: "hidden md:grid lg:hidden",
    logo: { x: 340, y: 132.5, scale: 2 },
    textColumns: 5,
    areas: [
      "A A B C C D E E F F",
      "A A B G H D I J K L",
      "M M N G H O I J K L",
      "M M N P P O Q R S S",
      "T U U P P V Q R S S",
      "T U U W X V Y Z a b",
      "c c d W X e Y Z a b",
    ],
  },
  {
    name: "tablet",
    visibility: "hidden sm:grid md:hidden",
    logo: { x: 44, y: 46, scale: 1.6 },
    textColumns: 0,
    areas: ["A B B C D D", "A E F C G H", "I E F J G H", "I K K J L L"],
  },
  {
    name: "mobile",
    visibility: "grid sm:hidden",
    logo: { x: 24, y: 41, scale: 1.1 },
    textColumns: 0,
    areas: ["A B B C", "D E F C", "D G G H"],
  },
];

// Strong tones for open areas; cells behind hero copy use lighter tones,
// drawn at reduced opacity so body text keeps AA contrast.
const strongReds = [
  "#7f1d1d", // burgundy (red-900)
  "#dc2626", // scarlet (red-600)
  "#fb7185", // coral (red-400)
  "#991b1b", // deep red (red-800)
  "#ef4444", // red-500
  "#a34747", // muted red
  "#b91c1c", // crimson (red-700)
  "#fda4af", // pale red (red-300)
];
const softReds = ["#fecdd3", "#fda4af", "#ffe4e6", "#fb7185"];

export type LogoGridCell = {
  area: string;
  viewBox: string;
  /** Logo parts drawn in this cell (any overlap, so edges stay continuous). */
  parts: LogoPart[];
  /** Parts with a meaningful share of the cell; these make it interactive. */
  namedParts: LogoPart[];
  accent: string;
  tint: string;
  soft: boolean;
  /** Pulse start (ms), by distance from the grid's top-right corner. */
  pulseDelay: number;
  /** The top-right cell, which starts the pulse when activated. */
  pulseTrigger: boolean;
};

export type LogoGridLayout = {
  name: string;
  visibility: string;
  columns: number;
  rows: number;
  templateAreas: string;
  logoTransform: string;
  cells: LogoGridCell[];
  /** How long each cell stays lit during the pulse (ms). */
  pulseFlash: number;
};

export const logoGridLayouts: LogoGridLayout[] = layoutConfigs.map(buildLayout);

function buildLayout(config: LogoGridLayoutConfig): LogoGridLayout {
  const grid = config.areas.map((row) => row.trim().split(/\s+/));
  const rows = grid.length;
  const columns = grid[0].length;

  const rects = new Map<string, Rect>();
  grid.forEach((row, r) =>
    row.forEach((area, c) => {
      const rect = rects.get(area);
      if (!rect) rects.set(area, { c0: c, r0: r, c1: c + 1, r1: r + 1 });
      else {
        rect.c1 = Math.max(rect.c1, c + 1);
        rect.r1 = Math.max(rect.r1, r + 1);
      }
    }),
  );

  const { x, y, scale } = config.logo;
  const outlines = logoParts.map((part) =>
    part.outline.map(([px, py]): Point => [x + px * scale, y + py * scale]),
  );

  const cells: LogoGridCell[] = [];
  const shades = new Map<string, string>();
  [...rects.entries()].forEach(([area, rect]) => {
    const box = {
      x: rect.c0 * COLUMN_UNITS,
      y: rect.r0 * ROW_UNITS,
      w: (rect.c1 - rect.c0) * COLUMN_UNITS,
      h: (rect.r1 - rect.r0) * ROW_UNITS,
    };
    const overlaps = outlines.map((outline) => clippedArea(outline, box));
    const soft = rect.c0 < config.textColumns;

    // Greedy colouring in reading order: never reuse a shade from a cell
    // sharing an edge, and prefer the least-used shade so tones stay balanced.
    const palette = soft ? softReds : strongReds;
    const taken = new Set(
      [...rects.entries()]
        .filter(([other, o]) => other !== area && sharesEdge(rect, o))
        .map(([other]) => shades.get(other)),
    );
    const uses = (shade: string) =>
      [...shades.values()].filter((used) => used === shade).length;
    const shade = palette
      .filter((candidate) => !taken.has(candidate))
      .reduce((best, candidate) =>
        uses(candidate) < uses(best) ? candidate : best,
      );
    shades.set(area, shade);

    const distance = Math.hypot(
      columns * COLUMN_UNITS - (box.x + box.w / 2),
      box.y + box.h / 2,
    );

    cells.push({
      area,
      viewBox: `${box.x} ${box.y} ${box.w} ${box.h}`,
      parts: logoParts.filter((_, i) => overlaps[i] > 0),
      namedParts: logoParts.filter((_, i) => overlaps[i] > box.w * box.h * 0.1),
      accent: shade,
      tint: mix(shade, "#fafafa", soft ? 0.18 : 0.1),
      soft,
      pulseDelay: Math.round((distance / COLUMN_UNITS) * PULSE_MS_PER_COLUMN),
      pulseTrigger: rect.r0 === 0 && rect.c1 === columns,
    });
  });

  return {
    name: config.name,
    visibility: config.visibility,
    columns,
    rows,
    templateAreas: config.areas.map((row) => `"${row}"`).join(" "),
    logoTransform: `translate(${x} ${y}) scale(${scale})`,
    cells,
    pulseFlash: Math.max(
      PULSE_MIN_FLASH_MS,
      PULSE_TOTAL_MS - Math.max(...cells.map((c) => c.pulseDelay)),
    ),
  };
}

export const gridAspectRatio = (layout: LogoGridLayout) =>
  `${layout.columns * COLUMN_UNITS} / ${layout.rows * ROW_UNITS}`;

type Rect = { c0: number; r0: number; c1: number; r1: number };

function sharesEdge(a: Rect, b: Rect) {
  const overlapX = Math.min(a.c1, b.c1) - Math.max(a.c0, b.c0);
  const overlapY = Math.min(a.r1, b.r1) - Math.max(a.r0, b.r0);
  return (
    (overlapX > 0 && (a.r1 === b.r0 || b.r1 === a.r0)) ||
    (overlapY > 0 && (a.c1 === b.c0 || b.c1 === a.c0))
  );
}

// Area of a polygon after clipping it to a box (Sutherland–Hodgman).
function clippedArea(
  polygon: Point[],
  box: { x: number; y: number; w: number; h: number },
) {
  const edges: [(p: Point) => boolean, (a: Point, b: Point) => Point][] = [
    [(p) => p[0] >= box.x, (a, b) => atX(a, b, box.x)],
    [(p) => p[0] <= box.x + box.w, (a, b) => atX(a, b, box.x + box.w)],
    [(p) => p[1] >= box.y, (a, b) => atY(a, b, box.y)],
    [(p) => p[1] <= box.y + box.h, (a, b) => atY(a, b, box.y + box.h)],
  ];
  let points = polygon;
  for (const [inside, cross] of edges) {
    const next: Point[] = [];
    points.forEach((current, i) => {
      const previous = points[(i + points.length - 1) % points.length];
      if (inside(current)) {
        if (!inside(previous)) next.push(cross(previous, current));
        next.push(current);
      } else if (inside(previous)) next.push(cross(previous, current));
    });
    points = next;
    if (!points.length) return 0;
  }
  return Math.abs(
    points.reduce((sum, [x1, y1], i) => {
      const [x2, y2] = points[(i + 1) % points.length];
      return sum + x1 * y2 - x2 * y1;
    }, 0) / 2,
  );
}

function atX([x1, y1]: Point, [x2, y2]: Point, x: number): Point {
  return [x, y1 + ((y2 - y1) * (x - x1)) / (x2 - x1)];
}

function atY([x1, y1]: Point, [x2, y2]: Point, y: number): Point {
  return [x1 + ((x2 - x1) * (y - y1)) / (y2 - y1), y];
}

function mix(hex: string, base: string, amount: number) {
  const channel = (value: string, i: number) =>
    parseInt(value.slice(1 + i * 2, 3 + i * 2), 16);
  return `#${[0, 1, 2]
    .map((i) =>
      Math.round(channel(hex, i) * amount + channel(base, i) * (1 - amount))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}
