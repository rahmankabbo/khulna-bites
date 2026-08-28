import type { Metadata } from "next";
import { db } from "@/lib/db";
import { NewsCard } from "@/components/news-card";
import { NewsFilter } from "@/components/news-filter";

export const metadata: Metadata = {
  title: "News",
  description: "The latest news and stories from Khulna — city, food, culture and business.",
};

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function NewsPage({ searchParams }: Props) {
  const { q, category } = await searchParams;

  const categories = await db.category.findMany({
    where: { type: "NEWS" },
    orderBy: { name: "asc" },
  });

  const articles = await db.newsArticle.findMany({
    where: {
      published: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { excerpt: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  return (
    <div className="container-site py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="eyebrow">News</p>
        <h1 className="headline-display mt-2 text-4xl sm:text-5xl">Stories from Khulna</h1>
        <p className="mt-4 text-mute">
          City updates, food finds, culture and business — reported and curated by the Khulna Bites desk.
        </p>
      </header>

      <NewsFilter categories={categories} q={q ?? ""} category={category ?? ""} />

      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line p-14 text-center">
          <p className="font-display text-xl font-semibold">No stories found</p>
          <p className="mt-2 text-sm text-mute">
            Try a different search term or category.
          </p>
        </div>
      )}
    </div>
  );
}
