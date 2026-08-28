import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, isOfferLive } from "@/lib/utils";
import { deleteOffer, toggleOfferActive } from "@/app/admin/actions";
import { DeleteButton, ToggleButton } from "@/components/admin/row-actions";

export const dynamic = "force-dynamic";

export default async function AdminOffersPage() {
  const offers = await db.offer.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Offers</h1>
          <p className="mt-1 text-sm text-mute">
            {offers.filter((o) => isOfferLive(o)).length} live · {offers.length} total
          </p>
        </div>
        <Link href="/admin/offers/new" className="btn-primary !px-5 !py-2.5">+ New offer</Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-line">
            <tr>
              <th className="th">Offer</th>
              <th className="th">Value</th>
              <th className="th">Category</th>
              <th className="th">Expires</th>
              <th className="th">Status</th>
              <th className="th"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {offers.map((o) => {
              const expired = new Date(o.expiryDate) < new Date(new Date().setHours(0, 0, 0, 0));
              return (
                <tr key={o.id} className="hover:bg-paper/60">
                  <td className="td max-w-[300px]">
                    <p className="truncate font-medium">{o.title}</p>
                    <p className="truncate text-xs text-mute">{o.businessName}</p>
                  </td>
                  <td className="td whitespace-nowrap font-semibold text-sundari-dark">{o.value}</td>
                  <td className="td">{o.category?.name ?? <span className="text-mute">Other</span>}</td>
                  <td className="td whitespace-nowrap">
                    <span className={expired ? "font-medium text-red-600" : "text-mute"}>
                      {formatDate(o.expiryDate)}{expired && " · expired"}
                    </span>
                  </td>
                  <td className="td">
                    <ToggleButton
                      action={toggleOfferActive.bind(null, o.id)}
                      on={o.active}
                      onLabel="Active"
                      offLabel="Inactive"
                    />
                  </td>
                  <td className="td">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/offers/${o.id}/edit`} className="text-xs font-semibold text-sundari hover:underline">Edit</Link>
                      <DeleteButton action={deleteOffer.bind(null, o.id)} confirmText={`Delete “${o.title}”?`} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {offers.length === 0 && (
          <p className="p-10 text-center text-sm text-mute">No offers yet — create the first one.</p>
        )}
      </div>
    </div>
  );
}
