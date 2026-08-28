/**
 * Khulna Bites — Core Data Types
 * These types match the Prisma schema models and allow public pages
 * and components to render cleanly without requiring Prisma client runtime.
 */

export type CategoryType = "NEWS" | "OFFER";

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  createdAt?: Date | string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  externalUrl?: string | null;
  featured: boolean;
  published: boolean;
  publishedAt: Date;
  categoryId?: string | null;
  category?: Category | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Offer {
  id: string;
  slug: string;
  title: string;
  businessName: string;
  description: string;
  value: string;
  coverImage: string;
  location: string;
  contact?: string | null;
  terms?: string | null;
  externalUrl?: string | null;
  active: boolean;
  startDate: Date;
  expiryDate: Date;
  categoryId?: string | null;
  category?: Category | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  date: Date;
  startTime: string;
  endTime?: string | null;
  venue: string;
  location?: string | null;
  organizer?: string | null;
  ticketPrice?: string | null;
  bookingUrl?: string | null;
  capacity?: number | null;
  bookingEnabled: boolean;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  _count?: {
    bookings: number;
  };
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Booking {
  id: string;
  eventId: string;
  name: string;
  phone: string;
  email?: string | null;
  tickets: number;
  status: BookingStatus;
  note?: string | null;
  createdAt: Date;
}

export type InquiryStatus = "NEW" | "CONTACTED" | "CLOSED";

export interface BusinessInquiry {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email?: string | null;
  service: string;
  message: string;
  read: boolean;
  status: InquiryStatus;
  createdAt: Date;
}
