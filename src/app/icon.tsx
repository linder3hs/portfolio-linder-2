import { ImageResponse } from "next/og";
import { MARK_BARS, MARK_GRID } from "@/lib/logo-mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon. Same mark as the navbar logo, drawn from the shared geometry.
 *
 * Filled purple tile rather than the site's dark background: browser tabs are
 * mostly pale, so a dark mark disappears into the chrome while a saturated one
 * stays findable.
 */
export default function Icon() {
  const scale = size.width / MARK_GRID;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)",
          borderRadius: 7,
        }}
      >
        {MARK_BARS.map(([x, y, w, h]) => (
          <div
            key={`${x}-${y}`}
            style={{
              position: "absolute",
              left: x * scale,
              top: y * scale,
              width: w * scale,
              height: h * scale,
              background: "#ffffff",
              borderRadius: 1.6 * scale,
            }}
          />
        ))}
      </div>
    ),
    size,
  );
}
