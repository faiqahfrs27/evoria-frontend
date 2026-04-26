export interface TicketType {
  id: string;
  name: string;
  price: number;
  quota: number;
}

export interface Organizer {
  id: string;
  name: string;
  email: string;
  profilePic?: string | null;
}

export interface Event {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  isFree: boolean;
  availableSeats: number;
  totalSeats: number;
  imageUrl: string | null;
  organizer: Organizer;
  ticketTypes: TicketType[];
  createdAt: string;
  updatedAt: string;
  vouchers?: Voucher[];
}

export type Voucher = {
  id: string;
  code: string;
  discountAmount?: number;
  discount?: number;
  discountValue?: number;
  value?: number;
  quota?: number;
  startDate?: string;
  endDate?: string;
};
