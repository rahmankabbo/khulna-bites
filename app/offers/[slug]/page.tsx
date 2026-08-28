import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOfferBySlug, getAllOfferSlugs } from "@/lib/demo-data";
import { formatDate, startOfToday, daysUntil } from "@/lib/utils";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllOfferSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) return { title: "Offer not found" };
  return {
    title: `${offer.value} — ${offer.businessName}`,
    description: offer.description.slice(0, 160),
    openGraph: { images: [offer.coverImage] },
  };
}

export default async function OfferPage({ params }: Props) {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) notFound();

  const live = offer.active && new Date(offer.expiryDate) >= startOfToday();
  const daysLeft = daysUntil(offer.expiryDate);

  return (
    <div className="container-site py-12 sm:py-16">
      <nav className="text-xs text-mute" aria-label="Breadcrumb">
        <Link href="/offers" className="hover:text-ink">Offers</Link>
        {offer.category && (
          <>
            <span aria-hidden> / </span>
            <Link href={`/offers?category=${offer.category.slug}`} className="hover:text-ink">
              {offer.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-line">
          <Image src={offer.coverImage} alt={offer.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 60vw" />
          <span className="absolute bottom-5 left-5 rounded-2xl bg-ink/90 px-6 py-3 font-display text-3xl font-bold text-amber backdrop-blur">
            {offer.value}
          </span>
        </div>

        <div>
          {!live && <span className="badge-red">This offer has expired</span>}
          {live && daysLeft <= 3 && (
            <span className="badge-amber">Ending soon — {daysLeft <= 0 ? "last day" : `${daysLeft} days left`}</span>
          )}
          <h1 className="headline-display mt-3 text-balance text-4xl">{offer.title}</h1>
          <p className="mt-2 font-display text-xl font-semibold text-sundari">{offer.businessName}</p>
          <p className="mt-5 leading-relaxed text-mute">{offer.description}</p>

          <dl className="mt-8 space-y-4 border-t border-line pt-6 text-sm">
            <div className="flex gap-3">
              <dt className="w-28 shrink-0 font-semibold text-ink">Valid</dt>
              <dd className="text-mute">
                {formatDate(offer.startDate)} — {formatDate(offer.expiryDate)}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-28 shrink-0 font-semibold text-ink">Location</dt>
              <dd className="text-mute">{offer.location}</dd>
            </div>
            {offer.contact && (
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 font-semibold text-ink">Contact</dt>
                <dd className="text-mute">{offer.contact}</dd>
              </div>
            )}
          </dl>

          {offer.terms && (
            <div className="mt-6 rounded-2xl border border-line bg-white p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-mute">
                Terms &amp; conditions
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mute">{offer.terms}</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {offer.externalUrl && live && (
              <a href={offer.externalUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Get Offer — Visit Business →
              </a>
            )}
            {!offer.externalUrl && live && offer.contact && (
              <a href={`tel:${offer.contact.replace(/[^+\d]/g, "")}`} className="btn-primary">
                Call to Claim →
              </a>
            )}
            <Link href="/offers" className="btn-outline">Back to offers</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
