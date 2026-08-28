"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Status = "NEW" | "CONTACTED" | "CLOSED";

export function InquiryRowActions({
  id,
  read,
  status,
  onRead,
  onStatus,
}: {
  id: string;
  read: boolean;
  status: Status;
  onRead: (id: string, read: boolean) => Promise<void>;
  onStatus: (id: string, status: Status) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className={cn("flex flex-wrap items-center gap-2", pending && "opacity-50")}>
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => onRead(id, !read))}
        className="chip hover:border-sundari hover:text-sundari"
      >
        {read ? "Mark as unread" : "Mark as read"}
      </button>
      {(["NEW", "CONTACTED", "CLOSED"] as const).map((s) => (
        <button
          key={s}
          type="button"
          disabled={pending || s === status}
          onClick={() => run(() => onStatus(id, s))}
          className={cn(
            "chip",
            s === status ? "!border-sundari !bg-sundari-tint !text-sundari-dark" : "hover:border-sundari hover:text-sundari"
          )}
        >
          {s.toLowerCase()}
        </button>
      ))}
    </div>
  );
}
