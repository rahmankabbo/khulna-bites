import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { NewsForm } from "@/components/admin/news-form";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    db.newsArticle.findUnique({ where: { id } }),
    db.category.findMany({ where: { type: "NEWS" }, orderBy: { name: "asc" } }),
  ]);
  if (!article) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Edit article</h1>
      <p className="mt-1 truncate text-sm text-mute">{article.title}</p>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
        <NewsForm article={article} categories={categories} />
      </div>
    </div>
  );
}
