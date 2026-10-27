// Traced from westpac-logo.webp into a 320×130 viewBox: two slanted strokes
// around a centre bar. `outline` is a convex approximation of each shape,
// used to work out which logo grid cells a part passes through.
export const LOGO_RED = "#DA1710";
export const LOGO_WIDTH = 320;
export const LOGO_HEIGHT = 130;

export type Point = readonly [number, number];

export const logoParts = [
  {
    id: "left",
    label: "left stroke",
    d: "M2 0H58Q76.4 0 81.1 15L117.3 130H60Q41.9 130 38.8 120Z",
    outline: [
      [2, 0],
      [76.4, 0],
      [117.3, 130],
      [41.9, 130],
    ],
  },
  {
    id: "centre",
    label: "centre bar",
    d: "M125 0H195V130H125Z",
    outline: [
      [125, 0],
      [195, 0],
      [195, 130],
      [125, 130],
    ],
  },
  {
    id: "right",
    label: "right stroke",
    d: "M318 0H262Q243.6 0 238.9 15L202.7 130H260Q278.1 130 281.2 120Z",
    outline: [
      [243.6, 0],
      [318, 0],
      [278.1, 130],
      [202.7, 130],
    ],
  },
] as const satisfies readonly {
  id: string;
  label: string;
  d: string;
  outline: readonly Point[];
}[];

export type LogoPart = (typeof logoParts)[number];

export function WestpacLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`}
      role="img"
      aria-label="Westpac"
      className={className}
    >
      {logoParts.map((part) => (
        <path key={part.id} d={part.d} fill={LOGO_RED} />
      ))}
    </svg>
  );
}
