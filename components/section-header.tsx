import Link from "next/link";

type Props = {
  eyebrow: string;
  title: string;
  href?: string;
  hrefLabel?: string;
};

export function SectionHeader({ eyebrow, title, href, hrefLabel }: Props) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="headline-display mt-2 text-3xl text-balance sm:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-sundari hover:text-sundari-dark sm:inline-flex"
        >
          {hrefLabel ?? "View all"} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
