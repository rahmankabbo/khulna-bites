"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = { categories: Category[]; category: string };

export function OfferFilter({ categories, category }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const select = (slug: string) => {
    startTransition(() => {
      router.push(slug ? `${pathname}?category=${slug}` : pathname);
    });
  };

  return (
    <div className={cn("mb-10 mt-8 flex flex-wrap gap-2", pending && "opacity-60")}>
      <button
        type="button"
        onClick={() => select("")}
        className={cn("chip transition-colors", !category && "!border-sundari !bg-sundari-tint !text-sundari-dark")}
      >
        All offers
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => select(c.slug)}
          className={cn("chip transition-colors", category === c.slug && "!border-sundari !bg-sundari-tint !text-sundari-dark")}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
