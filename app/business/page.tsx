import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";

export const metadata: Metadata = {
  title: "Business With Us",
  description:
    "Reach the Khulna audience through Khulna Bites — advertising, sponsored content, event promotion and business collaboration.",
};

const SERVICES = [
  {
    title: "Advertising",
    desc: "Put your business in front of thousands of Khulna readers with banners and featured placements across the site.",
    icon: "M3 11l18-8-8 18-2.5-7.5L3 11z",
  },
  {
    title: "Sponsored Content",
    desc: "Get featured in a Khulna Bites story — written and photographed by our editorial team, clearly labeled as sponsored.",
    icon: "M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z",
  },
  {
    title: "Event Promotion",
    desc: "List your event on Khulna Bites with a dedicated page, booking support, and promotion across our channels.",
    icon: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  },
  {
    title: "Business Collaboration",
    desc: "Campaigns, partnerships and custom projects — work directly with the Khulna Bites team on something built for you.",
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  },
];

export default function BusinessPage() {
  return (
    <div className="container-site py-12 sm:py-16">
      {/* Hero */}
      <header className="max-w-3xl">
        <p className="eyebrow">Business With Us</p>
        <h1 className="headline-display mt-2 text-balance text-4xl sm:text-6xl">
          Reach Khulna through the platform Khulna reads.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mute">
          Whether you run a restaurant in Boyra, a boutique on KDA Avenue, or the
          city&apos;s next big event — Khulna Bites connects you with a local
          audience that actually shows up.
        </p>
      </header>

      {/* Services */}
      <section className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <div key={s.title} className="card p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sundari-tint text-sundari">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={s.icon} />
              </svg>
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-mute">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* Inquiry form */}
      <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div className="rounded-3xl bg-sundari-dark p-8 text-paper sm:p-10">
          <h2 className="headline-display text-3xl text-balance">Work With Us</h2>
          <p className="mt-4 leading-relaxed text-paper/80">
            Tell us about your business and what you want to promote. The team
            replies within two working days with options and rates.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            {[
              "Local audience — readers actually live in Khulna",
              "Editorial quality — stories written and shot by our team",
              "Fast turnaround — most campaigns live within a week",
              "Transparent pricing — no agency layers",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber text-ink">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-paper/90">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-10">
          <InquiryForm />
        </div>
      </section>
    </div>
  );
}
