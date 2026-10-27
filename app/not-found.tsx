import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { notFoundCopy } from "@/lib/content";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="content" className="section not-found" tabIndex={-1}>
        <div className="container">
          <h1>{notFoundCopy.title}</h1>
          <p>
            <Link className="btn btn-secondary" href="/">{notFoundCopy.home}</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
