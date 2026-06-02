"use client";

import Link from "next/link";

import Container from "@/app/_components/container";
import Header from "@/app/_components/header";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <Container>
        <Header />
        <section className="max-w-3xl border-t border-neutral-200 pt-12 pb-32">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.24em] text-neutral-500">
            Error
          </p>
          <h1 className="text-5xl font-bold leading-tight tracking-tighter text-neutral-950 md:text-7xl">
            Something broke in the margins.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
            The page failed while rendering. You can retry the request, or head back to the
            latest posts.
          </p>
          {error.digest ? (
            <p className="mt-6 font-mono text-xs text-neutral-500">Digest: {error.digest}</p>
          ) : null}
          <div className="mt-10 flex flex-col gap-4 border-t border-neutral-200 pt-8 sm:flex-row">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center border border-neutral-950 bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-neutral-950"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:border-neutral-950"
            >
              Back to latest posts
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
