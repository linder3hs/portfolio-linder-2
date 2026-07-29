import { ImageResponse } from "next/og";
import { MARK_BARS, MARK_GRID } from "@/lib/logo-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Home-screen icon. iOS rounds and masks this itself, so the tile fills the
 * square edge to edge — a pre-rounded one would be clipped twice.
 */
export default function AppleIcon() {
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
