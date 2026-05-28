"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Hero3D = dynamic(() => import("./hero-3d"), { ssr: false });

/**
 * Loads the 3D hero accent on the client only, after mount, and only on
 * larger screens / when the user hasn't asked for reduced motion. Keeps the
 * mobile experience light and respects accessibility preferences.
 */
export function Hero3DLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bigEnough = window.matchMedia("(min-width: 1024px)").matches;
    if (!reduced && bigEnough) setShow(true);
  }, []);

  if (!show) return null;
  return <Hero3D />;
}
