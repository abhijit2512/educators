"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 1rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Something went wrong</h1>
        <p style={{ marginTop: "0.75rem", color: "#475569" }}>
          A critical error occurred. Please refresh the page or try again shortly.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            background: "#2a47e6",
            color: "white",
            border: 0,
            borderRadius: "0.75rem",
            padding: "0.75rem 1.25rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
