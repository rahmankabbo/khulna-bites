import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, isOfferLive } from "@/lib/utils";
import { deleteNews, toggleNewsFlag } from "@/app/admin/actions";
import { DeleteButton, ToggleButton } from "@/components/admin/row-actions";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const articles = await db.newsArticle.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">News</h1>
          <p className="mt-1 text-sm text-mute">{articles.length} article{articles.length === 1 ? "" : "s"}</p>
        </div>
        <Link href="/admin/news/new" className="btn-primary !px-5 !py-2.5">+ New article</Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-line">
            <tr>
              <th className="th">Article</th>
              <th className="th">Category</th>
              <th className="th">Published</th>
              <th className="th">Featured</th>
              <th className="th">Date</th>
              <th className="th"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {articles.map((a) => (
              <tr key={a.id} className="hover:bg-paper/60">
                <td className="td max-w-[320px]">
                  <p className="truncate font-medium">{a.title}</p>
                  <p className="truncate text-xs text-mute">/news/{a.slug}</p>
                </td>
                <td className="td">{a.category?.name ?? <span className="text-mute">—</span>}</td>
                <td className="td">
                  <ToggleButton
                    action={toggleNewsFlag.bind(null, a.id, "published")}
                    on={a.published}
                    onLabel="Live"
                    offLabel="Draft"
                  />
                </td>
                <td className="td">
                  <ToggleButton
                    action={toggleNewsFlag.bind(null, a.id, "featured")}
                    on={a.featured}
                    onLabel="★ Featured"
                    offLabel="☆ Not featured"
                  />
                </td>
                <td className="td whitespace-nowrap text-mute">{formatDate(a.publishedAt)}</td>
                <td className="td">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/news/${a.id}/edit`} className="text-xs font-semibold text-sundari hover:underline">Edit</Link>
                    <DeleteButton action={deleteNews.bind(null, a.id)} confirmText={`Delete “${a.title}”?`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && (
          <p className="p-10 text-center text-sm text-mute">No articles yet — create the first one.</p>
        )}
      </div>
    </div>
  );
}
