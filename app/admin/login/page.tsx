import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl bg-ink p-8 text-center">
          <Image
            src="/logo-white.png"
            alt="Khulna Bites"
            width={341}
            height={204}
            className="mx-auto h-14 w-auto"
          />
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-paper/50">Admin Dashboard</p>
        </div>
        <div className="mt-4 rounded-3xl border border-line bg-white p-8 shadow-card">
          <h1 className="font-display text-xl font-bold">Sign in</h1>
          <p className="mt-1 text-sm text-mute">Manage news, offers, events and inquiries.</p>
          <LoginForm next={next ?? "/admin"} />
        </div>
        <p className="mt-4 text-center text-xs text-mute">
          <Link href="/" className="hover:text-ink">← Back to the public site</Link>
        </p>
      </div>
    </div>
  );
}
