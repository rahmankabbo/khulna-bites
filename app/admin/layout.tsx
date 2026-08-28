import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Khulna Bites Admin" },
  robots: { index: false, follow: false },
};

// Passthrough layout — the sidebar shell lives in (dashboard)/layout.tsx so
// the login page stays clean.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
