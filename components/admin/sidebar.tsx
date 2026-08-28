"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/news", label: "News" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

export function AdminSidebar({ adminName, adminEmail }: { adminName: string; adminEmail: string }) {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside>
      <div className="rounded-2xl border border-line bg-white p-4 shadow-card lg:sticky lg:top-24">
        <div className="border-b border-line px-2 pb-4">
          <p className="font-display text-sm font-bold">{adminName}</p>
          <p className="truncate text-xs text-mute">{adminEmail}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto py-3 lg:flex-col" aria-label="Admin">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive(l.href, l.exact)
                  ? "bg-sundari-tint text-sundari-dark"
                  : "text-mute hover:bg-ink/5 hover:text-ink"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-1 border-t border-line pt-3 lg:flex-col">
          <Link href="/" className="rounded-xl px-3 py-2 text-sm text-mute hover:bg-ink/5 hover:text-ink">
            View site ↗
          </Link>
          <form action={logout}>
            <button type="submit" className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
