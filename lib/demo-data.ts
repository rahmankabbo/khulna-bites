import type { Category, NewsArticle, Offer, Event } from "./types";
import { startOfToday } from "./utils";

/**
 * Calculates a date relative to now.
 * Ensures the public demo content is evergreen and always looks active and fresh.
 */
function daysFromNow(days: number, hour = 10): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

// ─── Categories ─────────────────────────────────────────────────────────────

export const DEMO_CATEGORIES: Category[] = [
  // News categories
  { id: "cat-city", name: "City", slug: "city", type: "NEWS" },
  { id: "cat-food-news", name: "Food", slug: "food-news", type: "NEWS" },
  { id: "cat-culture", name: "Culture", slug: "culture", type: "NEWS" },
  { id: "cat-business", name: "Business", slug: "business", type: "NEWS" },

  // Offer categories
  { id: "cat-food", name: "Food", slug: "food", type: "OFFER" },
  { id: "cat-cafe", name: "Cafe", slug: "cafe", type: "OFFER" },
  { id: "cat-fashion", name: "Fashion", slug: "fashion", type: "OFFER" },
  { id: "cat-shopping", name: "Shopping", slug: "shopping", type: "OFFER" },
  { id: "cat-services", name: "Services", slug: "services", type: "OFFER" },
];

const categoryMap = new Map(DEMO_CATEGORIES.map((c) => [c.id, c]));

// ─── News Articles ─────────────────────────────────────────────────────────

