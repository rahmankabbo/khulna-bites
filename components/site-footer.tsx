import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="container-site grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Image src="/logo-black.png" alt="Khulna Bites" width={341} height={204} className="h-10 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mute">
            Everything happening in Khulna, in one place — news, offers, events,
            and a direct line between local businesses and the city.
          </p>
          <div className="mt-5 flex gap-2">
            {[
              { label: "Facebook", href: "#" },
              { label: "Instagram", href: "#" },
              { label: "YouTube", href: "#" },
            ].map((s) => (
              <a key={s.label} href={s.href} className="chip hover:border-sundari hover:text-sundari">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Explore">
          <h3 className="eyebrow mb-4">Explore</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link className="text-mute hover:text-ink" href="/news">News</Link></li>
            <li><Link className="text-mute hover:text-ink" href="/offers">Offers</Link></li>
            <li><Link className="text-mute hover:text-ink" href="/events">Events</Link></li>
            <li><Link className="text-mute hover:text-ink" href="/business">Business With Us</Link></li>
          </ul>
        </nav>

        <div>
          <h3 className="eyebrow mb-4">Contact</h3>
          <ul className="space-y-2.5 text-sm text-mute">
            <li>hello@khulnabites.com <span className="text-mute/60">(demo)</span></li>
            <li>KDA Avenue, Khulna 9100</li>
            <li>Bangladesh</li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Admin</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link className="text-mute hover:text-ink" href="/admin">Dashboard</Link></li>
            <li><Link className="text-mute hover:text-ink" href="/admin/login">Admin login</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-5">
        <div className="container-site flex flex-col items-center justify-between gap-2 text-xs text-mute sm:flex-row">
          <p>© {new Date().getFullYear()} Khulna Bites. All rights reserved.</p>
          <p>Made in Khulna, Bangladesh.</p>
        </div>
      </div>
    </footer>
  );
}
