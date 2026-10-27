"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/track";

const TARGETS = [
  { id: "how", depth: "how_it_works" },
  { id: "form", depth: "form" },
] as const;

export function ScrollDepth() {
  useEffect(() => {
    const seen = new Set<string>();
    const elements = TARGETS.flatMap((target) => {
      const element = document.getElementById(target.id);
      return element ? [{ element, depth: target.depth }] : [];
    });
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const depth = entry.target.getAttribute("data-depth");
          if (!depth || seen.has(depth)) continue;
          seen.add(depth);
          track("scroll_depth", { depth });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -25% 0px" },
    );

    for (const item of elements) observer.observe(item.element);
    return () => observer.disconnect();
  }, []);

  return null;
}
