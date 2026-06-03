import Link from "next/link";

type Props = {
  nextPost?: {
    slug: string;
    title: string;
  };
};

export function PostFooter({ nextPost }: Props) {
  return (
    <footer className="mx-auto mt-16 max-w-2xl border-t border-neutral-200 pt-8">
      {nextPost && (
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-neutral-500">
            Continue reading
          </p>
          <Link
            href={`/posts/${nextPost.slug}`}
            className="text-2xl leading-snug tracking-tight hover:underline"
          >
            {nextPost.title}
          </Link>
        </div>
      )}
      <Link href="/" className="text-base text-neutral-600 hover:underline">
        All posts
      </Link>
    </footer>
  );
}
