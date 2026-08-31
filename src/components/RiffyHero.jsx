"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";

// Riffy uses <Canvas> (WebGL), so it must be client-only — no SSR.
const Riffy3D = dynamic(() => import("./Riffy3D"), { ssr: false });

/**
 * Hero section matching the 1Reff wireframe:
 * headline, Riffy in a card, a prompt line, and a search bar underneath.
 *
 * Swap `runMockSearch` for your real API call — the mood state machine
 * (idle -> thinking -> happy) is the part that matters and stays the same.
 */
export default function RiffyHero() {
  const [mood, setMood] = useState("idle");
  const [message, setMessage] = useState("Who do you want to meet?");
  const [query, setQuery] = useState("");
  const idleTimer = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;

    clearTimeout(idleTimer.current);
    setMood("thinking");
    setMessage("Looking through your network…");

    const results = await runMockSearch(query);

    setMood("happy");
    setMessage(`Found ${results.count} people who might be a good match.`);

    idleTimer.current = setTimeout(() => {
      setMood("idle");
      setMessage("Who do you want to meet?");
    }, 6000);
  }

  return (
    <section style={styles.hero}>
      <div style={styles.headerRow}>
        <span style={styles.brand}>1Reff</span>
        <span aria-hidden style={styles.bell}>🔔</span>
      </div>

      <h1 style={styles.headline}>Ready to expand your network</h1>

      <div style={styles.riffyCard}>
        <Riffy3D mood={mood} size={220} />
      </div>

      <p style={styles.speech}>{message}</p>

      <form onSubmit={handleSubmit} style={styles.searchRow}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => mood === "idle" && setMessage("Type who you're looking for…")}
          placeholder="Ask 1Reff AI…"
          style={styles.input}
          aria-label="Ask 1Reff AI"
        />
        <button type="submit" style={styles.sendBtn} aria-label="Search">
          ➤
        </button>
      </form>
    </section>
  );
}

// Replace with your real search/matchmaking API call.
function runMockSearch(query) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ count: Math.max(1, (query.length * 7) % 9) }), 900);
  });
}

const styles = {
  hero: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "24px 20px 32px",
    borderRadius: 24,
    background: "linear-gradient(180deg, #fbfbff 0%, #f2f1fb 100%)",
    boxShadow: "0 1px 0 rgba(20,20,40,0.04)",
    fontFamily: "system-ui, sans-serif",
    textAlign: "center",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  brand: { fontWeight: 700, color: "#4f3fb0", fontSize: 18 },
  bell: { fontSize: 18, opacity: 0.6 },
  headline: {
    fontSize: 20,
    fontWeight: 600,
    color: "#1a1a2e",
    margin: "0 0 8px",
  },
  riffyCard: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "8px auto 4px",
  },
  speech: {
    fontSize: 14,
    color: "#5b5b76",
    minHeight: 20,
    margin: "8px 0 20px",
  },
  searchRow: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    border: "1px solid #e6e5f2",
    borderRadius: 14,
    padding: "10px 12px",
    gap: 8,
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 14,
    background: "transparent",
  },
  sendBtn: {
    border: "none",
    background: "#7c5cff",
    color: "#fff",
    width: 32,
    height: 32,
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
  },
};
