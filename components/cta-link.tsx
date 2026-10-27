"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics/track";

type CtaLinkProps = {
  href: string;
  className?: string;
  location: "hero" | "header";
  children: ReactNode;
};

export function CtaLink({ href, className, location, children }: CtaLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        track("cta_click", { location });
      }}
    >
      {children}
    </a>
  );
}
