import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";

import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { PostFooter } from "@/app/_components/post-footer";
import { PostHeader } from "@/app/_components/post-header";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import markdownToHtml from "@/lib/md-to-html";
import { getReadingTime } from "@/lib/reading-time";
import { getBaseUrl } from "@/lib/url";
import type { Post as BlogPost } from "@/types/post";

export const dynamicParams = false;

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const pageJson = serializeJsonLd(generatePostJsonLd(post, getBaseUrl()));

  const content = await markdownToHtml(post.content || "");
  const readingTime = getReadingTime(post.content || "");
  const allPosts = getAllPosts();
  const currentPostIndex = allPosts.findIndex((candidate) => candidate.slug === post.slug);
  const nextPost = allPosts[currentPostIndex + 1];

  return (
    <main>
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            readingTime={readingTime}
          />
          <PostBody content={content} />
          <PostFooter nextPost={nextPost} />
        </article>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageJson }} />
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  return {
    title: post.title,
    openGraph: {
      title: post.title,
      images: [post.ogImage.url],
    },
  };
}

const serializeJsonLd = (jsonLd: object) => JSON.stringify(jsonLd).replace(/</g, "\\u003c");

const generatePostJsonLd = (post: BlogPost, baseUrl: string): WithContext<BlogPosting> => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": new URL(`/posts/${post.slug}`, baseUrl).toString(),
  },
  headline: post.title,
  description: post.excerpt,
  image: [new URL(post.ogImage.url || post.coverImage, baseUrl).toString()],
  author: {
    "@type": "Person",
    name: SITE_NAME,
  },
  publisher: {
    "@type": "Person",
    name: SITE_NAME,
  },
  datePublished: new Date(post.date).toISOString(),
  dateModified: new Date(post.date).toISOString(),
  isPartOf: {
    "@type": "Blog",
    name: `${SITE_NAME} Blog`,
    description: SITE_DESCRIPTION,
    url: new URL("/", baseUrl).toString(),
  },
});

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
