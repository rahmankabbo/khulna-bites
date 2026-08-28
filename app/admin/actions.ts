"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, destroySession, getAdmin } from "@/lib/auth";
import { saveUpload } from "@/lib/uploads";
import { slugify } from "@/lib/utils";

export type AdminFormState = { ok: boolean; message?: string; errors?: Record<string, string[]> };

async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** Make a slug unique by appending -2, -3, … when needed. */
async function uniqueSlug(base: string, table: "newsArticle" | "offer" | "event", excludeId?: string) {
  let slug = base || "untitled";
  let n = 1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = db[table] as any;
  while (true) {
    const found = await model.findUnique({ where: { slug } });
    if (!found || found.id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function login(_: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Enter both email and password." };
  }

  const admin = await db.admin.findUnique({ where: { email } });
  const valid = admin && (await bcrypt.compare(password, admin.passwordHash));
  if (!valid) {
    return { ok: false, message: "Incorrect email or password." };
  }

  await createSession({ adminId: admin.id, email: admin.email });
  redirect(String(formData.get("next") ?? "/admin") || "/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ─── News ───────────────────────────────────────────────────────────────────

const newsSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title is too short"),
  slug: z.string().optional(),
  excerpt: z.string().min(10, "Excerpt is too short"),
  content: z.string().min(10, "Content is too short"),
  author: z.string().min(1).default("Khulna Bites Desk"),
  externalUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  categoryId: z.string().optional(),
  featured: z.boolean(),
  published: z.boolean(),
});

export async function saveNews(_: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = newsSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    author: formData.get("author") || "Khulna Bites Desk",
    externalUrl: formData.get("externalUrl") || "",
    categoryId: formData.get("categoryId") || undefined,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };

  try {
    const uploaded = await saveUpload(formData.get("coverImage") as File | null);
    const slug = await uniqueSlug(
      slugify(parsed.data.slug || parsed.data.title),
      "newsArticle",
      parsed.data.id
    );
    const data = {
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      author: parsed.data.author,
      externalUrl: parsed.data.externalUrl || null,
      categoryId: parsed.data.categoryId || null,
      featured: parsed.data.featured,
      published: parsed.data.published,
      ...(uploaded ? { coverImage: uploaded } : {}),
    };
    if (parsed.data.id) {
      await db.newsArticle.update({ where: { id: parsed.data.id }, data });
    } else {
      if (!uploaded && !formData.get("existingImage")) {
        return { ok: false, errors: { coverImage: ["A cover image is required"] } };
      }
      await db.newsArticle.create({
        data: { ...data, coverImage: uploaded ?? String(formData.get("existingImage") ?? "") },
      });
    }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Could not save the article." };
  }

  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function deleteNews(id: string) {
  await requireAdmin();
  await db.newsArticle.delete({ where: { id } });
  revalidatePath("/admin/news");
  revalidatePath("/news");
}

export async function toggleNewsFlag(id: string, field: "published" | "featured") {
  await requireAdmin();
  const article = await db.newsArticle.findUnique({ where: { id } });
  if (!article) return;
  await db.newsArticle.update({ where: { id }, data: { [field]: !article[field] } });
  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
}

// ─── Offers ─────────────────────────────────────────────────────────────────

const offerSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title is too short"),
  slug: z.string().optional(),
  businessName: z.string().min(2, "Business name is required"),
  description: z.string().min(10, "Description is too short"),
  value: z.string().min(1, "Add the offer value, e.g. “20% OFF”"),
  location: z.string().min(2, "Location is required"),
  contact: z.string().optional(),
  terms: z.string().optional(),
  externalUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  categoryId: z.string().optional(),
  active: z.boolean(),
  startDate: z.coerce.date(),
  expiryDate: z.coerce.date(),
});

export async function saveOffer(_: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = offerSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    businessName: formData.get("businessName"),
    description: formData.get("description"),
    value: formData.get("value"),
    location: formData.get("location"),
    contact: formData.get("contact") || undefined,
    terms: formData.get("terms") || undefined,
    externalUrl: formData.get("externalUrl") || "",
    categoryId: formData.get("categoryId") || undefined,
    active: formData.get("active") === "on",
    startDate: formData.get("startDate"),
    expiryDate: formData.get("expiryDate"),
  });
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  if (parsed.data.expiryDate < parsed.data.startDate) {
    return { ok: false, errors: { expiryDate: ["Expiry must be after the start date"] } };
  }

  try {
    const uploaded = await saveUpload(formData.get("coverImage") as File | null);
    const slug = await uniqueSlug(
      slugify(parsed.data.slug || `${parsed.data.businessName}-${parsed.data.title}`),
      "offer",
      parsed.data.id
    );
    const data = {
      title: parsed.data.title,
      slug,
      businessName: parsed.data.businessName,
      description: parsed.data.description,
      value: parsed.data.value,
      location: parsed.data.location,
      contact: parsed.data.contact || null,
      terms: parsed.data.terms || null,
      externalUrl: parsed.data.externalUrl || null,
      categoryId: parsed.data.categoryId || null,
      active: parsed.data.active,
      startDate: parsed.data.startDate,
      expiryDate: parsed.data.expiryDate,
      ...(uploaded ? { coverImage: uploaded } : {}),
    };
    if (parsed.data.id) {
      await db.offer.update({ where: { id: parsed.data.id }, data });
    } else {
      if (!uploaded && !formData.get("existingImage")) {
        return { ok: false, errors: { coverImage: ["A cover image is required"] } };
      }
      await db.offer.create({
        data: { ...data, coverImage: uploaded ?? String(formData.get("existingImage") ?? "") },
      });
    }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Could not save the offer." };
  }

  revalidatePath("/");
  revalidatePath("/offers");
  revalidatePath("/admin/offers");
  redirect("/admin/offers");
}