export function getDemoNewsArticles(): NewsArticle[] {
  return [
    {
      id: "news-1",
      slug: "rupsha-riverfront-walkway-phase-two",
      title: "Rupsha Riverfront Gets a New Walkway — Phase Two Opens to the Public",
      excerpt:
        "The second stretch of the Rupsha riverfront promenade is now open, adding 1.2 km of walkway, seating, and evening lighting between Khan Jahan Ali Bridge and Labonchora.",
      content: `The long-awaited second phase of the Rupsha riverfront walkway opened to the public this week, extending the promenade by 1.2 kilometres toward Labonchora.

The new stretch adds shaded seating, a dedicated cycle lane, and warm evening lighting designed to make the riverfront usable after dark. City corporation officials say phase three — connecting the walkway to the Hadis Park side — is expected to begin early next year.

Local residents have already embraced the space. Evening footfall has doubled since the soft opening, according to vendors who have set up tea stalls near the new entrance.

Khulna City Corporation officials noted that regular maintenance teams and waste disposal bins have been deployed along the route to keep the walkway clean and accessible.`,
      coverImage: "/images/news-1.jpg",
      author: "Nabila Rahman",
      featured: true,
      published: true,
      publishedAt: daysFromNow(-1, 14),
      categoryId: "cat-city",
      category: categoryMap.get("cat-city") ?? null,
    },
    {
      id: "news-2",
      slug: "khulna-kacchi-alley-food-map",
      title: "A Food Map of Khulna's Unofficial 'Kacchi Alley' in Boyra",
      excerpt:
        "Six kacchi houses, one lane, and a Friday queue that starts before noon. We mapped the Boyra strip every Khulna foodie argues about.",
      content: `Ask ten people in Khulna where the best kacchi is and you will get eleven answers — most of them pointing to the same lane in Boyra.

We spent three Fridays eating our way down the strip, from the old-guard houses that have served the same recipe for decades to the newer shops experimenting with borhani pairings and family-sized takeaway packs.

The key to the lane's enduring popularity is the slow-cooked mutton, seasoned with balanced whole spices and signature potatoes that melt at the touch.

Whether you prefer the aromatic, saffron-infused rice of the heritage spots or the rich, spicy cuts at the newer joints, Boyra's Kacchi Alley remains an essential weekend ritual for locals and visitors alike.`,
      coverImage: "/images/news-2.jpg",
      author: "Tanvir Hasan",
      featured: true,
      published: true,
      publishedAt: daysFromNow(-2, 11),
      categoryId: "cat-food-news",
      category: categoryMap.get("cat-food-news") ?? null,
      externalUrl: "https://example.com/full-kacchi-alley-story",
    },
    {
      id: "news-3",
      slug: "sundarbans-tourism-season-opens-2026",
      title: "Sundarbans Tourism Season Opens: New Permits, New Routes from Mongla",
      excerpt:
        "The forest department has opened bookings for the winter season, with two new overnight routes departing from Mongla port and an online permit system.",
      content: `The winter tourism season for the Sundarbans officially opens next month, and this year there are real changes for travellers departing through Khulna and Mongla.

Permits move online for the first time, and two new overnight launch routes — including one that reaches Katka in a single tide window — have been approved.

Operators in Khulna say early bookings are already running ahead of last year. Local boat masters emphasize safety guidelines and strict adherence to eco-tourism norms to preserve the mangrove sanctuary.`,
      coverImage: "/images/news-3.jpg",
      author: "Khulna Bites Desk",
      featured: false,
      published: true,
      publishedAt: daysFromNow(-3, 9),
      categoryId: "cat-culture",
      category: categoryMap.get("cat-culture") ?? null,
    },
    {
      id: "news-4",
      slug: "kuet-robotics-team-national-win",
      title: "KUET Robotics Team Wins National Championship in Dhaka",
      excerpt:
        "A four-student team from KUET took first place at the national university robotics challenge with a flood-rescue drone prototype.",
      content: `A team of four final-year students from Khulna University of Engineering & Technology has won the national inter-university robotics championship held in Dhaka this weekend.

Their entry — a low-cost flood-rescue drone designed for riverine districts — beat 31 other university teams. The judges cited its practical design for southern Bangladesh conditions.

The team plans to collaborate with local disaster management authorities to test field deployments ahead of the next monsoon season.`,
      coverImage: "/images/news-4.jpg",
      author: "Sadia Afrin",
      featured: false,
      published: true,
      publishedAt: daysFromNow(-4, 16),
      categoryId: "cat-city",
      category: categoryMap.get("cat-city") ?? null,
    },
    {
      id: "news-5",
      slug: "monsoon-drain-cleanup-kcc",
      title: "Before the Rains: KCC Finishes Drain Cleanup in 12 Wards",
      excerpt:
        "The city corporation says major drains in 12 wards have been cleared ahead of peak monsoon, with ward-level complaint desks opening next week.",
      content: `Khulna City Corporation has completed its pre-monsoon drain cleanup across 12 wards, officials confirmed this week.

Ward-level complaint desks open next week for residents to report waterlogging. Last year the same programme reduced reported flooding incidents by roughly a third.

Residents can reach the dedicated helpline or submit notes via their local ward council offices for any unaddressed canal blockages.`,
      coverImage: "/images/news-5.jpg",
      author: "Khulna Bites Desk",
      featured: false,
      published: true,
      publishedAt: daysFromNow(-6, 10),
      categoryId: "cat-city",
      category: categoryMap.get("cat-city") ?? null,
    },
    {
      id: "news-6",
      slug: "khulna-shipyard-orders-rebound",
      title: "Khulna Shipyard Order Book Rebounds with Three New Contracts",
      excerpt:
        "After two quiet years, Khulna Shipyard has signed three new vessel contracts, including a coastal tanker for a local operator.",
      content: `Khulna Shipyard has signed contracts for three new vessels, its strongest order intake in two years, according to industry sources.

The orders include a coastal tanker for a Khulna-based operator and two inland cargo vessels. Work is expected to keep the yard's docks busy well into next year.

The expansion also creates skilled fabrication and marine engineering roles for young technicians across the division.`,
      coverImage: "/images/news-6.jpg",
      author: "Rafid Chowdhury",
      featured: false,
      published: true,
      publishedAt: daysFromNow(-8, 12),
      categoryId: "cat-business",
      category: categoryMap.get("cat-business") ?? null,
    },
  ];
}

// ─── Offers ─────────────────────────────────────────────────────────────────

