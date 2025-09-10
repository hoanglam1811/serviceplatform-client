import { CreateReviewDTO, ReviewDTO, UpdateReviewDTO } from "@/types/review"
import api from "./api"

export const createReview = async (dto: CreateReviewDTO) => {
    const res = await api.post("/review", dto)
    return res.data
}

// READ - Get all
export const getAllReviews = async (): Promise<ReviewDTO[]> => {
    const res = await api.get("/review")
    return res.data.data
}

// READ - Get by Id
export const getReviewById = async (id: string): Promise<ReviewDTO> => {
    const res = await api.get(`/review/${id}`)
    return res.data.data
}

// READ - Get by booking Id
export const getReviewsByBookingId = async (bookingId: string): Promise<ReviewDTO[]> => {
    const res = await api.get(`/review/booking/${bookingId}`)
    return res.data.data
}

// UPDATE
export const updateReview = async (id: string, dto: UpdateReviewDTO) => {
    const res = await api.put(`/review/${id}`, dto)
    return res.data
}

// DELETE
export const deleteReview = async (id: string) => {
    const res = await api.delete(`/review/${id}`)
    return res.data
}