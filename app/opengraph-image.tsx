import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "V Fitness — gym in International City, Dubai. Strength, CrossFit, HIIT and personal training.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 15% 20%, rgba(249,115,22,0.45), transparent 45%), radial-gradient(circle at 90% 90%, rgba(225,29,72,0.35), transparent 45%), #09090b",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 20,
              background: "linear-gradient(135deg,#fb923c,#e11d48)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              fontWeight: 900,
              color: "#09090b",
            }}
          >
            V
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: 2 }}>
            V <span style={{ color: "#f97316", marginLeft: 12 }}>FITNESS</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1, textTransform: "uppercase", fontStyle: "italic" }}>Stronger starts here.</div>
          <div style={{ marginTop: 24, fontSize: 34, color: "#cbd5e1" }}>
            Strength · CrossFit · HIIT · Personal Training — International City, Dubai
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 28 }}>
          <div style={{ padding: "12px 24px", borderRadius: 999, background: "#f97316", color: "#09090b", fontWeight: 800 }}>Free 3-day trial</div>
          <div style={{ padding: "12px 24px", borderRadius: 999, border: "2px solid #3f3f46" }}>From AED 150 / month</div>
        </div>
      </div>
    ),
    size,
  );
}