export function getDemoOffers(): Offer[] {
  return [
    {
      id: "offer-1",
      slug: "boyra-biryani-house-20-off",
      title: "Flat 20% Off All Kacchi Platters",
      businessName: "Boyra Biryani House",
      description:
        "Weekday lunch special: flat 20% off every kacchi and morog polao platter, dine-in only. Mention Khulna Bites at the counter.",
      value: "20% OFF",
      coverImage: "/images/offer-1.jpg",
      location: "Boyra Main Road, Khulna",
      contact: "019XX-XXX-XXX",
      terms: "Dine-in only. Weekdays 12:00–16:00. Cannot be combined with other discounts.",
      active: true,
      startDate: daysFromNow(-5),
      expiryDate: daysFromNow(25),
      categoryId: "cat-food",
      category: categoryMap.get("cat-food") ?? null,
    },
    {
      id: "offer-2",
      slug: "milestone-cafe-buy-1-get-1",
      title: "Buy 1 Get 1 Free on All Espresso Drinks",
      businessName: "Milestone Café",
      description:
        "Evening happy hours at Milestone: every espresso-based drink comes with a second one free, Sunday to Thursday.",
      value: "Buy 1 Get 1",
      coverImage: "/images/offer-2.jpg",
      location: "Sonadanga R/A, 2nd Phase, Khulna",
      contact: "017XX-XXX-XXX",
      terms: "17:00–20:00, Sun–Thu. Both drinks must be the same size.",
      active: true,
      startDate: daysFromNow(-3),
      expiryDate: daysFromNow(18),
      categoryId: "cat-cafe",
      category: categoryMap.get("cat-cafe") ?? null,
    },
    {
      id: "offer-3",
      slug: "aarong-lane-eid-collection-30",
      title: "Eid Collection Preview — Flat 30% Off",
      businessName: "Aarong Lane (Demo)",
      description:
        "Early-bird discount on the new festive collection: flat 30% off selected punjabis, kurtas and sarees while stock lasts.",
      value: "30% OFF",
      coverImage: "/images/offer-3.jpg",
      location: "KDA Avenue, Khulna",
      terms: "Selected items only. No exchange on discounted items.",
      active: true,
      startDate: daysFromNow(-2),
      expiryDate: daysFromNow(12),
      categoryId: "cat-fashion",
      category: categoryMap.get("cat-fashion") ?? null,
    },
    {
      id: "offer-4",
      slug: "gadget-point-exchange-bonus",
      title: "Old Phone Exchange Bonus Worth ৳2,000",
      businessName: "Gadget Point Khulna",
      description:
        "Trade in any working smartphone and get an extra ৳2,000 exchange bonus on top of the evaluated price when you upgrade in-store.",
      value: "৳2,000 Bonus",
      coverImage: "/images/offer-4.jpg",
      location: "New Market Road, Khulna",
      contact: "016XX-XXX-XXX",
      terms: "Device must power on. Valuation at store discretion.",
      active: true,
      startDate: daysFromNow(-7),
      expiryDate: daysFromNow(30),
      categoryId: "cat-shopping",
      category: categoryMap.get("cat-shopping") ?? null,
    },
    {
      id: "offer-5",
      slug: "cool-care-ac-servicing-999",
      title: "Full AC Servicing at ৳999 (Home Service)",
      businessName: "Cool Care Services",
      description:
        "Split AC full servicing — filter wash, gas pressure check, coil clean — at your doorstep anywhere in Khulna city.",
      value: "৳999 Flat",
      coverImage: "/images/offer-5.jpg",
      location: "All Khulna city areas",
      contact: "018XX-XXX-XXX",
      terms: "Booking required 1 day ahead. Spare parts billed separately.",
      active: true,
      startDate: daysFromNow(-1),
      expiryDate: daysFromNow(20),
      categoryId: "cat-services",
      category: categoryMap.get("cat-services") ?? null,
    },
    {
      id: "offer-6",
      slug: "expired-demo-offer",
      title: "Monsoon Umbrella Sale (Expired Demo)",
      businessName: "City Mart",
      description:
        "This offer has already expired — it demonstrates how expired offers disappear from the public list automatically.",
      value: "40% OFF",
      coverImage: "/images/offer-5.jpg",
      location: "Daulatpur, Khulna",
      active: true,
      startDate: daysFromNow(-40),
      expiryDate: daysFromNow(-5),
      categoryId: "cat-shopping",
      category: categoryMap.get("cat-shopping") ?? null,
    },
  ];
}

