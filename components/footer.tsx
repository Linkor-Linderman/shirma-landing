import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { footer, founder } from "@/lib/content";

export function Footer({ current }: { current?: "privacy" }) {
  const contact = founder.contactHref ? (
    <a href={founder.contactHref}>{founder.contactValue}</a>
  ) : (
    <span>{founder.contactValue}</span>
  );

  return (
    <footer className="site-footer">
      <div className="container">
        <Link className="footer-logo-link" href="/">
          <Logo on="navy" />
        </Link>
        <div className="footer-grid">
          <Image
            className="founder-photo"
            src={founder.photoSrc}
            alt={founder.photoAlt}
            width={72}
            height={72}
            unoptimized
          />
          <div>
            <p className="founder-line">{founder.line}</p>
            <p className="founder-contact">
              {founder.contactLabel}: {contact}
            </p>
          </div>
          <Link href="/privacy" aria-current={current === "privacy" ? "page" : undefined}>
            {footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
