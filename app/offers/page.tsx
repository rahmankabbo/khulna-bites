import type { Metadata } from "next";
import { db } from "@/lib/db";
import { startOfToday } from "@/lib/utils";
import { OfferCard } from "@/components/offer-card";
import { OfferFilter } from "@/components/offer-filter";

export const metadata: Metadata = {
  title: "Offers",
  description: "Current deals and discounts from restaurants, cafes, shops and services across Khulna.",
};

export const revalidate = 60;

type Props = { searchParams: Promise<{ category?: string }> };

export default async function OffersPage({ searchParams }: Props) {
  const { category } = await searchParams;

  const categories = await db.category.findMany({
    where: { type: "OFFER" },
    orderBy: { name: "asc" },
  });

  // Public list: active AND not expired (expiry is enforced here automatically).
  const offers = await db.offer.findMany({
    where: {
      active: true,
      expiryDate: { gte: startOfToday() },
      ...(category ? { category: { slug: category } } : {}),
    },
    include: { category: true },
    orderBy: { expiryDate: "asc" },
  });

  return (
    <div className="container-site py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="eyebrow">Offers</p>
        <h1 className="headline-display mt-2 text-4xl sm:text-5xl">Deals live in Khulna</h1>
        <p className="mt-4 text-mute">
          Discounts and specials from local restaurants, cafes, shops and services — newest first,
          expiring soonest at the top.
        </p>
      </header>

      <OfferFilter categories={categories} category={category ?? ""} />

      {offers.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((o) => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line p-14 text-center">
          <p className="font-display text-xl font-semibold">No live offers in this category</p>
          <p className="mt-2 text-sm text-mute">Try another category, or check back soon.</p>
        </div>
      )}
    </div>
  );
}
