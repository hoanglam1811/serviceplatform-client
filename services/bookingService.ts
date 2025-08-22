import api from "./api";

// DTO types (adjust based on your backend)
export interface CreateBookingDTO {
  userId: string;
  serviceId: string;
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

// CREATE
export const createBooking = async (dto: CreateBookingDTO) => {
  const res = await api.post("/booking", dto);
  return res.data;
};

// READ - Get all
export const getAllBookings = async () => {
  const res = await api.get("/booking");
  return res.data;
};

// READ - Get by Id
export const getBookingById = async (id: string) => {
  const res = await api.get(`/booking/${id}`);
  return res.data;
};

// UPDATE
export const updateBooking = async (id: string, dto: UpdateBookingDTO) => {
  const res = await api.put(`/booking/${id}`, dto);
  return res.data;
};

// DELETE
export const deleteBooking = async (id: string) => {
  const res = await api.delete(`/booking/${id}`);
  return res.data;
};

// GET by UserId
export const getBookingsByUserId = async (userId: string) => {
  const res = await api.get(`/booking/user/${userId}`);
  return res.data;
};

// GET by ServiceId
export const getBookingsByServiceId = async (serviceId: string) => {
  const res = await api.get(`/booking/service/${serviceId}`);
  return res.data;
};

// UPDATE STATUS
export const updateBookingStatus = async (id: string, status: string) => {
  const res = await api.put(`/booking/${id}/status`, null, {
    params: { status },
  });
  return res.data;
};
