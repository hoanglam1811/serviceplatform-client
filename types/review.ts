export interface ReviewDTO {
    id: string
    bookingId: string
    rating?: number
    comment?: string
    createdAt?: string
    updatedAt?: string
}

export interface CreateReviewDTO {
    bookingId: string
    rating: number
    comment: string
    createdAt?: string
}

export interface UpdateReviewDTO {
    id: string
    bookingId: string
    rating: number
    comment: string
    updatedAt?: string
}