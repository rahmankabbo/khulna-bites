import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsArticleBySlug, getRelatedNewsArticles, getAllNewsSlugs } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";
import { NewsCard } from "@/components/news-card";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  if (!article) return { title: "Story not found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.author],
      images: [article.coverImage],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedNewsArticles(slug, article.categoryId, 3);

  return (
    <article className="container-site py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <nav className="text-xs text-mute" aria-label="Breadcrumb">
          <Link href="/news" className="hover:text-ink">News</Link>
          {article.category && (
            <>
              <span aria-hidden> / </span>
              <Link href={`/news?category=${article.category.slug}`} className="hover:text-ink">
                {article.category.name}
              </Link>
            </>
          )}
        </nav>

        <h1 className="headline-display mt-4 text-balance text-4xl sm:text-5xl">{article.title}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mute">
          <span className="font-medium text-ink">{article.author}</span>
          <span aria-hidden>·</span>
          <time dateTime={article.publishedAt.toISOString()}>{formatDate(article.publishedAt)}</time>
          {article.category && (
            <>
              <span aria-hidden>·</span>
              <span className="badge-green">{article.category.name}</span>
            </>
          )}
        </div>
      </div>

      <div className="relative mx-auto mt-10 aspect-[16/9] max-w-4xl overflow-hidden rounded-3xl border border-line">
        <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 896px" />
      </div>

      <div className="prose-kb mx-auto mt-10 max-w-3xl text-lg">
        <p className="font-display text-xl font-medium leading-relaxed !text-ink">{article.excerpt}</p>
        {article.content.split("\n").filter(Boolean).map((para, i) => (
          <p key={i}>{para}</p>
        ))}

        {article.externalUrl && (
          <div className="not-prose mt-8 rounded-2xl border border-sundari/30 bg-sundari-tint p-6">
            <p className="text-sm text-sundari-dark">
              This story continues on the publisher&apos;s site.
            </p>
            <a
              href={article.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4"
            >
              Read Full Article →
            </a>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="headline-display mb-6 text-2xl">Related stories</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
