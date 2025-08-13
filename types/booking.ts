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
  serviceId: string
  scheduledDate: Date
  scheduledTime: string
  requirements?: string
  notes?: string
}
