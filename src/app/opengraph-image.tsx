import { ImageResponse } from "next/og";

export const alt = "AllInOne Electronics — Electrical, Electronics & Water Purifiers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #122a66 0%, #1d4fd1 60%, #2563eb 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              borderRadius: 18,
              background: "rgba(255,255,255,0.15)",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M7 2v11h3v9l7-12h-4l4-8H7z" fill="white" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 52, fontWeight: 800, color: "white", letterSpacing: -1 }}>
              AllInOne Electronics
            </div>
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 36, fontSize: 30, color: "rgba(255,255,255,0.85)" }}>
          Electrical · Electronics · Water Purifiers
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 44 }}>
          {[
            { label: "Free Installation", color: "#ea580c" },
            { label: "Genuine Warranty", color: "#4f46e5" },
            { label: "Doorstep Service", color: "#0891b2" },
          ].map((tag) => (
            <div
              key={tag.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.1)",
                fontSize: 22,
                color: "white",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 99, background: tag.color }} />
              {tag.label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
