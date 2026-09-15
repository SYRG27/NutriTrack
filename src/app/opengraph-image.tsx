import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "NutriTrack";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "0 92px", background: "#0D1512", color: "#E9F0EB",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <svg width="96" height="96" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="13" fill="none" stroke="#273630" strokeWidth="3" />
            <path d="M16 3a13 13 0 1 1-9.2 22.2" fill="none" stroke="#3FBF90" strokeWidth="3" strokeLinecap="round" />
            <path d="M10.4 21.6c-.6-5.2 3.4-9.9 10.8-10.4.6 6.2-3.6 10.7-10.8 10.4z" fill="#3FBF90" />
            <path d="M10.8 21.4c2.2-3.4 5.2-5.6 8.6-6.8" fill="none" stroke="#0D1512" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", fontSize: 86, fontWeight: 700, letterSpacing: "-0.03em" }}>
            <span>Nutri</span>
            <span style={{ color: "#3FBF90" }}>Track</span>
          </div>
        </div>

        <div style={{ fontSize: 40, lineHeight: 1.35, color: "#B6C6BD", marginTop: 34, maxWidth: 900 }}>
          Answer a few questions. Get a week of meals built around your numbers. Log what you
          actually eat.
        </div>

        <div style={{ display: "flex", gap: 18, marginTop: 44 }}>
          {["Your calorie target", "Your protein target", "560+ foods"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex", fontSize: 27, color: "#3FBF90", border: "2px solid #24382F",
                borderRadius: 999, padding: "13px 28px",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
