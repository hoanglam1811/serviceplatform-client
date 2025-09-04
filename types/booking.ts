export interface Booking {
  id: string
  serviceId: string
  customerId: string
  providerId: string
  serviceTitle: string
  providerName: string
  customerName: string
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
  bookingDate: Date
  scheduledDate: Date
  scheduledTime: string
  completionDate?: Date
  price: number
  paymentStatus: "pending" | "paid" | "refunded"
  requirements?: string
  notes?: string
  rating?: number
  review?: string
  createdAt: Date
  updatedAt: Date
}

export interface BookingRequest {
  userId: string
  serviceId: string
  startTime: Date
  endTime: Date
  status: string
  paymentStatus: string
  note?: string
}

export interface CreateBookingDTO {
  userId: string
  serviceId: string
  startTime: Date
  endTime: Date
  status: string
  paymentStatus: string
  note?: string
}

export interface UpdateBookingDTO {
  id: string;
  serviceId: string;
  status: string;
}

export interface BookingDTO {
  id: string;
  userId: string;
  serviceId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}


