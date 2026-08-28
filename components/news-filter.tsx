"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition, FormEvent } from "react";
import type { Category } from "@prisma/client";
import { cn } from "@/lib/utils";

type Props = { categories: Category[]; q: string; category: string };

export function NewsFilter({ categories, q, category }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [term, setTerm] = useState(q);
  const [pending, startTransition] = useTransition();

  const navigate = (nextQ: string, nextCat: string) => {
    const params = new URLSearchParams();
    if (nextQ) params.set("q", nextQ);
    if (nextCat) params.set("category", nextCat);
    startTransition(() => {
      router.push(params.size ? `${pathname}?${params}` : pathname);
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(term.trim(), category);
  };

  return (
    <div className="mb-10 mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={onSubmit} className="relative w-full sm:max-w-xs" role="search">
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search stories…"
          aria-label="Search stories"
          className="input !rounded-full !pl-10"
        />
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mute"
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </form>

      <div className={cn("flex flex-wrap gap-2", pending && "opacity-60")}>
        <button
          type="button"
          onClick={() => navigate(term.trim(), "")}
          className={cn("chip transition-colors", !category && "!border-sundari !bg-sundari-tint !text-sundari-dark")}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => navigate(term.trim(), c.slug)}
            className={cn("chip transition-colors", category === c.slug && "!border-sundari !bg-sundari-tint !text-sundari-dark")}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
