export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-12 sm:px-8 sm:py-16">
      <header className="border-b border-stone-200 pb-10">
        <p className="font-mono text-sm uppercase tracking-[0.18em] text-stone-500">
          Notes and essays
        </p>
        <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-tight text-stone-950 sm:text-6xl">
          My Blog
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
          A quiet place for writing about software, systems, and the work of
          making things clearer.
        </p>
      </header>

      <section className="grid gap-8 py-10">
        <article className="group">
          <p className="font-mono text-sm text-stone-500">Draft</p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-950 transition-colors group-hover:text-stone-700">
            Start with the shape of the problem
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            A placeholder post for turning the default app into a useful home
            for future notes.
          </p>
        </article>
      </section>
    </main>
  );
}
