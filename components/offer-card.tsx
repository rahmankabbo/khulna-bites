import Link from "next/link";
import Image from "next/image";
import type { Offer, Category } from "@/lib/types";
import { daysUntil } from "@/lib/utils";

type Props = { offer: Offer };

export function OfferCard({ offer }: Props) {
  const daysLeft = daysUntil(offer.expiryDate);
  return (
    <Link href={`/offers/${offer.slug}`} className="card group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10]">
        <Image
          src={offer.coverImage}
          alt={offer.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* The discount is the hero of every offer card */}
        <span className="absolute bottom-4 left-4 rounded-xl bg-ink/90 px-4 py-2 font-display text-xl font-bold text-amber backdrop-blur">
          {offer.value}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs">
          {offer.category && (
            <span className="font-semibold uppercase tracking-wider text-sundari">
              {offer.category.name}
            </span>
          )}
          <span className={daysLeft <= 3 ? "font-semibold text-amber" : "text-mute"}>
            {daysLeft <= 0 ? "Ends today" : `${daysLeft} days left`}
          </span>
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink group-hover:text-sundari-dark">
          {offer.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-mute">{offer.businessName}</p>
        <p className="mt-2 line-clamp-2 text-sm text-mute">{offer.description}</p>
        <p className="mt-3 flex items-center gap-1.5 pt-1 text-xs text-mute">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {offer.location}
        </p>
      </div>
    </Link>
  );
}