export async function deleteOffer(id: string) {
  await requireAdmin();
  await db.offer.delete({ where: { id } });
  revalidatePath("/admin/offers");
  revalidatePath("/offers");
}

export async function toggleOfferActive(id: string) {
  await requireAdmin();
  const offer = await db.offer.findUnique({ where: { id } });
  if (!offer) return;
  await db.offer.update({ where: { id }, data: { active: !offer.active } });
  revalidatePath("/admin/offers");
  revalidatePath("/offers");
  revalidatePath("/");
}

// ─── Events ─────────────────────────────────────────────────────────────────

const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title is too short"),
  slug: z.string().optional(),
  description: z.string().min(10, "Description is too short"),
  date: z.coerce.date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM").or(z.literal("")).optional(),
  venue: z.string().min(2, "Venue is required"),
  location: z.string().optional(),
  organizer: z.string().optional(),
  ticketPrice: z.string().optional(),
  bookingUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  capacity: z.coerce.number().int().positive().optional().or(z.literal("")),
  bookingEnabled: z.boolean(),
  published: z.boolean(),
});

export async function saveEvent(_: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = eventSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime") || "",
    venue: formData.get("venue"),
    location: formData.get("location") || undefined,
    organizer: formData.get("organizer") || undefined,
    ticketPrice: formData.get("ticketPrice") || undefined,
    bookingUrl: formData.get("bookingUrl") || "",
    capacity: formData.get("capacity") || "",
    bookingEnabled: formData.get("bookingEnabled") === "on",
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };

  try {
    const uploaded = await saveUpload(formData.get("coverImage") as File | null);
    const slug = await uniqueSlug(
      slugify(parsed.data.slug || parsed.data.title),
      "event",
      parsed.data.id
    );
    const data = {
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      date: parsed.data.date,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime || null,
      venue: parsed.data.venue,
      location: parsed.data.location || null,
      organizer: parsed.data.organizer || null,
      ticketPrice: parsed.data.ticketPrice || null,
      bookingUrl: parsed.data.bookingUrl || null,
      capacity: parsed.data.capacity === "" ? null : (parsed.data.capacity ?? null),
      bookingEnabled: parsed.data.bookingEnabled,
      published: parsed.data.published,
      ...(uploaded ? { coverImage: uploaded } : {}),
    };
    if (parsed.data.id) {
      await db.event.update({ where: { id: parsed.data.id }, data });
    } else {
      if (!uploaded && !formData.get("existingImage")) {
        return { ok: false, errors: { coverImage: ["A cover image is required"] } };
      }
      await db.event.create({
        data: { ...data, coverImage: uploaded ?? String(formData.get("existingImage") ?? "") },
      });
    }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Could not save the event." };
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  await db.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function toggleEventFlag(id: string, field: "published" | "bookingEnabled") {
  await requireAdmin();
  const event = await db.event.findUnique({ where: { id } });
  if (!event) return;
  await db.event.update({ where: { id }, data: { [field]: !event[field] } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function updateBookingStatus(id: string, status: "PENDING" | "CONFIRMED" | "CANCELLED") {
  await requireAdmin();
  await db.booking.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}

export async function deleteBooking(id: string, eventId: string) {
  await requireAdmin();
  await db.booking.delete({ where: { id } });
  revalidatePath(`/admin/events/${eventId}/bookings`);
}

// ─── Business inquiries ─────────────────────────────────────────────────────

export async function setInquiryRead(id: string, read: boolean) {
  await requireAdmin();
  await db.businessInquiry.update({ where: { id }, data: { read } });
  revalidatePath("/admin/inquiries");
}

export async function setInquiryStatus(id: string, status: "NEW" | "CONTACTED" | "CLOSED") {
  await requireAdmin();
  await db.businessInquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiry(id: string) {
  await requireAdmin();
  await db.businessInquiry.delete({ where: { id } });
  revalidatePath("/admin/inquiries");
}
