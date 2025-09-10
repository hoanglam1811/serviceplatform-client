import { Service } from "./service"

export interface Booking {
  id: string
  userId: string
  serviceId: string
  startTime: Date
  endTime: Date
  status: string
  paymentStatus: string
  note?: string
  createdAt: Date
  updatedAt: Date
  service: Service
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


