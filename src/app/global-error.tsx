"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Something went wrong</h1>
        <p style={{ color: "#667085", maxWidth: 360 }}>
          The application hit an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 999,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
