"use server";

import { z } from "zod";
import { db } from "@/lib/db";

/**
 * Public form actions: event bookings and business inquiries.
 * Both validate with zod and return field errors the forms can display.
 */

export type FormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const bookingSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(2, "Please enter your full name"),
  phone: z
    .string()
    .min(6, "Please enter a valid phone number")
    .regex(/^[+\d][\d\s-]{5,}$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").or(z.literal("")).optional(),
  tickets: z.coerce.number().int().min(1, "At least 1 ticket").max(20, "Maximum 20 tickets per booking"),
});

export async function createBooking(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = bookingSchema.safeParse({
    eventId: formData.get("eventId"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    tickets: formData.get("tickets"),
  });
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const event = await db.event.findUnique({
    where: { id: parsed.data.eventId },
    include: { _count: { select: { bookings: { where: { status: { not: "CANCELLED" } } } } } },
  });
  if (!event || !event.published || !event.bookingEnabled) {
    return { ok: false, message: "Booking is not available for this event." };
  }
  if (event.capacity) {
    const taken = await db.booking.aggregate({
      where: { eventId: event.id, status: { not: "CANCELLED" } },
      _sum: { tickets: true },
    });
    const remaining = event.capacity - (taken._sum.tickets ?? 0);
    if (parsed.data.tickets > remaining) {
      return {
        ok: false,
        message: remaining > 0 ? `Only ${remaining} tickets left for this event.` : "This event is fully booked.",
      };
    }
  }

  await db.booking.create({
    data: {
      eventId: event.id,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      tickets: parsed.data.tickets,
    },
  });

  return { ok: true, message: "Booking received! The organizer will confirm by phone." };
}

const inquirySchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  businessName: z.string().min(2, "Please enter your business name"),
  phone: z
    .string()
    .min(6, "Please enter a valid phone number")
    .regex(/^[+\d][\d\s-]{5,}$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").or(z.literal("")).optional(),
  service: z.enum(["Advertising", "Sponsored Content", "Event Promotion", "Business Collaboration"]),
  message: z.string().min(10, "Tell us a little more (at least 10 characters)"),
});

export async function createInquiry(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = inquirySchema.safeParse({
    name: formData.get("name"),
    businessName: formData.get("businessName"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    service: formData.get("service"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  await db.businessInquiry.create({
    data: { ...parsed.data, email: parsed.data.email || null },
  });

  return { ok: true, message: "Thanks! The Khulna Bites team will get back to you within 2 working days." };
}
