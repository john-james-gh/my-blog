import Link from "next/link";

import Container from "@/app/_components/container";
import Header from "@/app/_components/header";

export default function NotFound() {
  return (
    <main>
      <Container>
        <Header />
        <section className="max-w-3xl border-t border-neutral-200 pt-12 pb-32">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.24em] text-neutral-500">
            404
          </p>
          <h1 className="text-5xl font-bold leading-tight tracking-tighter text-neutral-950 md:text-7xl">
            This page has drifted out of frame.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
            The link may be old, the post may have moved, or the URL may have picked up a
            typo.
          </p>
          <div className="mt-10 flex flex-col gap-4 border-t border-neutral-200 pt-8 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-neutral-950 bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-neutral-950"
            >
              Back to latest posts
            </Link>
            <Link
              href="/sitemap.xml"
              className="inline-flex items-center justify-center border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:border-neutral-950"
            >
              View sitemap
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
