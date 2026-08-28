import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { deleteInquiry, setInquiryRead, setInquiryStatus } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/row-actions";
import { InquiryRowActions } from "@/components/admin/inquiry-actions";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await db.businessInquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Business inquiries</h1>
      <p className="mt-1 text-sm text-mute">
        {inquiries.filter((i) => i.status === "NEW").length} new · {inquiries.length} total
      </p>

      <div className="mt-6 space-y-4">
        {inquiries.map((i) => (
          <article
            key={i.id}
            className={
              i.read
                ? "rounded-2xl border border-line bg-white p-6 shadow-card"
                : "rounded-2xl border-2 border-sundari/40 bg-white p-6 shadow-card"
            }
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-semibold">{i.businessName}</h2>
                  {!i.read && <span className="badge-green">unread</span>}
                  <span className={i.status === "NEW" ? "badge-amber" : i.status === "CONTACTED" ? "badge-green" : "badge-gray"}>
                    {i.status.toLowerCase()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-mute">
                  {i.name} · {i.phone}{i.email ? ` · ${i.email}` : ""}
                </p>
              </div>
              <div className="text-right text-xs text-mute">
                <p className="font-semibold text-sundari">{i.service}</p>
                <p className="mt-1">{formatDateTime(i.createdAt)}</p>
              </div>
            </div>

            <p className="mt-4 rounded-xl bg-paper p-4 text-sm leading-relaxed text-ink/85">{i.message}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <InquiryRowActions
                id={i.id}
                read={i.read}
                status={i.status}
                onRead={setInquiryRead}
                onStatus={setInquiryStatus}
              />
              <span className="flex-1" />
              <DeleteButton action={deleteInquiry.bind(null, i.id)} confirmText={`Delete the inquiry from ${i.businessName}?`} />
            </div>
          </article>
        ))}
        {inquiries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line p-14 text-center">
            <p className="font-display text-lg font-semibold">No inquiries yet</p>
            <p className="mt-1 text-sm text-mute">Submissions from the Business With Us form will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
