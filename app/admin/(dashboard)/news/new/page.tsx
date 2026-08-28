import { db } from "@/lib/db";
import { NewsForm } from "@/components/admin/news-form";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const categories = await db.category.findMany({ where: { type: "NEWS" }, orderBy: { name: "asc" } });
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">New article</h1>
      <p className="mt-1 text-sm text-mute">Published articles appear on the public site immediately.</p>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
        <NewsForm categories={categories} />
      </div>
    </div>
  );
}