// ─── Events ─────────────────────────────────────────────────────────────────

export function getDemoEvents(): Event[] {
  return [
    {
      id: "event-1",
      slug: "khulna-food-fest-2026",
      title: "Khulna Food Fest 2026",
      description: `Three days of the city's best food — 40+ stalls from Boyra to Khalishpur, live cooking demos, a kacchi showdown, and an evening stage with local bands.

Family zone, prayer space, and on-site parking available at the venue.

Come with family and friends to taste traditional sweets, spicy grills, seafood specialties, and live culinary battles between top Khulna chefs.`,
      coverImage: "/images/event-1.jpg",
      date: daysFromNow(14, 16),
      startTime: "16:00",
      endTime: "23:00",
      venue: "Khulna Zila School Field",
      location: "KDA Avenue, Khulna",
      organizer: "Khulna Foodies Community",
      ticketPrice: "৳100 entry",
      capacity: 500,
      bookingEnabled: true,
      published: true,
      _count: { bookings: 24 },
    },
    {
      id: "event-2",
      slug: "borsha-utshob-open-air-concert",
      title: "Borsha Utshob — Open-Air Monsoon Concert",
      description: `An evening of monsoon songs by the Rupsha — rabindra sangeet, folk, and contemporary sets from Khulna and Dhaka artists.

Bring an umbrella; the show goes on in light rain. Hot tea, khichuri boxes, and acoustic performances right by the riverfront promenade.`,
      coverImage: "/images/event-2.jpg",
      date: daysFromNow(21, 18),
      startTime: "18:30",
      endTime: "22:30",
      venue: "Rupsha Riverfront Amphitheatre",
      location: "Labonchora, Khulna",
      organizer: "Borsha Cultural Group",
      ticketPrice: "৳300",
      capacity: 300,
      bookingEnabled: true,
      published: true,
      _count: { bookings: 85 },
    },
    {
      id: "event-3",
      slug: "rupsha-photography-walk-september",
      title: "Rupsha Photography Walk — Golden Hour Edition",
      description: `A free guided photo walk along the riverfront at golden hour, hosted by Khulna Photography Club. All skill levels welcome — bring any camera, phones included.

We will start at Khan Jahan Ali Bridge, capture the river traffic and boats under golden light, and finish with a photo critique session over evening tea.`,
      coverImage: "/images/event-3.jpg",
      date: daysFromNow(7, 16),
      startTime: "16:30",
      endTime: "19:00",
      venue: "Khan Jahan Ali Bridge (south end)",
      location: "Rupsha, Khulna",
      organizer: "Khulna Photography Club",
      ticketPrice: "Free",
      capacity: 40,
      bookingEnabled: true,
      published: true,
      _count: { bookings: 32 },
    },
    {
      id: "event-4",
      slug: "startup-khulna-meetup-vol-4",
      title: "Startup Khulna Meetup Vol. 4",
      description: `Founders, freelancers and students — an evening of lightning talks, a local SaaS demo, and open networking. Co-hosted with a Khulna University career club.

Meet local tech entrepreneurs, find co-founders or talent, and learn how teams in Khulna build digital products for global markets.`,
      coverImage: "/images/event-4.jpg",
      date: daysFromNow(10, 17),
      startTime: "17:00",
      endTime: "20:00",
      venue: "Southeast Auditorium, Khulna",
      location: "Sonadanga, Khulna",
      organizer: "Startup Khulna",
      ticketPrice: "৳200 (includes snacks)",
      bookingUrl: "https://example.com/startup-khulna-vol-4-tickets",
      capacity: 150,
      bookingEnabled: true,
      published: true,
      _count: { bookings: 60 },
    },
    {
      id: "event-5",
      slug: "inter-school-cricket-final-2026",
      title: "Inter-School Cricket Final — Khulna Division",
      description: `The final of the inter-school T20 cup. Gates open at 8:00, first ball at 9:00. Entry is free; seating is first-come-first-served.

Cheer for the young sporting talents representing top schools across the Khulna division in an electrifying atmosphere.`,
      coverImage: "/images/event-5.jpg",
      date: daysFromNow(4, 9),
      startTime: "09:00",
      endTime: "13:00",
      venue: "Sheikh Abu Naser Stadium",
      location: "Khalishpur, Khulna",
      organizer: "Khulna District Sports Association",
      ticketPrice: "Free entry",
      capacity: 2000,
      bookingEnabled: false,
      published: true,
      _count: { bookings: 0 },
    },
  ];
}

