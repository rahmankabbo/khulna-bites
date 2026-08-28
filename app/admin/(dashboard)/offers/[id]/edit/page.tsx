import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { OfferForm } from "@/components/admin/offer-form";

export const dynamic = "force-dynamic";

export default async function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [offer, categories] = await Promise.all([
    db.offer.findUnique({ where: { id } }),
    db.category.findMany({ where: { type: "OFFER" }, orderBy: { name: "asc" } }),
  ]);
  if (!offer) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Edit offer</h1>
      <p className="mt-1 truncate text-sm text-mute">{offer.title}</p>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
        <OfferForm offer={offer} categories={categories} />
      </div>
    </div>
  );
}
