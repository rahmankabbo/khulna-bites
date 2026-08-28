/**
 * Seed script — loads realistic demo content so the site looks complete.
 *
 *   npm run db:seed
 *
 * Safe to re-run: it clears existing demo rows first (destructive!).
 * The first admin account comes from ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD
 * in your .env file.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const daysFromNow = (n: number, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, 0, 0, 0);
  return d;
};

async function main() {
  console.log("Clearing existing data…");
  await db.booking.deleteMany();
  await db.businessInquiry.deleteMany();
  await db.event.deleteMany();
  await db.offer.deleteMany();
  await db.newsArticle.deleteMany();
  await db.category.deleteMany();
  await db.admin.deleteMany();

  // ─── Admin ────────────────────────────────────────────────────────────────
  const email = process.env.ADMIN_SEED_EMAIL ?? "admin@khulnabites.com";
  const password = process.env.ADMIN_SEED_PASSWORD ?? "khulna123";
  await db.admin.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 10),
      name: "Site Admin",
    },
  });
  console.log(`Admin created: ${email}`);

  // ─── Categories ───────────────────────────────────────────────────────────
  const cat = async (name: string, slug: string, type: "NEWS" | "OFFER") =>
    db.category.create({ data: { name, slug, type } });

  const cCity = await cat("City", "city", "NEWS");
  const cFoodNews = await cat("Food", "food-news", "NEWS");
  const cCulture = await cat("Culture", "culture", "NEWS");
  const cBusiness = await cat("Business", "business", "NEWS");

  const oFood = await cat("Food", "food", "OFFER");
  const oCafe = await cat("Cafe", "cafe", "OFFER");
  const oFashion = await cat("Fashion", "fashion", "OFFER");
  const oShopping = await cat("Shopping", "shopping", "OFFER");
  const oServices = await cat("Services", "services", "OFFER");

  // ─── News ─────────────────────────────────────────────────────────────────
  const news = [
    {
      slug: "rupsha-riverfront-walkway-phase-two",
      title: "Rupsha Riverfront Gets a New Walkway — Phase Two Opens to the Public",
      excerpt:
        "The second stretch of the Rupsha riverfront promenade is now open, adding 1.2 km of walkway, seating, and evening lighting between Khan Jahan Ali Bridge and Labonchora.",
      content:
        "The long-awaited second phase of the Rupsha riverfront walkway opened to the public this week, extending the promenade by 1.2 kilometres toward Labonchora.\n\nThe new stretch adds shaded seating, a dedicated cycle lane, and warm evening lighting designed to make the riverfront usable after dark. City corporation officials say phase three — connecting the walkway to the Hadis Park side — is expected to begin early next year.\n\nLocal residents have already embraced the space. Evening footfall has doubled since the soft opening, according to vendors who have set up tea stalls near the new entrance.\n\n(Demo article — seeded sample content.)",
      coverImage: "/images/news-1.jpg",
      author: "Nabila Rahman",
      featured: true,
      published: true,
      publishedAt: daysFromNow(-1),
      categoryId: cCity.id,
    },
    {
      slug: "khulna-kacchi-alley-food-map",
      title: "A Food Map of Khulna's Unofficial 'Kacchi Alley' in Boyra",
      excerpt:
        "Six kacchi houses, one lane, and a Friday queue that starts before noon. We mapped the Boyra strip every Khulna foodie argues about.",
      content:
        "Ask ten people in Khulna where the best kacchi is and you will get eleven answers — most of them pointing to the same lane in Boyra.\n\nWe spent three Fridays eating our way down the strip, from the old-guard houses that have served the same recipe for decades to the newer shops experimenting with borhani pairings and family-sized takeaway packs.\n\nThe verdict, the map, and the price list are in the full piece.\n\n(Demo article — seeded sample content.)",
      coverImage: "/images/news-2.jpg",
      author: "Tanvir Hasan",
      featured: true,
      published: true,
      publishedAt: daysFromNow(-2),
      categoryId: cFoodNews.id,
      externalUrl: "https://example.com/full-kacchi-alley-story",
    },
    {
      slug: "sundarbans-tourism-season-opens-2026",
      title: "Sundarbans Tourism Season Opens: New Permits, New Routes from Mongla",
      excerpt:
        "The forest department has opened bookings for the winter season, with two new overnight routes departing from Mongla port and an online permit system.",
      content:
        "The winter tourism season for the Sundarbans officially opens next month, and this year there are real changes for travellers departing through Khulna and Mongla.\n\nPermits move online for the first time, and two new overnight launch routes — including one that reaches Katka in a single tide window — have been approved.\n\nOperators in Khulna say early bookings are already running ahead of last year.\n\n(Demo article — seeded sample content.)",
      coverImage: "/images/news-3.jpg",
      author: "Khulna Bites Desk",
      featured: false,
      published: true,
      publishedAt: daysFromNow(-3),
      categoryId: cCulture.id,
    },
    {
      slug: "kuet-robotics-team-national-win",
      title: "KUET Robotics Team Wins National Championship in Dhaka",
      excerpt:
        "A four-student team from KUET took first place at the national university robotics challenge with a flood-rescue drone prototype.",
      content:
        "A team of four final-year students from Khulna University of Engineering & Technology has won the national inter-university robotics championship held in Dhaka this weekend.\n\nTheir entry — a low-cost flood-rescue drone designed for riverine districts — beat 31 other university teams. The judges cited its practical design for southern Bangladesh conditions.\n\n(Demo article — seeded sample content.)",
      coverImage: "/images/news-4.jpg",
      author: "Sadia Afrin",
      featured: false,
      published: true,
      publishedAt: daysFromNow(-4),
      categoryId: cCity.id,
    },
    {
      slug: "monsoon-drain-cleanup-kcc",
      title: "Before the Rains: KCC Finishes Drain Cleanup in 12 Wards",
      excerpt:
        "The city corporation says major drains in 12 wards have been cleared ahead of peak monsoon, with ward-level complaint desks opening next week.",
      content:
        "Khulna City Corporation has completed its pre-monsoon drain cleanup across 12 wards, officials confirmed this week.\n\nWard-level complaint desks open next week for residents to report waterlogging. Last year the same programme reduced reported flooding incidents by roughly a third.\n\n(Demo article — seeded sample content.)",
      coverImage: "/images/news-5.jpg",
      author: "Khulna Bites Desk",
      featured: false,
      published: true,
      publishedAt: daysFromNow(-6),
      categoryId: cCity.id,
    },
    {
      slug: "khulna-shipyard-orders-rebound",
      title: "Khulna Shipyard Order Book Rebounds with Three New Contracts",
      excerpt:
        "After two quiet years, Khulna Shipyard has signed three new vessel contracts, including a coastal tanker for a local operator.",
      content:
        "Khulna Shipyard has signed contracts for three new vessels, its strongest order intake in two years, according to industry sources.\n\nThe orders include a coastal tanker for a Khulna-based operator and two inland cargo vessels. Work is expected to keep the yard's docks busy well into next year.\n\n(Demo article — seeded sample content.)",
      coverImage: "/images/news-6.jpg",
      author: "Rafid Chowdhury",
      featured: false,
      published: true,
      publishedAt: daysFromNow(-8),
      categoryId: cBusiness.id,
    },
  ];
  for (const n of news) await db.newsArticle.create({ data: n });
  console.log(`News: ${news.length}`);

  // ─── Offers ───────────────────────────────────────────────────────────────
  const offers = [
    {
      slug: "boyra-biryani-house-20-off",
      title: "Flat 20% Off All Kacchi Platters",
      businessName: "Boyra Biryani House",
      description:
        "Weekday lunch special: flat 20% off every kacchi and morog polao platter, dine-in only. Mention Khulna Bites at the counter.",
      value: "20% OFF",
      coverImage: "/images/offer-1.jpg",
      location: "Boyra Main Road, Khulna",
      contact: "019XX-XXX-XXX (demo)",
      terms: "Dine-in only. Weekdays 12:00–16:00. Cannot be combined with other discounts. (Demo offer.)",
      active: true,
      startDate: daysFromNow(-5),
      expiryDate: daysFromNow(25),
      categoryId: oFood.id,
    },
    {
      slug: "milestone-cafe-buy-1-get-1",
      title: "Buy 1 Get 1 Free on All Espresso Drinks",
      businessName: "Milestone Café",
      description:
        "Evening happy hours at Milestone: every espresso-based drink comes with a second one free, Sunday to Thursday.",
      value: "Buy 1 Get 1",
      coverImage: "/images/offer-2.jpg",
      location: "Sonadanga R/A, 2nd Phase, Khulna",
      contact: "017XX-XXX-XXX (demo)",
      terms: "17:00–20:00, Sun–Thu. Both drinks must be the same size. (Demo offer.)",
      active: true,
      startDate: daysFromNow(-3),
      expiryDate: daysFromNow(18),
      categoryId: oCafe.id,
    },
    {
      slug: "aarong-lane-eid-collection-30",
      title: "Eid Collection Preview — Flat 30% Off",
      businessName: "Aarong Lane (Demo)",
      description:
        "Early-bird discount on the new festive collection: flat 30% off selected punjabis, kurtas and sarees while stock lasts.",
      value: "30% OFF",
      coverImage: "/images/offer-3.jpg",
      location: "KDA Avenue, Khulna",
      terms: "Selected items only. No exchange on discounted items. (Demo offer.)",
      active: true,
      startDate: daysFromNow(-2),
      expiryDate: daysFromNow(12),
      categoryId: oFashion.id,
    },
    {
      slug: "gadget-point-exchange-bonus",
      title: "Old Phone Exchange Bonus Worth ৳2,000",
      businessName: "Gadget Point Khulna",
      description:
        "Trade in any working smartphone and get an extra ৳2,000 exchange bonus on top of the evaluated price when you upgrade in-store.",
      value: "৳2,000 Bonus",
      coverImage: "/images/offer-4.jpg",
      location: "New Market Road, Khulna",
      contact: "016XX-XXX-XXX (demo)",
      terms: "Device must power on. Valuation at store discretion. (Demo offer.)",
      active: true,
      startDate: daysFromNow(-7),
      expiryDate: daysFromNow(30),
      categoryId: oShopping.id,
    },
    {
      slug: "cool-care-ac-servicing-999",
      title: "Full AC Servicing at ৳999 (Home Service)",
      businessName: "Cool Care Services",
      description:
        "Split AC full servicing — filter wash, gas pressure check, coil clean — at your doorstep anywhere in Khulna city.",
      value: "৳999 Flat",
      coverImage: "/images/offer-5.jpg",
      location: "All Khulna city areas",
      contact: "018XX-XXX-XXX (demo)",
      terms: "Booking required 1 day ahead. Spare parts billed separately. (Demo offer.)",
      active: true,
      startDate: daysFromNow(-1),
      expiryDate: daysFromNow(20),
      categoryId: oServices.id,
    },
    {
      slug: "expired-demo-offer",
      title: "Monsoon Umbrella Sale (Expired Demo)",
      businessName: "City Mart",
      description: "This offer has already expired — it demonstrates how expired offers disappear from the public list automatically.",
      value: "40% OFF",
      coverImage: "/images/offer-5.jpg",
      location: "Daulatpur, Khulna",
      active: true,
      startDate: daysFromNow(-40),
      expiryDate: daysFromNow(-5),
      categoryId: oShopping.id,
    },
  ];
  for (const o of offers) await db.offer.create({ data: o });
  console.log(`Offers: ${offers.length}`);

  // ─── Events ───────────────────────────────────────────────────────────────
  const events = [
    {
      slug: "khulna-food-fest-2026",
      title: "Khulna Food Fest 2026",
      description:
        "Three days of the city's best food — 40+ stalls from Boyra to Khalishpur, live cooking demos, a kacchi showdown, and an evening stage with local bands.\n\nFamily zone, prayer space, and on-site parking available at the venue.",
      coverImage: "/images/event-1.jpg",
      date: daysFromNow(14),
      startTime: "16:00",
      endTime: "23:00",
      venue: "Khulna Zila School Field",
      location: "KDA Avenue, Khulna",
      organizer: "Khulna Foodies Community",
      ticketPrice: "৳100 entry",
      capacity: 500,
      bookingEnabled: true,
      published: true,
    },
    {
      slug: "borsha-utshob-open-air-concert",
      title: "Borsha Utshob — Open-Air Monsoon Concert",
      description:
        "An evening of monsoon songs by the Rupsha — rabindra sangeet, folk, and contemporary sets from Khulna and Dhaka artists.\n\nBring an umbrella; the show goes on in light rain.",
      coverImage: "/images/event-2.jpg",
      date: daysFromNow(21),
      startTime: "18:30",
      endTime: "22:30",
      venue: "Rupsha Riverfront Amphitheatre",
      location: "Labonchora, Khulna",
      organizer: "Borsha Cultural Group",
      ticketPrice: "৳300",
      capacity: 300,
      bookingEnabled: true,
      published: true,
    },
    {
      slug: "rupsha-photography-walk-september",
      title: "Rupsha Photography Walk — Golden Hour Edition",
      description:
        "A free guided photo walk along the riverfront at golden hour, hosted by Khulna Photography Club. All skill levels welcome — bring any camera, phones included.",
      coverImage: "/images/event-3.jpg",
      date: daysFromNow(7),
      startTime: "16:30",
      endTime: "19:00",
      venue: "Khan Jahan Ali Bridge (south end)",
      location: "Rupsha, Khulna",
      organizer: "Khulna Photography Club",
      ticketPrice: "Free",
      capacity: 40,
      bookingEnabled: true,
      published: true,
    },
    {
      slug: "startup-khulna-meetup-vol-4",
      title: "Startup Khulna Meetup Vol. 4",
      description:
        "Founders, freelancers and students — an evening of lightning talks, a local SaaS demo, and open networking. Co-hosted with a Khulna University career club.",
      coverImage: "/images/event-4.jpg",
      date: daysFromNow(10),
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
    },
    {
      slug: "inter-school-cricket-final-2026",
      title: "Inter-School Cricket Final — Khulna Division",
      description:
        "The final of the inter-school T20 cup. Gates open at 8:00, first ball at 9:00. Entry is free; seating is first-come-first-served.",
      coverImage: "/images/event-5.jpg",
      date: daysFromNow(4),
      startTime: "09:00",
      endTime: "13:00",
      venue: "Sheikh Abu Naser Stadium",
      location: "Khalishpur, Khulna",
      organizer: "Khulna District Sports Association",
      ticketPrice: "Free entry",
      capacity: 2000,
      bookingEnabled: false,
      published: true,
    },
    {
      slug: "draft-unpublished-demo-event",
      title: "Draft: Winter Book Fair (Unpublished Demo)",
      description: "This event is unpublished — it only appears in the admin dashboard.",
      coverImage: "/images/event-4.jpg",
      date: daysFromNow(60),
      startTime: "10:00",
      venue: "Khulna Public Library",
      organizer: "Khulna Bites",
      bookingEnabled: true,
      published: false,
    },
  ];
  const createdEvents = [];
  for (const e of events) createdEvents.push(await db.event.create({ data: e }));
  console.log(`Events: ${events.length}`);

  // ─── Bookings ─────────────────────────────────────────────────────────────
  const foodFest = createdEvents[0];
  const photoWalk = createdEvents[2];
  await db.booking.createMany({
    data: [
      { eventId: foodFest.id, name: "Arif Hossain", phone: "01711111111", email: "arif@example.com", tickets: 4, status: "CONFIRMED" },
      { eventId: foodFest.id, name: "Mim Akter", phone: "01822222222", tickets: 2, status: "PENDING" },
      { eventId: photoWalk.id, name: "Sajid Karim", phone: "01933333333", email: "sajid@example.com", tickets: 1, status: "CONFIRMED" },
    ],
  });
  console.log("Bookings: 3");

  // ─── Business inquiries ───────────────────────────────────────────────────
  await db.businessInquiry.createMany({
    data: [
      {
        name: "Farhana Yasmin",
        businessName: "Doyel Boutique",
        phone: "01744444444",
        email: "farhana@example.com",
        service: "Advertising",
        message: "We want to promote our new showroom opening in Gollamari next month. What are the banner + sponsored post options?",
        status: "NEW",
      },
      {
        name: "Rakibul Islam",
        businessName: "Khulna Runners",
        phone: "01655555555",
        service: "Event Promotion",
        message: "Planning a charity 5K in October. Would like Khulna Bites to cover it and help with registrations.",
        status: "CONTACTED",
        read: true,
      },
      {
        name: "Nusrat Jahan",
        businessName: "Café Chhaya",
        phone: "01566666666",
        email: "nusrat@example.com",
        service: "Sponsored Content",
        message: "Interested in a featured story about our rooftop café. Please share your media kit.",
        status: "NEW",
      },
    ],
  });
  console.log("Inquiries: 3");
  console.log("Seed complete ✔");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
