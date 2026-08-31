"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/**
 * MascotRobot — interactive 1Reff mascot.
 *
 * Poses live in /public/mascot/: idle.png, wave.png, side.png, back.png
 * Drop this file in components/MascotRobot.tsx and use:
 *   <MascotRobot />
 *
 * Behavior:
 *  - Idle by default, with a gentle floating bob.
 *  - Hover  -> waves hello.
 *  - Click  -> cycles a "thinking" (side) then "shy" (back) reaction,
 *              then settles back to idle. Great for a "hint"/tooltip trigger.
 *  - Respects prefers-reduced-motion (disables the bob + slows crossfades).
 */

const POSES = {
  idle: { src: "/mascot/idle.png", alt: "1Reff mascot standing" },
  wave: { src: "/mascot/wave.png", alt: "1Reff mascot waving hello" },
  side: { src: "/mascot/side.png", alt: "1Reff mascot looking curious" },
  back: { src: "/mascot/back.png", alt: "1Reff mascot looking away shyly" },
};

export default function MascotRobot({ size = 220, className = "" }: { size?: number; className?: string }) {
  const [pose, setPose] = useState("idle");
  const [hovering, setHovering] = useState(false);
  const clickSequenceRef = useRef<NodeJS.Timeout | null>(null);

  // Preload every pose so swaps never show a blank frame.
  useEffect(() => {
    Object.values(POSES).forEach((p) => {
      const img = new window.Image();
      img.src = p.src;
    });
  }, []);

  useEffect(() => () => {
    if (clickSequenceRef.current) clearTimeout(clickSequenceRef.current);
  }, []);

  function handleEnter() {
    setHovering(true);
    if (pose === "idle") setPose("wave");
  }

  function handleLeave() {
    setHovering(false);
    setPose("idle");
  }

  function handleClick() {
    if (clickSequenceRef.current) clearTimeout(clickSequenceRef.current);
    setPose("side");
    clickSequenceRef.current = setTimeout(() => {
      setPose("back");
      clickSequenceRef.current = setTimeout(() => {
        setPose(hovering ? "wave" : "idle");
      }, 550);
    }, 550);
  }

  return (
    <button
      type="button"
      aria-label="1Reff mascot, click for a reaction"
      className={`mascot ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      style={{ width: size, height: size }}
    >
      {Object.entries(POSES).map(([key, p]) => (
        <Image
          key={key}
          src={p.src}
          alt={p.alt}
          fill
          priority={key === "idle"}
          sizes={`${size}px`}
          className={`mascot__frame ${pose === key ? "is-active" : ""}`}
          style={{ objectFit: "contain" }}
        />
      ))}

      <style jsx>{`
        .mascot {
          position: relative;
          display: inline-block;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          animation: bob 3.2s ease-in-out infinite;
        }
        .mascot:focus-visible {
          outline: 3px solid #7c5cff;
          outline-offset: 6px;
          border-radius: 16px;
        }
        .mascot :global(.mascot__frame) {
          opacity: 0;
          transition: opacity 0.28s ease;
          pointer-events: none;
        }
        .mascot :global(.mascot__frame.is-active) {
          opacity: 1;
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mascot {
            animation: none;
          }
          .mascot :global(.mascot__frame) {
            transition: opacity 0.01ms;
          }
        }
      `}</style>
    </button>
  );
}
