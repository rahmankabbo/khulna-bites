import Link from "next/link";
import Image from "next/image";
import type { NewsArticle, Category } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type Props = {
  article: NewsArticle;
  /** "large" for the editorial lead story, "row" for compact lists. */
  variant?: "card" | "large" | "row";
};

export function NewsCard({ article, variant = "card" }: Props) {
  if (variant === "row") {
    return (
      <Link
        href={`/news/${article.slug}`}
        className="group flex items-start gap-4 border-b border-line py-5 first:pt-0 last:border-0"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs">
            {article.category && (
              <span className="font-semibold uppercase tracking-wider text-sundari">
                {article.category.name}
              </span>
            )}
            <span className="text-mute">{formatDate(article.publishedAt)}</span>
          </div>
          <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-ink group-hover:text-sundari-dark">
            {article.title}
          </h3>
        </div>
        <span className="mt-2 text-mute transition-transform group-hover:translate-x-1">→</span>
      </Link>
    );
  }

  const large = variant === "large";
  return (
    <Link href={`/news/${article.slug}`} className="card group block overflow-hidden">
      <div className={large ? "relative aspect-[16/9]" : "relative aspect-[16/10]"}>
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes={large ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        {article.featured && (
          <span className="absolute left-4 top-4 badge-amber shadow-sm">Featured</span>
        )}
      </div>
      <div className={large ? "p-6 sm:p-8" : "p-5"}>
        <div className="flex items-center gap-2 text-xs">
          {article.category && (
            <span className="font-semibold uppercase tracking-wider text-sundari">
              {article.category.name}
            </span>
          )}
          <span className="text-mute">{formatDate(article.publishedAt)}</span>
        </div>
        <h3
          className={
            large
              ? "headline-display mt-3 text-balance text-2xl text-ink group-hover:text-sundari-dark sm:text-4xl"
              : "mt-2 font-display text-lg font-semibold leading-snug text-ink group-hover:text-sundari-dark"
          }
        >
          {article.title}
        </h3>
        <p className={large ? "mt-3 leading-relaxed text-mute" : "mt-2 line-clamp-2 text-sm text-mute"}>
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}
