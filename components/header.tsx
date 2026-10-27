import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { Logo } from "@/components/logo";
import { footer, hero } from "@/lib/content";

export function Header({ ctaHref = "/#form" }: { ctaHref?: string }) {
  return (
    <header className="site-header" id="top">
      <div className="container header-inner">
        <Link className="logo" href="/">
          <Logo on="light" />
        </Link>
        <CtaLink href={ctaHref} className="btn btn-secondary header-cta" location="header">
          {footer.headerCta}
          <span className="visually-hidden">. {hero.cta}</span>
        </CtaLink>
      </div>
    </header>
  );
}
