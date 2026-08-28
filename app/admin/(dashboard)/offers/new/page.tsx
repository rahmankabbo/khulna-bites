import { db } from "@/lib/db";
import { OfferForm } from "@/components/admin/offer-form";

export const dynamic = "force-dynamic";

export default async function NewOfferPage() {
  const categories = await db.category.findMany({ where: { type: "OFFER" }, orderBy: { name: "asc" } });
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">New offer</h1>
      <p className="mt-1 text-sm text-mute">Active offers show publicly until their expiry date.</p>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
        <OfferForm categories={categories} />
      </div>
    </div>
  );
}
