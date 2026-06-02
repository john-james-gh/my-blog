import type { Metadata } from "next";
import type { CollectionPage, ListItem, WebSite, WithContext } from "schema-dts";

import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "@/lib/api";
import { SITE_DESCRIPTION } from "@/lib/constants";
import { getBaseUrl } from "@/lib/url";
import type { Post } from "@/types/post";

const title = "John James Blog";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();

  return {
    metadataBase: new URL(baseUrl),
    title,
    description: SITE_DESCRIPTION,
    openGraph: {
      type: "website",
      url: "/",
      siteName: title,
      title,
      description: SITE_DESCRIPTION,
    },
  };
}

const serializeJsonLd = (jsonLd: object) => JSON.stringify(jsonLd).replace(/</g, "\\u003c");

const generateWebsiteJsonLd = (baseUrl: string): WithContext<WebSite> => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: new URL("/", baseUrl).toString(),
  name: title,
  inLanguage: "en-US",
});

const generateIndexJsonLd = (posts: Post[], baseUrl: string): WithContext<CollectionPage> => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Posts",
  url: new URL("/", baseUrl).toString(),
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: posts.length,
    itemListElement: posts.map(
      (post, i): ListItem => ({
        "@type": "ListItem",
        position: i + 1,
        url: new URL(`/posts/${post.slug}`, baseUrl).toString(),
        name: post.title,
      }),
    ),
  },
});

export default function Index() {
  const allPosts = getAllPosts();

  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  const baseUrl = getBaseUrl();
  const websiteJson = serializeJsonLd(generateWebsiteJsonLd(baseUrl));
  const indexJson = serializeJsonLd(generateIndexJsonLd(allPosts, baseUrl));

  return (
    <main>
      <Container>
        <Intro />
        {heroPost ? (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.coverImage}
            date={heroPost.date}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />
        ) : (
          <section className="mb-24 max-w-2xl border-t border-neutral-200 pt-10">
            <h2 className="text-3xl font-semibold tracking-tight">No posts yet.</h2>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              Add a Markdown file to the _posts directory to publish the first entry.
            </p>
          </section>
        )}
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJson }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: indexJson }} />
    </main>
  );
}
