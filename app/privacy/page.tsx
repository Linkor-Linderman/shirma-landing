import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { privacyCopy } from "@/lib/content";

export const metadata: Metadata = {
  title: privacyCopy.title,
  description: privacyCopy.banner,
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="content" className="section" tabIndex={-1}>
        <div className="container">
          <h1>{privacyCopy.title}</h1>
          <div className="draft-banner privacy-banner" role="status">
            <strong>{privacyCopy.banner}</strong>
          </div>
          <p className="privacy-body">{privacyCopy.body}</p>
        </div>
      </main>
      <Footer current="privacy" />
    </>
  );
}
