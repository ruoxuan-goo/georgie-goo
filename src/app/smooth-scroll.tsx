"use client";

import { useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

// Inertial wheel/trackpad scrolling for the whole page. In-page anchor links
// glide to their section; Lenis honours each target's scroll-margin, so the
// sticky header offset comes from the existing scroll-mt classes. Touch keeps
// native scrolling, and reduced-motion users get plain native scrolling.
export function SmoothScroll() {
  if (useReducedMotion()) return null;
  return <ReactLenis root options={{ lerp: 0.1, anchors: true }} />;
}