// ─── Public Query Functions ─────────────────────────────────────────────────

export async function getCategories(type?: "NEWS" | "OFFER"): Promise<Category[]> {
  if (!type) return DEMO_CATEGORIES;
  return DEMO_CATEGORIES.filter((c) => c.type === type);
}

export async function getNewsArticles(options?: {
  category?: string;
  query?: string;
  take?: number;
  featuredOnly?: boolean;
}): Promise<NewsArticle[]> {
  let list = getDemoNewsArticles().filter((a) => a.published);

  if (options?.category) {
    list = list.filter((a) => a.category?.slug === options.category);
  }

  if (options?.query) {
    const q = options.query.toLowerCase().trim();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
    );
  }

  if (options?.featuredOnly) {
    list = list.filter((a) => a.featured);
  }

  list.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.publishedAt.getTime() - a.publishedAt.getTime();
  });

  if (options?.take) {
    list = list.slice(0, options.take);
  }

  return list;
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const list = getDemoNewsArticles();
  return list.find((a) => a.slug === slug && a.published) ?? null;
}

export async function getRelatedNewsArticles(
  slug: string,
  categoryId?: string | null,
  limit = 3
): Promise<NewsArticle[]> {
  const list = getDemoNewsArticles().filter((a) => a.published && a.slug !== slug);
  if (categoryId) {
    const sameCategory = list.filter((a) => a.categoryId === categoryId);
    if (sameCategory.length > 0) {
      return sameCategory.slice(0, limit);
    }
  }
  return list.slice(0, limit);
}

export async function getOffers(options?: {
  category?: string;
  activeOnly?: boolean;
  take?: number;
}): Promise<Offer[]> {
  const today = startOfToday();
  let list = getDemoOffers();

  if (options?.activeOnly ?? true) {
    list = list.filter((o) => o.active && o.expiryDate >= today);
  }

  if (options?.category) {
    list = list.filter((o) => o.category?.slug === options.category);
  }

  list.sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());

  if (options?.take) {
    list = list.slice(0, options.take);
  }

  return list;
}

export async function getOfferBySlug(slug: string): Promise<Offer | null> {
  const list = getDemoOffers();
  return list.find((o) => o.slug === slug) ?? null;
}

export async function getEvents(options?: {
  upcoming?: boolean;
  past?: boolean;
  take?: number;
}): Promise<Event[]> {
  const today = startOfToday();
  let list = getDemoEvents().filter((e) => e.published);

  if (options?.upcoming) {
    list = list.filter((e) => e.date >= today);
    list.sort((a, b) => a.date.getTime() - b.date.getTime());
  } else if (options?.past) {
    list = list.filter((e) => e.date < today);
    list.sort((a, b) => b.date.getTime() - a.date.getTime());
  } else {
    list.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  if (options?.take) {
    list = list.slice(0, options.take);
  }

  return list;
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const list = getDemoEvents();
  return list.find((e) => e.slug === slug && e.published) ?? null;
}

export function getAllNewsSlugs(): string[] {
  return getDemoNewsArticles().map((a) => a.slug);
}

export function getAllOfferSlugs(): string[] {
  return getDemoOffers().map((o) => o.slug);
}

export function getAllEventSlugs(): string[] {
  return getDemoEvents().map((e) => e.slug);
}
