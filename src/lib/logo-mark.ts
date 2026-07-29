/**
 * The LH mark, as stroke rectangles on a 32-unit grid.
 *
 * Single source of geometry for the navbar logo (SVG) and the generated
 * favicon and apple icon (ImageResponse), so the mark in the browser tab is
 * provably the same shape as the one on the page.
 *
 * Why plain letterforms rather than a ligature or a font: an LH ligature was
 * tried first and reads as an "H" with a stub — the L disappears. Rendering
 * "LH" as text works at 32px but the strokes are thin enough to blur into a
 * smudge when a non-retina tab scales it to 16px. Drawing the letters lets the
 * stroke weight be set heavy enough to survive that.
 */
export const MARK_GRID = 32;

export const MARK_BARS: ReadonlyArray<
  readonly [x: number, y: number, width: number, height: number]
> = [
  // L
  [5, 8, 4, 16],
  [5, 20, 8, 4],
  // H
  [17, 8, 4, 16],
  [24, 8, 4, 16],
  [17, 14, 11, 4],
];
